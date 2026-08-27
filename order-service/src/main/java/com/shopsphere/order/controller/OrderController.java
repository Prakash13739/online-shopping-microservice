package com.shopsphere.order.controller;

import com.shopsphere.order.client.InventoryClient;
import com.shopsphere.order.client.NotificationClient;
import com.shopsphere.order.client.PaymentClient;
import com.shopsphere.order.dto.request.CreateOrderRequest;
import com.shopsphere.order.dto.request.OrderItemRequest;
import com.shopsphere.order.dto.request.UpdateOrderStatusRequest;
import com.shopsphere.order.dto.response.ApiResponse;
import com.shopsphere.order.dto.response.OrderDto;
import com.shopsphere.order.dto.response.OrderItemDto;
import com.shopsphere.order.entity.Order;
import com.shopsphere.order.entity.OrderItem;
import com.shopsphere.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private InventoryClient inventoryClient;

    @Autowired
    private PaymentClient paymentClient;

    @Autowired
    private NotificationClient notificationClient;

    private Long resolveUserId(String headerUserId, Long paramUserId) {
        if (paramUserId != null) return paramUserId;
        if (headerUserId != null && !headerUserId.isBlank()) {
            try { return Long.parseLong(headerUserId); } catch (Exception ignored) {}
        }
        return 2L; // Default demo customer
    }

    private OrderDto toDto(Order o) {
        List<OrderItemDto> itemDtos = o.getItems().stream()
                .map(i -> new OrderItemDto(
                        i.getId(),
                        i.getProductId(),
                        i.getProductName(),
                        i.getProductImage(),
                        i.getUnitPrice(),
                        i.getQuantity(),
                        i.getSubtotal()
                )).toList();

        return new OrderDto(
                o.getId(),
                o.getOrderNumber(),
                o.getUserId(),
                o.getTotalAmount(),
                o.getShippingAmount(),
                o.getDiscountAmount(),
                o.getGrandTotal(),
                o.getStatus(),
                o.getPaymentMethod(),
                o.getShippingAddress(),
                itemDtos,
                o.getCreatedAt(),
                o.getUpdatedAt()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDto>>> getOrders(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestHeader(value = "X-User-Role", required = false) String headerRole,
            @RequestParam(required = false) Long userId) {

        List<Order> orders;
        if ("ROLE_ADMIN".equalsIgnoreCase(headerRole) && userId == null) {
            orders = orderRepository.findAll();
        } else {
            Long uid = resolveUserId(headerUserId, userId);
            orders = orderRepository.findByUserIdOrderByCreatedAtDesc(uid);
        }

        List<OrderDto> dtos = orders.stream().map(this::toDto).toList();
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", dtos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(o -> ResponseEntity.ok(ApiResponse.success("Order found", toDto(o))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Order not found: " + id, "ORDER_NOT_FOUND")));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestBody CreateOrderRequest request) {

        Long uid = (request.userId() != null) ? request.userId() : resolveUserId(headerUserId, null);

        if (request.items() == null || request.items().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Order must contain at least one item", "EMPTY_ORDER"));
        }

        // ==========================================
        // SAGA STEP 1: RESERVE INVENTORY
        // ==========================================
        List<Map<String, Object>> stockItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest item : request.items()) {
            stockItems.add(Map.of(
                    "productId", item.productId(),
                    "quantity", item.quantity()
            ));
            BigDecimal lineTotal = item.unitPrice().multiply(BigDecimal.valueOf(item.quantity()));
            totalAmount = totalAmount.add(lineTotal);
        }

        try {
            inventoryClient.reserveStock(Map.of("items", stockItems));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to reserve stock: " + e.getMessage(), "INSUFFICIENT_STOCK"));
        }

        // Calculate final amounts
        BigDecimal shipping = (totalAmount.compareTo(new BigDecimal("100.00")) >= 0) ? BigDecimal.ZERO : new BigDecimal("15.00");
        BigDecimal discount = (request.discountAmount() != null) ? request.discountAmount() : BigDecimal.ZERO;
        BigDecimal grandTotal = totalAmount.add(shipping).subtract(discount);

        String orderNumber = "ORD-" + System.currentTimeMillis();

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUserId(uid);
        order.setTotalAmount(totalAmount);
        order.setShippingAmount(shipping);
        order.setDiscountAmount(discount);
        order.setGrandTotal(grandTotal);
        order.setPaymentMethod(request.paymentMethod() != null ? request.paymentMethod() : "CARD");
        order.setShippingAddress(request.shippingAddress() != null ? request.shippingAddress() : "Standard Customer Address");
        order.setStatus("PAYMENT_PENDING");

        Order savedOrder = orderRepository.save(order);

        for (OrderItemRequest itemReq : request.items()) {
            OrderItem item = new OrderItem();
            item.setOrder(savedOrder);
            item.setProductId(itemReq.productId());
            item.setProductName(itemReq.productName());
            item.setProductImage(itemReq.productImage());
            item.setUnitPrice(itemReq.unitPrice());
            item.setQuantity(itemReq.quantity());
            savedOrder.getItems().add(item);
        }
        savedOrder = orderRepository.save(savedOrder);

        // ==========================================
        // SAGA STEP 2: PROCESS PAYMENT SIMULATION
        // ==========================================
        boolean paymentSuccess = false;
        try {
            Map<String, Object> payRequest = new HashMap<>();
            payRequest.put("orderId", savedOrder.getId());
            payRequest.put("userId", uid);
            payRequest.put("amount", grandTotal);
            payRequest.put("paymentMethod", savedOrder.getPaymentMethod());
            payRequest.put("simulateFailure", Boolean.TRUE.equals(request.simulateFailure()));

            Map<String, Object> payResp = paymentClient.processPayment(payRequest);
            if (payResp != null && Boolean.TRUE.equals(payResp.get("success"))) {
                paymentSuccess = true;
            }
        } catch (Exception e) {
            paymentSuccess = false;
        }

        // ==========================================
        // SAGA STEP 3: CONFIRM OR COMPENSATE
        // ==========================================
        if (paymentSuccess) {
            // Deduct stock permanently
            try {
                inventoryClient.deductStock(Map.of("items", stockItems));
            } catch (Exception ignored) {}

            savedOrder.setStatus("CONFIRMED");
            savedOrder = orderRepository.save(savedOrder);

            // Send notification
            try {
                notificationClient.createNotification(Map.of(
                        "userId", uid,
                        "orderId", savedOrder.getId(),
                        "type", "ORDER_CONFIRMED",
                        "title", "Order #" + savedOrder.getOrderNumber() + " Confirmed!",
                        "message", "Your payment was successful. We are now processing your order for $" + grandTotal
                ));
            } catch (Exception ignored) {}

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Order placed and confirmed successfully", toDto(savedOrder)));
        } else {
            // SAGA COMPENSATION: Release reserved inventory
            try {
                inventoryClient.releaseStock(Map.of("items", stockItems));
            } catch (Exception ignored) {}

            savedOrder.setStatus("FAILED");
            savedOrder = orderRepository.save(savedOrder);

            try {
                notificationClient.createNotification(Map.of(
                        "userId", uid,
                        "orderId", savedOrder.getId(),
                        "type", "PAYMENT_FAILED",
                        "title", "Payment Failed for Order #" + savedOrder.getOrderNumber(),
                        "message", "Payment could not be processed. Any reserved items have been restored to stock."
                ));
            } catch (Exception ignored) {}

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Payment failed. Order has been cancelled and stock released.", "PAYMENT_FAILED"));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request) {

        Optional<Order> opt = orderRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Order not found: " + id, "ORDER_NOT_FOUND"));
        }

        Order order = opt.get();
        order.setStatus(request.status().toUpperCase());
        Order saved = orderRepository.save(order);

        // Send tracking notification
        try {
            notificationClient.createNotification(Map.of(
                    "userId", saved.getUserId(),
                    "orderId", saved.getId(),
                    "type", "ORDER_STATUS_UPDATE",
                    "title", "Order Status Updated: " + saved.getStatus(),
                    "message", "Your order #" + saved.getOrderNumber() + " is now " + saved.getStatus()
            ));
        } catch (Exception ignored) {}

        return ResponseEntity.ok(ApiResponse.success("Order status updated", toDto(saved)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        List<Order> all = orderRepository.findAll();
        BigDecimal totalRevenue = all.stream()
                .filter(o -> !"FAILED".equalsIgnoreCase(o.getStatus()) && !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .map(Order::getGrandTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalOrders = all.size();
        long delivered = orderRepository.countByStatus("DELIVERED");
        long processing = orderRepository.countByStatus("PROCESSING");
        long confirmed = orderRepository.countByStatus("CONFIRMED");
        long shipped = orderRepository.countByStatus("SHIPPED");

        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("totalOrders", totalOrders);
        result.put("delivered", delivered);
        result.put("processing", processing);
        result.put("confirmed", confirmed);
        result.put("shipped", shipped);

        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved", result));
    }
}

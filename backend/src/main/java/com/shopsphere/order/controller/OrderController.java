package com.shopsphere.order.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.inventory.entity.Inventory;
import com.shopsphere.inventory.repository.InventoryRepository;
import com.shopsphere.notification.entity.Notification;
import com.shopsphere.notification.repository.NotificationRepository;
import com.shopsphere.order.dto.request.CreateOrderRequest;
import com.shopsphere.order.dto.request.OrderItemRequest;
import com.shopsphere.order.dto.request.UpdateOrderStatusRequest;
import com.shopsphere.order.dto.response.OrderDto;
import com.shopsphere.order.dto.response.OrderItemDto;
import com.shopsphere.order.entity.Order;
import com.shopsphere.order.entity.OrderItem;
import com.shopsphere.order.repository.OrderRepository;
import com.shopsphere.payment.entity.Payment;
import com.shopsphere.payment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

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
        for (OrderItemRequest item : request.items()) {
            Optional<Inventory> opt = inventoryRepository.findByProductId(item.productId());
            if (opt.isEmpty() || opt.get().getQuantityAvailable() < item.quantity()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Insufficient stock for product ID: " + item.productId(), "INSUFFICIENT_STOCK"));
            }
        }

        // Reserve stock
        for (OrderItemRequest item : request.items()) {
            Inventory inv = inventoryRepository.findByProductId(item.productId()).get();
            inv.setQuantityAvailable(inv.getQuantityAvailable() - item.quantity());
            inv.setQuantityReserved(inv.getQuantityReserved() + item.quantity());
            inv.recalculateStatus();
            inventoryRepository.save(inv);
        }

        // Calculate totals
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItemRequest item : request.items()) {
            totalAmount = totalAmount.add(item.unitPrice().multiply(BigDecimal.valueOf(item.quantity())));
        }

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
        String method = savedOrder.getPaymentMethod();
        String txnId = "TXN-" + System.currentTimeMillis() + "-" + method;

        Payment payment = new Payment();
        payment.setOrderId(savedOrder.getId());
        payment.setUserId(uid);
        payment.setAmount(grandTotal);
        payment.setPaymentMethod(method);
        payment.setTransactionId(txnId);

        boolean paymentSuccess = !Boolean.TRUE.equals(request.simulateFailure());

        if (paymentSuccess) {
            payment.setStatus("SUCCESS");
            paymentRepository.save(payment);

            // Deduct stock permanently
            for (OrderItemRequest item : request.items()) {
                inventoryRepository.findByProductId(item.productId()).ifPresent(inv -> {
                    inv.setQuantityReserved(Math.max(0, inv.getQuantityReserved() - item.quantity()));
                    inv.recalculateStatus();
                    inventoryRepository.save(inv);
                });
            }

            savedOrder.setStatus("CONFIRMED");
            savedOrder = orderRepository.save(savedOrder);

            // Notification
            Notification notif = new Notification();
            notif.setUserId(uid);
            notif.setOrderId(savedOrder.getId());
            notif.setType("ORDER_CONFIRMED");
            notif.setTitle("Order #" + savedOrder.getOrderNumber() + " Confirmed!");
            notif.setMessage("Your payment was successful. We are now processing your order for $" + grandTotal);
            notificationRepository.save(notif);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Order placed and confirmed successfully", toDto(savedOrder)));
        } else {
            payment.setStatus("FAILED");
            payment.setErrorMessage("Payment simulation declined by test engine");
            paymentRepository.save(payment);

            // SAGA COMPENSATION: Release reserved inventory
            for (OrderItemRequest item : request.items()) {
                inventoryRepository.findByProductId(item.productId()).ifPresent(inv -> {
                    int releaseQty = Math.min(inv.getQuantityReserved(), item.quantity());
                    inv.setQuantityReserved(inv.getQuantityReserved() - releaseQty);
                    inv.setQuantityAvailable(inv.getQuantityAvailable() + releaseQty);
                    inv.recalculateStatus();
                    inventoryRepository.save(inv);
                });
            }

            savedOrder.setStatus("FAILED");
            savedOrder = orderRepository.save(savedOrder);

            Notification notif = new Notification();
            notif.setUserId(uid);
            notif.setOrderId(savedOrder.getId());
            notif.setType("PAYMENT_FAILED");
            notif.setTitle("Payment Failed for Order #" + savedOrder.getOrderNumber());
            notif.setMessage("Payment could not be processed. Any reserved items have been restored to stock.");
            notificationRepository.save(notif);

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

        Notification notif = new Notification();
        notif.setUserId(saved.getUserId());
        notif.setOrderId(saved.getId());
        notif.setType("ORDER_STATUS_UPDATE");
        notif.setTitle("Order Status Updated: " + saved.getStatus());
        notif.setMessage("Your order #" + saved.getOrderNumber() + " is now " + saved.getStatus());
        notificationRepository.save(notif);

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

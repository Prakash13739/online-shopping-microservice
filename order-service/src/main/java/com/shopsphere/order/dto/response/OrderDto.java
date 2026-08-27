package com.shopsphere.order.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDto(
        Long id,
        String orderNumber,
        Long userId,
        BigDecimal totalAmount,
        BigDecimal shippingAmount,
        BigDecimal discountAmount,
        BigDecimal grandTotal,
        String status,
        String paymentMethod,
        String shippingAddress,
        List<OrderItemDto> items,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}

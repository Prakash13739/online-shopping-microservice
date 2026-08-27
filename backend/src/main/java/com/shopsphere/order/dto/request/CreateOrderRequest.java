package com.shopsphere.order.dto.request;

import java.math.BigDecimal;
import java.util.List;

public record CreateOrderRequest(
        Long userId,
        String shippingAddress,
        String paymentMethod,
        BigDecimal discountAmount,
        Boolean simulateFailure,
        List<OrderItemRequest> items
) {}

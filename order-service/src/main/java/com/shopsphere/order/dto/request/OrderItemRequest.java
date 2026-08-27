package com.shopsphere.order.dto.request;

import java.math.BigDecimal;

public record OrderItemRequest(
        Long productId,
        String productName,
        String productImage,
        BigDecimal unitPrice,
        Integer quantity
) {}

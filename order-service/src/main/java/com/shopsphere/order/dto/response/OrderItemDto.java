package com.shopsphere.order.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderItemDto(
        Long id,
        Long productId,
        String productName,
        String productImage,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal subtotal
) {}

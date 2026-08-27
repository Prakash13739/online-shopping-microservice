package com.shopsphere.cart.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record CartDto(
        Long id,
        Long userId,
        List<CartItemDto> items,
        Integer totalItems,
        BigDecimal totalAmount
) {}

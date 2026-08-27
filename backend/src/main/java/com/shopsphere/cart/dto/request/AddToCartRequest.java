package com.shopsphere.cart.dto.request;

public record AddToCartRequest(
        Long productId,
        Integer quantity
) {}

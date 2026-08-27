package com.shopsphere.inventory.dto.request;

public record StockItem(
        Long productId,
        String sku,
        Integer quantity
) {}

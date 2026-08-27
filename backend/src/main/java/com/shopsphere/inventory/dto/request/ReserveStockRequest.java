package com.shopsphere.inventory.dto.request;

import java.util.List;

public record ReserveStockRequest(
        List<StockItem> items
) {}

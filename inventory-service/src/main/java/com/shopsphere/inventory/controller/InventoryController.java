package com.shopsphere.inventory.controller;

import com.shopsphere.inventory.dto.request.ReserveStockRequest;
import com.shopsphere.inventory.dto.request.StockItem;
import com.shopsphere.inventory.dto.response.ApiResponse;
import com.shopsphere.inventory.entity.Inventory;
import com.shopsphere.inventory.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Inventory>>> getAllInventory() {
        return ResponseEntity.ok(ApiResponse.success("All inventory retrieved", inventoryRepository.findAll()));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<Inventory>> getInventoryByProductId(@PathVariable Long productId) {
        return inventoryRepository.findByProductId(productId)
                .map(i -> ResponseEntity.ok(ApiResponse.success("Inventory found", i)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Inventory not found for product: " + productId, "INVENTORY_NOT_FOUND")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Inventory>> createInventory(@RequestBody Inventory inventory) {
        inventory.recalculateStatus();
        Inventory saved = inventoryRepository.save(inventory);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Inventory created", saved));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<Inventory>> updateStock(@PathVariable Long productId,
                                                              @RequestBody Map<String, Object> body) {
        Optional<Inventory> opt = inventoryRepository.findByProductId(productId);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Inventory not found for product: " + productId, "INVENTORY_NOT_FOUND"));
        }
        Inventory inv = opt.get();
        if (body.containsKey("quantityAvailable")) {
            inv.setQuantityAvailable(Integer.parseInt(body.get("quantityAvailable").toString()));
        }
        if (body.containsKey("reorderLevel")) {
            inv.setReorderLevel(Integer.parseInt(body.get("reorderLevel").toString()));
        }
        inv.recalculateStatus();
        Inventory saved = inventoryRepository.save(inv);
        return ResponseEntity.ok(ApiResponse.success("Inventory updated", saved));
    }

    @PostMapping("/reserve")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> reserveStock(@RequestBody ReserveStockRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No items to reserve", "INVALID_REQUEST"));
        }

        // 1. First pass: verify sufficient stock for all items
        for (StockItem item : request.items()) {
            Optional<Inventory> opt = inventoryRepository.findByProductId(item.productId());
            if (opt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Product inventory not found: " + item.productId(), "INSUFFICIENT_STOCK"));
            }
            Inventory inv = opt.get();
            if (inv.getQuantityAvailable() < item.quantity()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Insufficient stock for product ID " + item.productId() +
                                ". Requested: " + item.quantity() + ", Available: " + inv.getQuantityAvailable(),
                                "INSUFFICIENT_STOCK"));
            }
        }

        // 2. Second pass: perform reservations
        for (StockItem item : request.items()) {
            Inventory inv = inventoryRepository.findByProductId(item.productId()).get();
            inv.setQuantityAvailable(inv.getQuantityAvailable() - item.quantity());
            inv.setQuantityReserved(inv.getQuantityReserved() + item.quantity());
            inv.recalculateStatus();
            inventoryRepository.save(inv);
        }

        return ResponseEntity.ok(ApiResponse.success("Stock reserved successfully", Map.of("reserved", true)));
    }

    @PostMapping("/deduct")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> deductStock(@RequestBody ReserveStockRequest request) {
        if (request.items() != null) {
            for (StockItem item : request.items()) {
                inventoryRepository.findByProductId(item.productId()).ifPresent(inv -> {
                    inv.setQuantityReserved(Math.max(0, inv.getQuantityReserved() - item.quantity()));
                    inv.recalculateStatus();
                    inventoryRepository.save(inv);
                });
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Stock deducted successfully", Map.of("deducted", true)));
    }

    @PostMapping("/release")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> releaseStock(@RequestBody ReserveStockRequest request) {
        if (request.items() != null) {
            for (StockItem item : request.items()) {
                inventoryRepository.findByProductId(item.productId()).ifPresent(inv -> {
                    int releaseQty = Math.min(inv.getQuantityReserved(), item.quantity());
                    inv.setQuantityReserved(inv.getQuantityReserved() - releaseQty);
                    inv.setQuantityAvailable(inv.getQuantityAvailable() + releaseQty);
                    inv.recalculateStatus();
                    inventoryRepository.save(inv);
                });
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Stock released successfully", Map.of("released", true)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInventoryStats() {
        long inStock = inventoryRepository.countByStatus("IN_STOCK");
        long lowStock = inventoryRepository.countByStatus("LOW_STOCK");
        long outOfStock = inventoryRepository.countByStatus("OUT_OF_STOCK");
        long totalItems = inventoryRepository.count();

        return ResponseEntity.ok(ApiResponse.success("Inventory stats", Map.of(
                "totalItems", totalItems,
                "inStock", inStock,
                "lowStock", lowStock,
                "outOfStock", outOfStock
        )));
    }
}

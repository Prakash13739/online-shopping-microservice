package com.shopsphere.product.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.product.entity.Category;
import com.shopsphere.product.entity.Product;
import com.shopsphere.product.repository.CategoryRepository;
import com.shopsphere.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // ===================== PRODUCT ENDPOINTS =====================

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<Page<Product>>> getProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> products = productRepository.findWithFilters(categoryId, search, minPrice, maxPrice, pageable);

        products.forEach(p -> categoryRepository.findById(p.getCategoryId())
                .ifPresent(c -> p.setCategoryName(c.getName())));

        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable(value = "id") Long id) {
        return productRepository.findById(id)
                .map(p -> {
                    categoryRepository.findById(p.getCategoryId()).ifPresent(c -> p.setCategoryName(c.getName()));
                    return ResponseEntity.ok(ApiResponse.success("Product found", p));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Product not found with id: " + id, "PRODUCT_NOT_FOUND")));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
        if (product.getSlug() == null || product.getSlug().isBlank()) {
            product.setSlug(product.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        Product saved = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Product created", saved));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable(value = "id") Long id, @RequestBody Product updates) {
        return productRepository.findById(id)
                .map(p -> {
                    if (updates.getName() != null) p.setName(updates.getName());
                    if (updates.getDescription() != null) p.setDescription(updates.getDescription());
                    if (updates.getPrice() != null) p.setPrice(updates.getPrice());
                    if (updates.getDiscountPrice() != null) p.setDiscountPrice(updates.getDiscountPrice());
                    if (updates.getCategoryId() != null) p.setCategoryId(updates.getCategoryId());
                    if (updates.getImageUrl() != null) p.setImageUrl(updates.getImageUrl());
                    if (updates.getStatus() != null) p.setStatus(updates.getStatus());
                    if (updates.getBrand() != null) p.setBrand(updates.getBrand());
                    return ResponseEntity.ok(ApiResponse.success("Product updated", productRepository.save(p)));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Product not found", "PRODUCT_NOT_FOUND")));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable(value = "id") Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Product not found", "PRODUCT_NOT_FOUND"));
        }
        productRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", null));
    }

    @GetMapping("/products/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductStats() {
        long total = productRepository.count();
        long active = productRepository.countByStatus("ACTIVE");
        return ResponseEntity.ok(ApiResponse.success("Product stats", Map.of(
                "total", total, "active", active, "inactive", total - active)));
    }

    // ===================== CATEGORY ENDPOINTS =====================

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllCategories() {
        List<Map<String, Object>> categoriesWithCount = categoryRepository.findAll().stream()
                .filter(c -> "ACTIVE".equals(c.getStatus()))
                .map(c -> {
                    Map<String, Object> map = new java.util.LinkedHashMap<>();
                    map.put("id", c.getId());
                    map.put("name", c.getName());
                    map.put("slug", c.getSlug());
                    map.put("description", c.getDescription());
                    map.put("imageUrl", c.getImageUrl());
                    map.put("status", c.getStatus());
                    map.put("productCount", productRepository.countByCategoryId(c.getId()));
                    return map;
                })
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved", categoriesWithCount));
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable(value = "id") Long id) {
        return categoryRepository.findById(id)
                .map(c -> ResponseEntity.ok(ApiResponse.success("Category found", c)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Category not found", "CATEGORY_NOT_FOUND")));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody Category category) {
        if (category.getSlug() == null || category.getSlug().isBlank()) {
            category.setSlug(category.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        Category saved = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Category created", saved));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable(value = "id") Long id, @RequestBody Category updates) {
        return categoryRepository.findById(id)
                .map(c -> {
                    if (updates.getName() != null) c.setName(updates.getName());
                    if (updates.getDescription() != null) c.setDescription(updates.getDescription());
                    if (updates.getImageUrl() != null) c.setImageUrl(updates.getImageUrl());
                    if (updates.getStatus() != null) c.setStatus(updates.getStatus());
                    return ResponseEntity.ok(ApiResponse.success("Category updated", categoryRepository.save(c)));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Category not found", "CATEGORY_NOT_FOUND")));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable(value = "id") Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Category not found", "CATEGORY_NOT_FOUND"));
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted", null));
    }
}

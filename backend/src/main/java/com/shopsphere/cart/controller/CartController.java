package com.shopsphere.cart.controller;

import com.shopsphere.cart.dto.request.AddToCartRequest;
import com.shopsphere.cart.dto.response.CartDto;
import com.shopsphere.cart.dto.response.CartItemDto;
import com.shopsphere.cart.entity.Cart;
import com.shopsphere.cart.entity.CartItem;
import com.shopsphere.cart.repository.CartItemRepository;
import com.shopsphere.cart.repository.CartRepository;
import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.product.entity.Product;
import com.shopsphere.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    private Long resolveUserId(String headerUserId, Long paramUserId) {
        if (paramUserId != null) return paramUserId;
        if (headerUserId != null && !headerUserId.isBlank()) {
            try { return Long.parseLong(headerUserId); } catch (Exception ignored) {}
        }
        return 2L; // Default demo customer
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });
    }

    private CartDto toCartDto(Cart cart) {
        List<CartItemDto> items = cart.getItems().stream()
                .map(item -> new CartItemDto(
                        item.getId(),
                        item.getProductId(),
                        item.getProductName(),
                        item.getProductImage(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getSubtotal()
                ))
                .toList();

        int totalItems = items.stream().mapToInt(CartItemDto::quantity).sum();
        BigDecimal totalAmount = items.stream()
                .map(CartItemDto::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartDto(cart.getId(), cart.getUserId(), items, totalItems, totalAmount);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestParam(required = false) Long userId) {

        Long uid = resolveUserId(headerUserId, userId);
        Cart cart = getOrCreateCart(uid);
        return ResponseEntity.ok(ApiResponse.success("Cart retrieved", toCartDto(cart)));
    }

    @PostMapping("/items")
    @Transactional
    public ResponseEntity<ApiResponse<CartDto>> addItem(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestParam(required = false) Long userId,
            @RequestBody AddToCartRequest request) {

        Long uid = resolveUserId(headerUserId, userId);
        Cart cart = getOrCreateCart(uid);

        int qtyToAdd = (request.quantity() != null && request.quantity() > 0) ? request.quantity() : 1;

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), request.productId());

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + qtyToAdd);
            cartItemRepository.save(item);
        } else {
            Optional<Product> prodOpt = productRepository.findById(request.productId());
            String name = prodOpt.map(Product::getName).orElse("Product #" + request.productId());
            String image = prodOpt.map(Product::getImageUrl).orElse("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500");
            BigDecimal price = prodOpt.map(p -> p.getDiscountPrice() != null ? p.getDiscountPrice() : p.getPrice())
                    .orElse(new BigDecimal("49.99"));

            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProductId(request.productId());
            newItem.setProductName(name);
            newItem.setProductImage(image);
            newItem.setUnitPrice(price);
            newItem.setQuantity(qtyToAdd);
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", toCartDto(updatedCart)));
    }

    @PutMapping("/items/{productId}")
    @Transactional
    public ResponseEntity<ApiResponse<CartDto>> updateQuantity(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestParam(required = false) Long userId,
            @PathVariable Long productId,
            @RequestBody java.util.Map<String, Integer> body) {

        Long uid = resolveUserId(headerUserId, userId);
        Cart cart = getOrCreateCart(uid);
        Integer newQty = body.get("quantity");

        Optional<CartItem> itemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);
        if (itemOpt.isPresent()) {
            CartItem item = itemOpt.get();
            if (newQty == null || newQty <= 0) {
                cart.getItems().remove(item);
                cartItemRepository.delete(item);
            } else {
                item.setQuantity(newQty);
                cartItemRepository.save(item);
            }
        }

        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", toCartDto(updatedCart)));
    }

    @DeleteMapping("/items/{productId}")
    @Transactional
    public ResponseEntity<ApiResponse<CartDto>> removeItem(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestParam(required = false) Long userId,
            @PathVariable Long productId) {

        Long uid = resolveUserId(headerUserId, userId);
        Cart cart = getOrCreateCart(uid);
        cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .ifPresent(item -> {
                    cart.getItems().remove(item);
                    cartItemRepository.delete(item);
                });

        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", toCartDto(updatedCart)));
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<ApiResponse<CartDto>> clearCart(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestParam(required = false) Long userId) {

        Long uid = resolveUserId(headerUserId, userId);
        Cart cart = getOrCreateCart(uid);
        cart.getItems().clear();
        cartRepository.save(cart);

        return ResponseEntity.ok(ApiResponse.success("Cart cleared", toCartDto(cart)));
    }
}

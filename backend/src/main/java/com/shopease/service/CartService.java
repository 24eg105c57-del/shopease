package com.shopease.service;

import com.shopease.dto.AddToCartRequest;
import com.shopease.dto.CartDto;
import com.shopease.dto.UpdateCartItemRequest;

public interface CartService {
    CartDto getCart(String userEmail);
    CartDto addToCart(String userEmail, AddToCartRequest request);
    CartDto updateCartItem(String userEmail, String itemId, UpdateCartItemRequest request);
    CartDto removeFromCart(String userEmail, String itemId);
    void clearCart(String userEmail);
}

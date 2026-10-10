package com.shopease.service;

import com.shopease.dto.AddToCartRequest;
import com.shopease.dto.CartDto;
import com.shopease.dto.CartItemDto;
import com.shopease.dto.UpdateCartItemRequest;
import com.shopease.exception.InsufficientStockException;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.exception.UnauthorizedAccessException;
import com.shopease.model.CartItem;
import com.shopease.model.Product;
import com.shopease.model.User;
import com.shopease.repository.CartItemRepository;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartItemRepository cartItemRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    public CartDto getCart(String userEmail) {
        List<CartItem> items = cartItemRepository.findByUserEmail(userEmail);
        return mapToCartDto(items);
    }

    @Override
    public CartDto addToCart(String userEmail, AddToCartRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        int requestedQty = request.getQuantity();
        if (product.getStockQuantity() < requestedQty) {
            throw new InsufficientStockException("Insufficient stock for product '" + product.getName()
                    + "'. Available stock: " + product.getStockQuantity());
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserEmailAndProductId(userEmail, product.getId());
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQty = existingItem.getQuantity() + requestedQty;
            if (product.getStockQuantity() < newQty) {
                throw new InsufficientStockException("Cannot add " + requestedQty + " more units. Only "
                        + product.getStockQuantity() + " available in stock.");
            }
            existingItem.setQuantity(newQty);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem(
                    null,
                    userEmail,
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    product.getImageUrl(),
                    product.getCategoryName(),
                    product.getStockQuantity(),
                    requestedQty
            );
            cartItemRepository.save(newItem);
        }

        return getCart(userEmail);
    }

    @Override
    public CartDto updateCartItem(String userEmail, String itemId, UpdateCartItemRequest request) {
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!cartItem.getUserEmail().equalsIgnoreCase(userEmail)) {
            throw new UnauthorizedAccessException("You do not have permission to modify this cart item");
        }

        if (request.getQuantity() <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElse(null);
            if (product != null && product.getStockQuantity() < request.getQuantity()) {
                throw new InsufficientStockException("Only " + product.getStockQuantity()
                        + " units available for product '" + product.getName() + "'");
            }
            cartItem.setQuantity(request.getQuantity());
            cartItemRepository.save(cartItem);
        }

        return getCart(userEmail);
    }

    @Override
    public CartDto removeFromCart(String userEmail, String itemId) {
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!cartItem.getUserEmail().equalsIgnoreCase(userEmail)) {
            throw new UnauthorizedAccessException("You do not have permission to delete this cart item");
        }

        cartItemRepository.delete(cartItem);
        return getCart(userEmail);
    }

    @Override
    public void clearCart(String userEmail) {
        cartItemRepository.deleteByUserEmail(userEmail);
    }

    private CartDto mapToCartDto(List<CartItem> items) {
        List<CartItemDto> itemDtos = items.stream().map(item -> {
            double subtotal = item.getProductPrice() * item.getQuantity();
            return new CartItemDto(
                    item.getId(),
                    item.getProductId(),
                    item.getProductName(),
                    item.getProductPrice(),
                    item.getProductImage(),
                    item.getStockQuantity(),
                    item.getCategoryName(),
                    item.getQuantity(),
                    subtotal
            );
        }).collect(Collectors.toList());

        double total = itemDtos.stream().mapToDouble(CartItemDto::getSubtotal).sum();
        int totalItems = itemDtos.stream().mapToInt(CartItemDto::getQuantity).sum();

        return new CartDto(itemDtos, Math.round(total * 100.0) / 100.0, totalItems);
    }
}

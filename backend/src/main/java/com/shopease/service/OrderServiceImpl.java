package com.shopease.service;

import com.shopease.dto.CheckoutRequest;
import com.shopease.dto.OrderDto;
import com.shopease.dto.OrderItemDto;
import com.shopease.dto.OrderItemRequest;
import com.shopease.exception.InsufficientStockException;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.exception.UnauthorizedAccessException;
import com.shopease.model.*;
import com.shopease.repository.CartItemRepository;
import com.shopease.repository.OrderRepository;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            CartItemRepository cartItemRepository,
                            ProductRepository productRepository,
                            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public OrderDto createOrder(String userEmail, CheckoutRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        List<OrderItemRequest> itemsToProcess = request.getItems();

        // If items are not passed explicitly in request, read from the user's persisted database cart
        if (itemsToProcess == null || itemsToProcess.isEmpty()) {
            List<CartItem> cartItems = cartItemRepository.findByUserEmail(userEmail);
            if (cartItems.isEmpty()) {
                throw new RuntimeException("Cannot place order with an empty cart");
            }
            itemsToProcess = cartItems.stream()
                    .map(ci -> new OrderItemRequest(ci.getProductId(), ci.getQuantity()))
                    .collect(Collectors.toList());
        }

        // Generate unique order number
        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUserEmail(user.getEmail());
        order.setCustomerName(request.getCustomerName().trim());
        order.setPhoneNumber(request.getPhoneNumber().trim());
        order.setDeliveryAddress(request.getDeliveryAddress().trim());
        order.setPaymentMethod("CASH_ON_DELIVERY");
        order.setStatus("CONFIRMED");
        order.setCreatedAt(LocalDateTime.now());

        double totalAmount = 0.0;

        for (OrderItemRequest itemReq : itemsToProcess) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + itemReq.getProductId() + " not found"));

            int requestedQty = itemReq.getQuantity();
            if (requestedQty <= 0) {
                throw new RuntimeException("Item quantity must be greater than zero");
            }

            // Inventory check
            if (product.getStockQuantity() < requestedQty) {
                throw new InsufficientStockException("Insufficient stock for product '" + product.getName()
                        + "'. Available stock: " + product.getStockQuantity() + ", requested: " + requestedQty);
            }

            // Reduce stock safely (prevents negative inventory)
            product.setStockQuantity(product.getStockQuantity() - requestedQty);
            productRepository.save(product);

            // Recalculate price on backend
            double unitPrice = product.getPrice();
            double subtotal = Math.round(unitPrice * requestedQty * 100.0) / 100.0;
            totalAmount += subtotal;

            OrderItem orderItem = new OrderItem(
                    product.getId(),
                    product.getName(),
                    unitPrice,
                    requestedQty,
                    subtotal,
                    product.getImageUrl()
            );

            order.addItem(orderItem);
        }

        order.setTotalAmount(Math.round(totalAmount * 100.0) / 100.0);
        Order savedOrder = orderRepository.save(order);

        // Clear user's persisted database cart after successful order creation
        cartItemRepository.deleteByUserEmail(userEmail);

        return mapToOrderDto(savedOrder);
    }

    @Override
    public List<OrderDto> getCustomerOrders(String userEmail) {
        List<Order> orders = orderRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
        return orders.stream().map(this::mapToOrderDto).collect(Collectors.toList());
    }

    @Override
    public OrderDto getOrderById(String userEmail, String orderId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!isAdmin && !order.getUserEmail().equalsIgnoreCase(userEmail)) {
            throw new UnauthorizedAccessException("You do not have permission to view this order");
        }

        return mapToOrderDto(order);
    }

    @Override
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToOrderDto).collect(Collectors.toList());
    }

    private OrderDto mapToOrderDto(Order order) {
        List<OrderItemDto> itemDtos = order.getItems().stream().map(item -> new OrderItemDto(
                item.getProductId(),
                item.getProductId(),
                item.getProductName(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getSubtotal(),
                item.getImageUrl()
        )).collect(Collectors.toList());

        return new OrderDto(
                order.getId(),
                order.getOrderNumber(),
                order.getCustomerName(),
                order.getPhoneNumber(),
                order.getDeliveryAddress(),
                order.getTotalAmount(),
                order.getPaymentMethod(),
                order.getStatus(),
                order.getCreatedAt(),
                itemDtos
        );
    }
}

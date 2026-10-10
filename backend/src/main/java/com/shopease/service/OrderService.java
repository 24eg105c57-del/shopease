package com.shopease.service;

import com.shopease.dto.CheckoutRequest;
import com.shopease.dto.OrderDto;

import java.util.List;

public interface OrderService {
    OrderDto createOrder(String userEmail, CheckoutRequest request);
    List<OrderDto> getCustomerOrders(String userEmail);
    OrderDto getOrderById(String userEmail, String orderId, boolean isAdmin);
    List<OrderDto> getAllOrders();
}

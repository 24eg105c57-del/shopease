package com.shopease.repository;

import com.shopease.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    Optional<Order> findByIdAndUserEmail(String id, String userEmail);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findAllByOrderByCreatedAtDesc();
}

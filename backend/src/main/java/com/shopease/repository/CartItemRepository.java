package com.shopease.repository;

import com.shopease.model.CartItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends MongoRepository<CartItem, String> {
    List<CartItem> findByUserEmail(String userEmail);
    Optional<CartItem> findByUserEmailAndProductId(String userEmail, String productId);
    void deleteByUserEmail(String userEmail);
    void deleteByUserEmailAndId(String userEmail, String id);
}

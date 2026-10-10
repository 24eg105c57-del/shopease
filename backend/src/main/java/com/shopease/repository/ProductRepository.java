package com.shopease.repository;

import com.shopease.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    boolean existsByCategoryId(String categoryId);

    Page<Product> findByCategoryId(String categoryId, Pageable pageable);

    @Query("{ $and: [ " +
           "?#{ [0] == null ? { $expr: { $eq: [1, 1] } } : { 'categoryId': [0] } }, " +
           "?#{ [1] == null ? { $expr: { $eq: [1, 1] } } : { 'price': { $gte: [1] } } }, " +
           "?#{ [2] == null ? { $expr: { $eq: [1, 1] } } : { 'price': { $lte: [2] } } } " +
           "] }")
    Page<Product> findFiltered(String categoryId, Double minPrice, Double maxPrice, Pageable pageable);
}

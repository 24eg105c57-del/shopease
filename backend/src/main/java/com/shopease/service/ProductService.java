package com.shopease.service;

import com.shopease.dto.ProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ProductService {

    Page<ProductDto> getProducts(String categoryId, Double minPrice, Double maxPrice, Pageable pageable);

    Optional<ProductDto> getProductById(String id);

    ProductDto createProduct(ProductDto productDto);

    ProductDto updateProduct(String id, ProductDto productDto);

    void deleteProduct(String id);
}

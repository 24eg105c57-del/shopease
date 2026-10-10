package com.shopease.service;

import com.shopease.dto.ProductDto;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Category;
import com.shopease.model.Product;
import com.shopease.repository.CategoryRepository;
import com.shopease.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final MongoTemplate mongoTemplate;

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              MongoTemplate mongoTemplate) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Page<ProductDto> getProducts(String categoryId, Double minPrice, Double maxPrice, Pageable pageable) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (categoryId != null && !categoryId.isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("categoryId").is(categoryId),
                    Criteria.where("category.$id").is(categoryId)
            ));
        }

        if (minPrice != null) {
            criteriaList.add(Criteria.where("price").gte(minPrice));
        }

        if (maxPrice != null) {
            criteriaList.add(Criteria.where("price").lte(maxPrice));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        long total = mongoTemplate.count(query, Product.class);
        query.with(pageable);
        List<Product> products = mongoTemplate.find(query, Product.class);

        List<ProductDto> dtos = products.stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, total);
    }

    @Override
    public Optional<ProductDto> getProductById(String id) {
        return productRepository.findById(id).map(ProductDto::fromEntity);
    }

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Product product = productDto.toEntity();
        product.setId(null);

        if (productDto.getCategoryId() != null && !productDto.getCategoryId().isBlank()) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDto.getCategoryId()));
            product.setCategory(category);
            product.setCategoryId(category.getId());
            product.setCategoryName(category.getName());
        }

        Product savedProduct = productRepository.save(product);
        return ProductDto.fromEntity(savedProduct);
    }

    @Override
    public ProductDto updateProduct(String id, ProductDto productDto) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    existingProduct.setName(productDto.getName());
                    existingProduct.setDescription(productDto.getDescription());
                    existingProduct.setPrice(productDto.getPrice());
                    existingProduct.setImageUrl(productDto.getImageUrl());
                    existingProduct.setStockQuantity(productDto.getStockQuantity());
                    existingProduct.setRating(productDto.getRating());
                    existingProduct.setReviewCount(productDto.getReviewCount());

                    if (productDto.getCategoryId() != null && !productDto.getCategoryId().isBlank()) {
                        Category category = categoryRepository.findById(productDto.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDto.getCategoryId()));
                        existingProduct.setCategory(category);
                        existingProduct.setCategoryId(category.getId());
                        existingProduct.setCategoryName(category.getName());
                    } else {
                        existingProduct.setCategory(null);
                        existingProduct.setCategoryId(null);
                        existingProduct.setCategoryName(null);
                    }

                    Product updatedProduct = productRepository.save(existingProduct);
                    return ProductDto.fromEntity(updatedProduct);
                }).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}

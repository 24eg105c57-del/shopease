package com.shopease.dto;

import com.shopease.model.Category;
import com.shopease.model.Product;

public class ProductDto {

    private String id;
    private String name;
    private String description;
    private Double price;
    private String categoryId;
    private String categoryName;
    private String imageUrl;
    private Integer stockQuantity;
    private Double rating;
    private Integer reviewCount;

    public ProductDto() {
    }

    public ProductDto(String id, String name, String description, Double price, String categoryId, String categoryName,
                      String imageUrl, Integer stockQuantity, Double rating, Integer reviewCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.imageUrl = imageUrl;
        this.stockQuantity = stockQuantity;
        this.rating = rating;
        this.reviewCount = reviewCount;
    }

    public static ProductDto fromEntity(Product product) {
        if (product == null) {
            return null;
        }
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategoryId(),
                product.getCategoryName(),
                product.getImageUrl(),
                product.getStockQuantity(),
                product.getRating(),
                product.getReviewCount()
        );
    }

    public Product toEntity() {
        Category cat = null;
        if (this.categoryId != null) {
            cat = new Category();
            cat.setId(this.categoryId);
            cat.setName(this.categoryName);
        }
        return new Product(
                this.id,
                this.name,
                this.description,
                this.price,
                cat,
                this.imageUrl,
                this.stockQuantity,
                this.rating,
                this.reviewCount
        );
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }
}

package com.shopease.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cart_items")
@CompoundIndex(name = "user_product_idx", def = "{'userEmail': 1, 'productId': 1}", unique = true)
public class CartItem {

    @Id
    private String id;

    private String userEmail;

    private String productId;
    private String productName;
    private Double productPrice;
    private String productImage;
    private String categoryName;
    private Integer stockQuantity;

    private Integer quantity;

    public CartItem() {
    }

    public CartItem(String id, String userEmail, String productId, String productName, Double productPrice,
                    String productImage, String categoryName, Integer stockQuantity, Integer quantity) {
        this.id = id;
        this.userEmail = userEmail;
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productImage = productImage;
        this.categoryName = categoryName;
        this.stockQuantity = stockQuantity;
        this.quantity = quantity;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(Double productPrice) {
        this.productPrice = productPrice;
    }

    public String getProductImage() {
        return productImage;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}

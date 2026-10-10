package com.shopease.dto;

import java.util.List;

public class CartDto {
    private List<CartItemDto> items;
    private Double totalAmount;
    private Integer totalItems;

    public CartDto() {
    }

    public CartDto(List<CartItemDto> items, Double totalAmount, Integer totalItems) {
        this.items = items;
        this.totalAmount = totalAmount;
        this.totalItems = totalItems;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }
}

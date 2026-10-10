package com.shopease.dto;

import com.shopease.model.Category;
import jakarta.validation.constraints.NotBlank;

public class CategoryDto {

    private String id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    public CategoryDto() {
    }

    public CategoryDto(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
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

    public static CategoryDto fromEntity(Category category) {
        if (category == null) return null;
        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }

    public Category toEntity() {
        return new Category(id, name, description);
    }
}

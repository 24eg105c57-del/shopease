package com.shopease.service;

import com.shopease.dto.CategoryDto;
import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(String id);
    CategoryDto createCategory(CategoryDto categoryDto);
    CategoryDto updateCategory(String id, CategoryDto categoryDto);
    void deleteCategory(String id);
}

package com.shopease.service;

import com.shopease.dto.CategoryDto;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Category;
import com.shopease.repository.CategoryRepository;
import com.shopease.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto getCategoryById(String id) {
        return categoryRepository.findById(id)
                .map(CategoryDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    @Override
    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category category = categoryDto.toEntity();
        category.setId(null);
        Category savedCategory = categoryRepository.save(category);
        return CategoryDto.fromEntity(savedCategory);
    }

    @Override
    public CategoryDto updateCategory(String id, CategoryDto categoryDto) {
        return categoryRepository.findById(id).map(existing -> {
            existing.setName(categoryDto.getName());
            existing.setDescription(categoryDto.getDescription());
            Category updated = categoryRepository.save(existing);
            return CategoryDto.fromEntity(updated);
        }).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    @Override
    public void deleteCategory(String id) {
        if (productRepository.existsByCategoryId(id)) {
            throw new RuntimeException("Cannot delete category as it contains products");
        }
        categoryRepository.deleteById(id);
    }
}

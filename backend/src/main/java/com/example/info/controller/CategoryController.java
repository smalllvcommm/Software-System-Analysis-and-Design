package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Category;
import com.example.info.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseResult<Category> createCategory(@RequestBody Category category) {
        Category savedCategory = categoryService.createCategory(category);
        return ResponseResult.success(savedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<Category> updateCategory(
            @PathVariable Long id,
            @RequestBody Category category
    ) {
        Category updatedCategory = categoryService.updateCategory(id, category);
        return ResponseResult.success(updatedCategory);
    }

    @GetMapping
    public ResponseResult<List<Category>> fetchCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<Category> categories = categoryService.findAllCategories();
        return ResponseResult.success(categories);
    }

    @GetMapping("/all")
    public ResponseResult<List<Category>> findAllCategories() {
        List<Category> categories = categoryService.findAllCategories();
        return ResponseResult.success(categories);
    }

    @GetMapping("/{id}")
    public ResponseResult<Category> fetchCategoryById(@PathVariable Long id) {
        Category category = categoryService.findById(id);
        return ResponseResult.success(category);
    }
}

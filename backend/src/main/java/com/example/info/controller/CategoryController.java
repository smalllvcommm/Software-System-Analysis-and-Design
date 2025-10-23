package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Category;
import com.example.info.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseResult<Category> createCategory(@RequestBody Category category) {
        Category savedCategory = categoryService.createCategory(category);
        return ResponseResult.success(savedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<Void> deleteCategory(@PathVariable Long id) {
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
    public ResponseResult<?> fetchCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchText
    ) {
        List<Category> categories = categoryService.findAllCategories();
        
        // 如果有搜索文本，进行过滤
        if (searchText != null && !searchText.trim().isEmpty()) {
            String search = searchText.toLowerCase();
            categories = categories.stream()
                .filter(c -> c.getName().toLowerCase().contains(search) || 
                           (c.getDescription() != null && c.getDescription().toLowerCase().contains(search)))
                .collect(java.util.stream.Collectors.toList());
        }
        
        // 构建分页响应
        int total = categories.size();
        int start = page * size;
        int end = Math.min(start + size, total);
        List<Category> pageContent = categories.subList(Math.min(start, total), end);
        
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", pageContent);
        response.put("totalElements", total);
        response.put("totalPages", (int) Math.ceil((double) total / size));
        response.put("number", page);
        response.put("size", size);
        
        return ResponseResult.success(response);
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

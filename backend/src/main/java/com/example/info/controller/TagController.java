package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Tag;
import com.example.info.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {
    private final TagService tagService;

    @PostMapping
    public ResponseResult<Tag> createTag(@RequestBody Tag tag) {
        Tag savedTag = tagService.createTag(tag);
        return ResponseResult.success(savedTag);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<Tag> updateTag(
            @PathVariable Long id,
            @RequestBody Tag tag
    ) {
        Tag updatedTag = tagService.updateTag(id, tag);
        return ResponseResult.success(updatedTag);
    }

    @GetMapping
    public ResponseResult<?> fetchTags(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchText
    ) {
        List<Tag> tags = tagService.findAllTags();
        
        // 如果有搜索文本，进行过滤
        if (searchText != null && !searchText.trim().isEmpty()) {
            String search = searchText.toLowerCase();
            tags = tags.stream()
                .filter(t -> t.getName().toLowerCase().contains(search))
                .collect(java.util.stream.Collectors.toList());
        }
        
        // 构建分页响应
        int total = tags.size();
        int start = page * size;
        int end = Math.min(start + size, total);
        List<Tag> pageContent = tags.subList(Math.min(start, total), end);
        
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", pageContent);
        response.put("totalElements", total);
        response.put("totalPages", (int) Math.ceil((double) total / size));
        response.put("number", page);
        response.put("size", size);
        
        return ResponseResult.success(response);
    }

    @GetMapping("/all")
    public ResponseResult<List<Tag>> findAllTags() {
        List<Tag> tags = tagService.findAllTags();
        return ResponseResult.success(tags);
    }

    @GetMapping("/{id}")
    public ResponseResult<Tag> fetchTagById(@PathVariable Long id) {
        Tag tag = tagService.findById(id);
        return ResponseResult.success(tag);
    }
}

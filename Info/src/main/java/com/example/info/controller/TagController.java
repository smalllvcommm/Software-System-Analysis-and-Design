package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Tag;
import com.example.info.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tags")
@RequiredArgsConstructor
public class TagController {
    private final TagService tagService;

    @PostMapping
    public ResponseResult<Tag> createTag(@RequestBody Tag tag) {
        Tag savedTag = tagService.createTag(tag);
        return ResponseResult.success(savedTag);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> deleteTag(@PathVariable Long id) {
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
    public ResponseResult<List<Tag>> fetchTags() {
        List<Tag> tags = tagService.findAllTags();
        return ResponseResult.success(tags);
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

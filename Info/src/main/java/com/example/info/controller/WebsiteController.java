package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Website;
import com.example.info.service.WebsiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/websites")
@RequiredArgsConstructor
public class WebsiteController {
    private final WebsiteService websiteService;

    @PostMapping
    public ResponseResult<Website> createWebsite(@RequestBody Website website) {
        Website savedWebsite = websiteService.createWebsite(website);
        return ResponseResult.success(savedWebsite);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> deleteWebsite(@PathVariable Long id) {
        websiteService.deleteWebsite(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<Website> updateWebsite(
            @PathVariable Long id,
            @RequestBody Website website
    ) {
        Website updatedWebsite = websiteService.updateWebsite(id, website);
        return ResponseResult.success(updatedWebsite);
    }

    @GetMapping
    public ResponseResult<Page<Website>> fetchWebsites(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false, defaultValue = "0") Long categoryId,
            @RequestParam(required = false, defaultValue = "0") Long tagId,
            @RequestParam(required = false, defaultValue = "createdTime-desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Website> websites = websiteService.fetchWebsites(searchText, categoryId, tagId, pageable);
        return ResponseResult.success(websites);
    }

    private Sort buildSort(String sortBy) {
        if ("createdTime-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "createdTime");
        } else if ("title-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "title");
        } else {
            return Sort.by(Sort.Direction.DESC, "createdTime");
        }
    }

    @GetMapping("/all")
    public ResponseResult<List<Website>> findAllWebsites() {
        List<Website> websites = websiteService.findAllWebsites();
        return ResponseResult.success(websites);
    }

    @GetMapping("/{id}")
    public ResponseResult<Website> fetchWebsiteById(@PathVariable Long id) {
        Website website = websiteService.findById(id);
        return ResponseResult.success(website);
    }
}

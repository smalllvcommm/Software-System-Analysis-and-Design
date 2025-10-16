package com.example.info.controller;


import com.example.info.common.ResponseResult;
import com.example.info.entity.Article;
import com.example.info.entity.Subject;
import com.example.info.service.ArticleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/admin/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @PostMapping
    public ResponseResult<Article> createArticle(@RequestBody Article article) {
        Article savedArticle = articleService.createArticle(article);
        return ResponseResult.success(savedArticle);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<Article> updateArticle(
            @PathVariable Long id,
            @RequestBody Article article
    ) {
        Article updatedArticle = articleService.updateArticle(id, article);
        return ResponseResult.success(updatedArticle);
    }

    @GetMapping
    public ResponseResult<Page<Article>> fetchArticles(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false, defaultValue = "all") String visibility,
            @RequestParam(required = false, defaultValue = "0"  ) Integer subjectId,
            @RequestParam(required = false, defaultValue = "0"  )  Integer tagId,
            @RequestParam(required = false, defaultValue = "createdTime-desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,    // 新增：支持前端控制页码
            @RequestParam(defaultValue = "10") int size    // 新增：支持前端控制每页条数
    ) {

        Sort sort = buildSort(sortBy);

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Article> articles = articleService.fetchArticles(
                searchText, status, subjectId, pageable, visibility, tagId
        );

        return ResponseResult.success(articles);
    }

    private Sort buildSort(String sortBy) {
        if ("createdTime-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "createdTime");
        } else if ("views-desc".equals(sortBy)) {
            return Sort.by(Sort.Direction.DESC, "views");
        } else {
            return Sort.by(Sort.Direction.DESC, "createdTime");
        }
    }

    @GetMapping("/all")
    public ResponseResult<List<Article>> findAllArticles() {
        List<Article> articles = articleService.findAllArticles();
        return ResponseResult.success(articles);
    }

    @GetMapping("/{id}")
    public ResponseResult<Article> fetchArticleById(@PathVariable Long id) {
        Article article = articleService.fetchArticleById(id);
        return ResponseResult.success(article);
    }





}
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

/**
 * 文章管理控制器
 * 处理与文章相关的HTTP请求，提供RESTful API接口
 * 路径前缀：/api/admin/articles
 */
@RestController // 标识为REST风格控制器，返回JSON格式数据
@RequestMapping("/api/admin/articles") // 定义基础请求路径
public class ArticleController {

    // 文章服务层对象，通过构造函数注入
    private final ArticleService articleService;

    /**
     * 构造函数，实现服务层依赖注入
     * @param articleService 文章服务层对象
     */
    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    /**
     * 创建新文章
     * @param article 前端传递的文章实体数据（JSON格式）
     * @return 包含创建结果的响应对象
     */
    @PostMapping // 处理POST请求，映射路径：/api/admin/articles
    public ResponseResult<Article> createArticle(@RequestBody Article article) {
        // 调用服务层创建文章
        Article savedArticle = articleService.createArticle(article);
        // 返回成功响应，包含创建的文章信息
        return ResponseResult.success(savedArticle);
    }

    /**
     * 根据ID删除文章
     * @param id 路径中的文章ID
     * @return 包含删除结果的响应对象
     */
    @DeleteMapping("/{id}") // 处理DELETE请求，映射路径：/api/admin/articles/{id}
    public ResponseResult<String> deleteArticle(@PathVariable Long id) {
        // 调用服务层删除文章
        articleService.deleteArticle(id);
        // 返回成功响应，包含删除成功消息
        return ResponseResult.success("删除成功");
    }

    /**
     * 更新文章信息
     * @param id 路径中的文章ID
     * @param article 包含更新信息的文章实体（JSON格式）
     * @return 包含更新结果的响应对象
     */
    @PutMapping("/{id}") // 处理PUT请求，映射路径：/api/admin/articles/{id}
    public ResponseResult<Article> updateArticle(
            @PathVariable Long id,
            @RequestBody Article article
    ) {
        // 调用服务层更新文章
        Article updatedArticle = articleService.updateArticle(id, article);
        // 返回成功响应，包含更新后的文章信息
        return ResponseResult.success(updatedArticle);
    }

    /**
     * 多条件分页查询文章
     * 支持搜索、筛选、排序和分页功能
     * @param searchText 搜索文本（可选）
     * @param status 文章状态（可选，默认"all"表示全部）
     * @param visibility 可见性状态（可选，默认"all"表示全部）
     * @param subjectId 学科ID（可选，默认0表示全部）
     * @param tagId 标签ID（可选，默认0表示全部）
     * @param sortBy 排序方式（可选，默认"createdTime-desc"）
     * @param page 页码（可选，默认0，从0开始）
     * @param size 每页条数（可选，默认10）
     * @return 包含分页查询结果的响应对象
     */
    @GetMapping // 处理GET请求，映射路径：/api/admin/articles
    public ResponseResult<Page<Article>> fetchArticles(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false, defaultValue = "all") String visibility,
            @RequestParam(required = false, defaultValue = "0") Integer subjectId,
            @RequestParam(required = false, defaultValue = "0") Integer tagId,
            @RequestParam(required = false, defaultValue = "createdTime-desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // 构建排序对象
        Sort sort = buildSort(sortBy);
        // 构建分页参数对象
        Pageable pageable = PageRequest.of(page, size, sort);
        // 调用服务层进行多条件分页查询
        Page<Article> articles = articleService.fetchArticles(
                searchText, status, subjectId, pageable, visibility, tagId
        );
        // 返回成功响应，包含分页查询结果
        return ResponseResult.success(articles);
    }

    /**
     * 构建排序对象
     * @param sortBy 排序方式字符串（格式：字段名-排序方向）
     * @return 构建好的Sort对象
     */
    private Sort buildSort(String sortBy) {
        // 根据不同的排序方式参数，返回对应的Sort对象
        if ("createdTime-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "createdTime"); // 按创建时间升序
        } else if ("views-desc".equals(sortBy)) {
            return Sort.by(Sort.Direction.DESC, "views"); // 按浏览量降序
        } else {
            return Sort.by(Sort.Direction.DESC, "createdTime"); // 默认按创建时间降序
        }
    }

    /**
     * 查询所有文章
     * @return 包含所有文章列表的响应对象
     */
    @GetMapping("/all") // 处理GET请求，映射路径：/api/admin/articles/all
    public ResponseResult<List<Article>> findAllArticles() {
        // 调用服务层查询所有文章
        List<Article> articles = articleService.findAllArticles();
        // 返回成功响应，包含文章列表
        return ResponseResult.success(articles);
    }

    /**
     * 根据ID查询文章详情
     * @param id 路径中的文章ID
     * @return 包含文章详情的响应对象
     */
    @GetMapping("/{id}") // 处理GET请求，映射路径：/api/admin/articles/{id}
    public ResponseResult<Article> fetchArticleById(@PathVariable Long id) {
        // 调用服务层根据ID查询文章
        Article article = articleService.fetchArticleById(id);
        // 返回成功响应，包含文章详情
        return ResponseResult.success(article);
    }
}
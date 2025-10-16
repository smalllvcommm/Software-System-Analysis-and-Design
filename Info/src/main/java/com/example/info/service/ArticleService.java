package com.example.info.service;


import com.example.info.entity.Article;
import com.example.info.entity.Subject;
import com.example.info.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ReflectionUtils;
import org.springframework.beans.BeanUtils;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor // 自动注入构造函数
public class ArticleService {

    private final ArticleRepository articleRepository;

    @Transactional
    public Article createArticle(Article article) {
        return articleRepository.save(article);
    }

    @Transactional
    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }

    @Transactional
    public Article updateArticle(Long id, Article updatedArticle) {
        // 先查找到原来的文章
        Article existingArticle = fetchArticleById(id);

        // 找出 updatedArticle 中为 null 的字段名
        List<String> nullFieldNames = new ArrayList<>();
        Stream.of(Article.class.getDeclaredFields())
                .forEach(field -> {
                    field.setAccessible(true);
                    Object value = ReflectionUtils.getField(field, updatedArticle);
                    if (value == null) {
                        nullFieldNames.add(field.getName());
                    }
                });
        // 将为 null 的字段名转换为数组
        String[] ignoreFields = nullFieldNames.toArray(new String[0]);
        // 将 updatedArticle 中非 null 的属性复制到 existingArticle 中，忽略为 null 的字段
        BeanUtils.copyProperties(updatedArticle, existingArticle, ignoreFields);

        return articleRepository.save(existingArticle);
    }

    @Transactional
    public Page<Article> fetchArticles( String searchText, String status, Integer subjectId, Pageable pageable, String visibility, Integer tagId) {

        Specification<Article> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchText != null && !searchText.isEmpty()) {
                Predicate titleLike = cb.like(root.get("title"), "%" + searchText + "%");
                Predicate contentLike = cb.like(root.get("content"), "%" + searchText + "%");
                predicates.add(cb.or(titleLike, contentLike)); // 标题或内容满足一个即可
            }

            if (status != null && !"all".equals(status)) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (subjectId != 0 ) {
                predicates.add(cb.equal(root.get("subject").get("id"), subjectId));
            }

            if (visibility != null && !"all".equals(visibility)) {
                predicates.add(cb.equal(root.get("visibility"), visibility));
            }

            if(tagId != 0) {
                predicates.add(cb.equal(root.get("tags").get("id"), tagId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Article> articlePage = articleRepository.findAll(spec, pageable);

        return articlePage;
    }

    @Transactional
    public Article fetchArticleById(Long id) {
        return articleRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true) // 只读事务，提高查询性能
    public List<Article> findAllArticles() {
        return articleRepository.findAll();
    }

}
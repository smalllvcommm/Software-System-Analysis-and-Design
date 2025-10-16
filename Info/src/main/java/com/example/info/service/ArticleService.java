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

/**
 * 文章服务类
 * 处理与文章相关的业务逻辑，包括文章的创建、删除、更新、查询等操作
 */
@Service // 标识为Spring服务组件，用于业务逻辑处理
@RequiredArgsConstructor // Lombok注解，自动生成包含所有final字段的构造函数，用于依赖注入
public class ArticleService {

    // 文章数据访问层接口，通过构造函数注入
    private final ArticleRepository articleRepository;

    /**
     * 创建新文章
     * @param article 待创建的文章实体对象
     * @return 保存后的文章实体（包含自动生成的ID等信息）
     */
    @Transactional // 声明事务，确保操作的原子性
    public Article createArticle(Article article) {
        // 调用Repository的save方法保存文章
        return articleRepository.save(article);
    }

    /**
     * 根据ID删除文章
     * @param id 要删除的文章ID
     */
    @Transactional
    public void deleteArticle(Long id) {
        // 调用Repository的deleteById方法删除文章
        articleRepository.deleteById(id);
    }

    /**
     * 更新文章信息（部分更新，只更新非空字段）
     * @param id 要更新的文章ID
     * @param updatedArticle 包含更新信息的文章实体（非空字段将被更新）
     * @return 更新后的文章实体
     */
    @Transactional
    public Article updateArticle(Long id, Article updatedArticle) {
        // 先查找到原来的文章，如果不存在则返回null
        Article existingArticle = fetchArticleById(id);

        // 找出updatedArticle中为null的字段名，这些字段不需要更新
        List<String> nullFieldNames = new ArrayList<>();
        Stream.of(Article.class.getDeclaredFields()) // 获取Article类的所有声明字段
                .forEach(field -> {
                    field.setAccessible(true); // 设置字段可访问（包括私有字段）
                    // 获取updatedArticle对象中该字段的值
                    Object value = ReflectionUtils.getField(field, updatedArticle);
                    if (value == null) {
                        // 如果字段值为null，记录字段名
                        nullFieldNames.add(field.getName());
                    }
                });

        // 将为null的字段名转换为数组，用于后续忽略这些字段
        String[] ignoreFields = nullFieldNames.toArray(new String[0]);

        // 复制属性：将updatedArticle中非null的属性复制到existingArticle中
        // 忽略为null的字段，实现部分更新
        BeanUtils.copyProperties(updatedArticle, existingArticle, ignoreFields);

        // 保存更新后的文章并返回
        return articleRepository.save(existingArticle);
    }

    /**
     * 多条件分页查询文章
     * 支持按搜索文本、状态、学科、可见性、标签等条件筛选
     * @param searchText 搜索文本（用于匹配标题或内容）
     * @param status 文章状态
     * @param subjectId 学科ID
     * @param pageable 分页参数（包含页码、每页条数、排序信息等）
     * @param visibility 可见性状态
     * @param tagId 标签ID
     * @return 符合条件的文章分页对象
     */
    @Transactional
    public Page<Article> fetchArticles( String searchText, String status, Integer subjectId,
                                        Pageable pageable, String visibility, Integer tagId) {

        // 使用Specification构建动态查询条件
        Specification<Article> spec = (root, query, cb) -> {
            // 存储查询条件的列表
            List<Predicate> predicates = new ArrayList<>();

            // 如果搜索文本不为空，添加标题或内容包含该文本的条件
            if (searchText != null && !searchText.isEmpty()) {
                Predicate titleLike = cb.like(root.get("title"), "%" + searchText + "%");
                Predicate contentLike = cb.like(root.get("content"), "%" + searchText + "%");
                predicates.add(cb.or(titleLike, contentLike)); // 标题或内容满足一个即可
            }

            // 如果状态不为空且不是"all"，添加状态等于指定值的条件
            if (status != null && !"all".equals(status)) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            // 如果学科ID不等于0，添加学科ID等于指定值的条件
            if (subjectId != 0 ) {
                predicates.add(cb.equal(root.get("subject").get("id"), subjectId));
            }

            // 如果可见性不为空且不是"all"，添加可见性等于指定值的条件
            if (visibility != null && !"all".equals(visibility)) {
                predicates.add(cb.equal(root.get("visibility"), visibility));
            }

            // 如果标签ID不等于0，添加标签ID等于指定值的条件
            if(tagId != 0) {
                predicates.add(cb.equal(root.get("tags").get("id"), tagId));
            }

            // 将所有条件组合为一个且条件
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // 执行带条件的分页查询
        Page<Article> articlePage = articleRepository.findAll(spec, pageable);

        return articlePage;
    }

    /**
     * 根据ID查询文章
     * @param id 文章ID
     * @return 对应的文章实体，如果不存在则返回null
     */
    @Transactional
    public Article fetchArticleById(Long id) {
        // 调用Repository的findById方法查询，不存在则返回null
        return articleRepository.findById(id).orElse(null);
    }

    /**
     * 查询所有文章
     * @return 所有文章的列表
     */
    @Transactional(readOnly = true) // 只读事务，提高查询性能，不涉及数据修改
    public List<Article> findAllArticles() {
        return articleRepository.findAll();
    }

}
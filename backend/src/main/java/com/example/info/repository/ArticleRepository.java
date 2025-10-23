package com.example.info.repository;

import com.example.info.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * 文章数据访问层接口
 * 用于数据库中Article实体的CRUD操作及复杂查询
 */
@Repository // 标识为数据访问层组件，由Spring管理
public interface ArticleRepository extends
        JpaRepository<Article, Long>,  // 继承JpaRepository，获得基本CRUD操作能力
        // 泛型参数：<实体类, 主键类型>
        JpaSpecificationExecutor<Article> { // 继承JpaSpecificationExecutor，支持动态条件查询
}
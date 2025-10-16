package com.example.info.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;

/**
 * 文章实体类，继承自Info基类
 * 对应数据库中的articles表，用于存储文章相关信息
 */

@Entity
@Table(name = "articles")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Article extends Info {

    /**
     * 在数据库的articles表中，生成一个名为status的非空列
     * 存储字符串类型的文章状态（"PUBLISHED" 或 "UNPUBLISHED"）
     * 标识文章是否已发布，且该状态是必填项
     */

    @Column(nullable = false) // 映射到数据库列，且该列不能为空
    @Enumerated(EnumType.STRING) // 枚举类型在数据库中存储为字符串
    private Status status;

    /**
     * 在数据库的articles表中，生成一个名为visibility的非空列
     * 存储字符串类型的文章可见性（"PUBLIC" 或 "PRIVATE"）
     * 标识文章的可见性，且该可见性是必填项
     * 默认情况下，文章的可见性为 “公开”
     */

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Visibility visibility = Visibility.PUBLIC;

    /**
     * 在数据库的articles表中，生成一个名为views的列
     * 数据库中可空，记录文章被查看的次数
     */

    private Long views;

    /**
     * 文章所属的主题（多对一关系）
     * 多个文章可以属于同一个主题，关联subject表的主键
     */

    @ManyToOne(fetch = FetchType.EAGER)// 多对一关联，FetchType.EAGER表示立即加载关联对象
    @JoinColumn(name = "subject_id")// 指定关联的数据库外键列为subject_id
    private Subject subject;

    /**
     * 文章状态枚举
     * PUBLISHED：已发布（文章可被正常访问）
     * UNPUBLISHED：未发布（草稿状态，不对外展示）
     */

    public enum Status {
        PUBLISHED,
        UNPUBLISHED,
    }

    /**
     * 文章可见性枚举
     * PUBLIC：公开（所有用户可见）
     * PRIVATE：私有（仅作者或授权用户可见）
     */

    public enum Visibility {
        PUBLIC, PRIVATE
    }

    /**
     * 文章关联的标签列表（多对多关系）
     * 一个文章可以有多个标签，一个标签可以关联多个文章，通过中间表article_tag维护关系
     */

    @ManyToMany // 多对多关联
    @JoinTable(
            name = "article_tag",// 中间表名称
            joinColumns = @JoinColumn(name = "article_id"), // 当前实体(Article)在中间表中的外键列
            inverseJoinColumns = @JoinColumn(name = "tag_id") // 关联实体(Tag)在中间表中的外键列
    )
    private List<Tag> tags = new ArrayList<>();// 初始化标签列表，避免空指针异常

}
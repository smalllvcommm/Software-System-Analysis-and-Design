package com.example.info.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

/**
 * 日记实体类，继承自Info基类
 * 对应数据库中的diaries表，用于存储日记相关信息
 */
@Entity
@Table(name = "diaries")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Diary extends Info {

    /**
     * 日记状态枚举
     * PUBLISHED：已发布（可公开浏览）
     * UNPUBLISHED：未发布（草稿，仅作者可见）
     */
    public enum Status {
        PUBLISHED,
        UNPUBLISHED
    }

    /**
     * 日记可见性枚举
     * PUBLIC：公开（所有用户可见）
     * PRIVATE：私密（仅作者可见）
     */
    public enum Visibility {
        PUBLIC,
        PRIVATE
    }

    /**
     * 在数据库的diaries表中生成一个非空列status
     * 存储字符串类型的日记状态
     */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    /**
     * 在数据库的diaries表中生成一个非空列visibility
     * 存储字符串类型的日记可见性
     */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Visibility visibility = Visibility.PRIVATE;

    /**
     * 在数据库的diaries表中生成一个列mood
     * 存储用户当天的心情描述
     */
    private String mood;

    /**
     * 在数据库的diaries表中生成一个列views
     * 记录该日记的查看次数
     */
    private Long views = 0L;

    /**
     * 在数据库的diaries表中生成一个列date
     * 记录日记的日期（如2025-10-21）
     */
    @Temporal(TemporalType.DATE)
    private Date date;
}

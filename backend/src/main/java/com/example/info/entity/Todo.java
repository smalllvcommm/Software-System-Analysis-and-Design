package com.example.info.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Todo实体类，继承自Info基类
 * 对应数据库中的todos表，用于存储待办事项相关信息
 */
@Entity
@Table(name = "todos")
@Data
@EqualsAndHashCode(callSuper = false)
public class Todo extends Info {

    /**
     * 待办事项内容
     */
    @Lob
    @Column(nullable = false)
    private String content;

    /**
     * 待办事项状态
     * PENDING: 待办
     * IN_PROGRESS: 进行中
     * COMPLETED: 已完成
     */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TodoStatus status = TodoStatus.PENDING;

    /**
     * 截止日期
     */
    @Column(name = "deadline")
    private LocalDateTime deadline;

    /**
     * 优先级（1-5，5为最高优先级）
     */
    @Column(name = "priority")
    private Integer priority = 3;

    /**
     * 所属分类（多对一关系）
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    /**
     * 关联的标签列表（多对多关系）
     */
    @ManyToMany
    @JoinTable(
            name = "todo_tag",
            joinColumns = @JoinColumn(name = "todo_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    /**
     * 待办状态枚举
     */
    public enum TodoStatus {
        PENDING,      // 待办
        IN_PROGRESS,  // 进行中
        COMPLETED     // 已完成
    }
}


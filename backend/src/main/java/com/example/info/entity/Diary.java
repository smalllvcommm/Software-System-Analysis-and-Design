package com.example.info.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

/**
 * Diary实体类，继承自Info基类
 * 对应数据库中的diaries表，用于存储日记相关信息
 */
@Entity
@Table(name = "diaries")
@Data
@EqualsAndHashCode(callSuper = false)
public class Diary extends Info {

    /**
     * 日记内容
     */
    @Lob
    @Column(nullable = false)
    private String content;

    /**
     * 心情状态
     * HAPPY: 开心
     * SAD: 难过
     * EXCITED: 兴奋
     * CALM: 平静
     * ANGRY: 生气
     * ANXIOUS: 焦虑
     */
    @Column(name = "mood")
    @Enumerated(EnumType.STRING)
    private Mood mood;

    /**
     * 天气情况
     * SUNNY: 晴天
     * CLOUDY: 多云
     * RAINY: 雨天
     * SNOWY: 雪天
     * WINDY: 大风
     */
    @Column(name = "weather")
    @Enumerated(EnumType.STRING)
    private Weather weather;

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
            name = "diary_tag",
            joinColumns = @JoinColumn(name = "diary_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    /**
     * 心情枚举
     */
    public enum Mood {
        HAPPY,    // 开心
        SAD,      // 难过
        EXCITED,  // 兴奋
        CALM,     // 平静
        ANGRY,    // 生气
        ANXIOUS   // 焦虑
    }

    /**
     * 天气枚举
     */
    public enum Weather {
        SUNNY,   // 晴天
        CLOUDY,  // 多云
        RAINY,   // 雨天
        SNOWY,   // 雪天
        WINDY    // 大风
    }
}


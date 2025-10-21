package com.example.info.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "videos")
@Data
@EqualsAndHashCode(callSuper = false)
public class Video extends Info {
    @Column
    private Long duration;

    @Column(length = 20)
    private String resolution;

    @Column(length = 100)
    private String source;

    @Column(length = 500)
    private String thumbnailUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany
    @JoinTable(
            name = "video_tag",
            joinColumns = @JoinColumn(name = "video_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();
}

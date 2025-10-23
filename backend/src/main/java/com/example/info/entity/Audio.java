package com.example.info.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "audios")
@Data
@EqualsAndHashCode(callSuper = false)
public class Audio extends Info {
    @Column(length = 20)
    private String format;

    @Column(length = 100)
    private String artist;

    @Column(length = 100)
    private String album;

    @Column(length = 20)
    private String bitrate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany
    @JoinTable(
            name = "audio_tag",
            joinColumns = @JoinColumn(name = "audio_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();
}

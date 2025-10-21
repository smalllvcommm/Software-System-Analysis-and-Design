package com.example.info.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "travel_plans")
@Data
@EqualsAndHashCode(callSuper = false)
public class TravelPlan extends Info {
    @Lob
    private String studyContent;

    @Column
    private Integer studyDuration;

    @Column
    private Integer progress;

    @Column(length = 20)
    private String checkInStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany
    @JoinTable(
            name = "travel_plan_tag",
            joinColumns = @JoinColumn(name = "travel_plan_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();
}

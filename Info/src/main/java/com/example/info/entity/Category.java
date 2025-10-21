package com.example.info.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "categories")
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntityType entityType;

    public enum EntityType {
        MEMO, STUDY_CHECKIN, AUDIO, WEBSITE, EXPENSE, TRAVEL_PLAN, VIDEO
    }
}

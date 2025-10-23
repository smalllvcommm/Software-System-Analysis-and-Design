package com.example.info.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalArticles;
    private Long totalMemos;
    private Long totalVideos;
    private Long totalAudios;
    private Long totalWebsites;
    private Long totalExpenses;
    private Long totalTravelPlans;
    private Long totalStudyCheckIns;
    private Long totalCategories;
    private Long totalTags;
}


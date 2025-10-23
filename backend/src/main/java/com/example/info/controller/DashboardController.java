package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.dto.DashboardStatsDTO;
import com.example.info.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ArticleRepository articleRepository;
    private final MemoRepository memoRepository;
    private final VideoRepository videoRepository;
    private final AudioRepository audioRepository;
    private final WebsiteRepository websiteRepository;
    private final ExpenseRepository expenseRepository;
    private final TravelPlanRepository travelPlanRepository;
    private final StudyCheckInRepository studyCheckInRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    /**
     * 获取Dashboard统计数据
     */
    @GetMapping("/stats")
    public ResponseResult<DashboardStatsDTO> getStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO(
            articleRepository.count(),
            memoRepository.count(),
            videoRepository.count(),
            audioRepository.count(),
            websiteRepository.count(),
            expenseRepository.count(),
            travelPlanRepository.count(),
            studyCheckInRepository.count(),
            categoryRepository.count(),
            tagRepository.count()
        );
        
        return ResponseResult.success(stats);
    }
}


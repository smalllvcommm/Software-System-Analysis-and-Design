package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.TravelPlan;
import com.example.info.service.TravelPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/travel-plans")
@RequiredArgsConstructor
public class TravelPlanController {
    private final TravelPlanService travelPlanService;

    @PostMapping
    public ResponseResult<TravelPlan> createTravelPlan(@RequestBody TravelPlan travelPlan) {
        TravelPlan savedTravelPlan = travelPlanService.createTravelPlan(travelPlan);
        return ResponseResult.success(savedTravelPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> deleteTravelPlan(@PathVariable Long id) {
        travelPlanService.deleteTravelPlan(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<TravelPlan> updateTravelPlan(
            @PathVariable Long id,
            @RequestBody TravelPlan travelPlan
    ) {
        TravelPlan updatedTravelPlan = travelPlanService.updateTravelPlan(id, travelPlan);
        return ResponseResult.success(updatedTravelPlan);
    }

    @GetMapping
    public ResponseResult<Page<TravelPlan>> fetchTravelPlans(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false, defaultValue = "0") Long categoryId,
            @RequestParam(required = false, defaultValue = "0") Long tagId,
            @RequestParam(required = false, defaultValue = "createdTime-desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TravelPlan> travelPlans = travelPlanService.fetchTravelPlans(searchText, categoryId, tagId, pageable);
        return ResponseResult.success(travelPlans);
    }

    private Sort buildSort(String sortBy) {
        if ("createdTime-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "createdTime");
        } else if ("progress-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "progress");
        } else if ("progress-desc".equals(sortBy)) {
            return Sort.by(Sort.Direction.DESC, "progress");
        } else {
            return Sort.by(Sort.Direction.DESC, "createdTime");
        }
    }

    @GetMapping("/all")
    public ResponseResult<List<TravelPlan>> findAllTravelPlans() {
        List<TravelPlan> travelPlans = travelPlanService.findAllTravelPlans();
        return ResponseResult.success(travelPlans);
    }

    @GetMapping("/{id}")
    public ResponseResult<TravelPlan> fetchTravelPlanById(@PathVariable Long id) {
        TravelPlan travelPlan = travelPlanService.findById(id);
        return ResponseResult.success(travelPlan);
    }
}

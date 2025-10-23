package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.StudyCheckIn;
import com.example.info.service.StudyCheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-check-ins")
@RequiredArgsConstructor
public class StudyCheckInController {
    private final StudyCheckInService studyCheckInService;

    @PostMapping
    public ResponseResult<StudyCheckIn> createStudyCheckIn(@RequestBody StudyCheckIn studyCheckIn) {
        StudyCheckIn savedStudyCheckIn = studyCheckInService.createStudyCheckIn(studyCheckIn);
        return ResponseResult.success(savedStudyCheckIn);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<Void> deleteStudyCheckIn(@PathVariable Long id) {
        studyCheckInService.deleteStudyCheckIn(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<StudyCheckIn> updateStudyCheckIn(
            @PathVariable Long id,
            @RequestBody StudyCheckIn studyCheckIn
    ) {
        StudyCheckIn updatedStudyCheckIn = studyCheckInService.updateStudyCheckIn(id, studyCheckIn);
        return ResponseResult.success(updatedStudyCheckIn);
    }

    @GetMapping
    public ResponseResult<Page<StudyCheckIn>> fetchStudyCheckIns(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false, defaultValue = "0") Long categoryId,
            @RequestParam(required = false, defaultValue = "0") Long tagId,
            @RequestParam(required = false, defaultValue = "createdTime-desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<StudyCheckIn> studyCheckIns = studyCheckInService.fetchStudyCheckIns(searchText, categoryId, tagId, pageable);
        return ResponseResult.success(studyCheckIns);
    }

    private Sort buildSort(String sortBy) {
        if ("createdTime-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "createdTime");
        } else if ("travelDate-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "travelDate");
        } else if ("travelDate-desc".equals(sortBy)) {
            return Sort.by(Sort.Direction.DESC, "travelDate");
        } else {
            return Sort.by(Sort.Direction.DESC, "createdTime");
        }
    }

    @GetMapping("/all")
    public ResponseResult<List<StudyCheckIn>> findAllStudyCheckIns() {
        List<StudyCheckIn> studyCheckIns = studyCheckInService.findAllStudyCheckIns();
        return ResponseResult.success(studyCheckIns);
    }

    @GetMapping("/{id}")
    public ResponseResult<StudyCheckIn> fetchStudyCheckInById(@PathVariable Long id) {
        StudyCheckIn studyCheckIn = studyCheckInService.findById(id);
        return ResponseResult.success(studyCheckIn);
    }
}

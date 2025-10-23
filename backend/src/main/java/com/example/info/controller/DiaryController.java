package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Diary;
import com.example.info.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Diary控制器
 */
@RestController
@RequestMapping("/api/diaries")
@RequiredArgsConstructor
public class DiaryController {
    private final DiaryService diaryService;

    @PostMapping
    public ResponseResult<Diary> createDiary(@RequestBody Diary diary) {
        Diary savedDiary = diaryService.createDiary(diary);
        return ResponseResult.success(savedDiary);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<Void> deleteDiary(@PathVariable Long id) {
        diaryService.deleteDiary(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<Diary> updateDiary(
            @PathVariable Long id,
            @RequestBody Diary diary
    ) {
        Diary updatedDiary = diaryService.updateDiary(id, diary);
        return ResponseResult.success(updatedDiary);
    }

    @GetMapping
    public ResponseResult<Page<Diary>> fetchDiaries(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false, defaultValue = "0") Long categoryId,
            @RequestParam(required = false, defaultValue = "0") Long tagId,
            @RequestParam(required = false) String mood,
            @RequestParam(required = false) String weather,
            @RequestParam(required = false, defaultValue = "createdTime-desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Diary> diaries = diaryService.fetchDiaries(searchText, categoryId, tagId, mood, weather, pageable);
        return ResponseResult.success(diaries);
    }

    private Sort buildSort(String sortBy) {
        if ("createdTime-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "createdTime");
        } else if ("title-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "title");
        } else {
            return Sort.by(Sort.Direction.DESC, "createdTime");
        }
    }

    @GetMapping("/all")
    public ResponseResult<List<Diary>> findAllDiaries() {
        List<Diary> diaries = diaryService.findAllDiaries();
        return ResponseResult.success(diaries);
    }

    @GetMapping("/{id}")
    public ResponseResult<Diary> fetchDiaryById(@PathVariable Long id) {
        Diary diary = diaryService.findById(id);
        return ResponseResult.success(diary);
    }
}


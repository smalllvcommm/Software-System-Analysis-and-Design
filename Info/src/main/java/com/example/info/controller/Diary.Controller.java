package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Diary;
import com.example.info.service.DiaryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 日记管理控制器
 * 处理与日记相关的HTTP请求，提供RESTful API接口
 * 路径前缀：/api/admin/diaries
 */
@RestController
@RequestMapping("/api/admin/diaries")
public class DiaryController {

    private final DiaryService diaryService;

    public DiaryController(DiaryService diaryService) {
        this.diaryService = diaryService;
    }

    /**
     * 创建新日记
     */
    @PostMapping
    public ResponseResult<Diary> createDiary(@RequestBody Diary diary) {
        Diary savedDiary = diaryService.createDiary(diary);
        return ResponseResult.success(savedDiary);
    }

    /**
     * 删除日记
     */
    @DeleteMapping("/{id}")
    public ResponseResult<String> deleteDiary(@PathVariable Long id) {
        diaryService.deleteDiary(id);
        return ResponseResult.success("删除成功");
    }

    /**
     * 更新日记
     */
    @PutMapping("/{id}")
    public ResponseResult<Diary> updateDiary(@PathVariable Long id, @RequestBody Diary diary) {
        Diary updatedDiary = diaryService.updateDiary(id, diary);
        return ResponseResult.success(updatedDiary);
    }

    /**
     * 多条件分页查询日记
     */
    @GetMapping
    public ResponseResult<Page<Diary>> fetchDiaries(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false, defaultValue = "all") String visibility,
            @RequestParam(required = false, defaultValue = "") String mood,
            @RequestParam(required = false, defaultValue = "createdTime-desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Diary> diaries = diaryService.fetchDiaries(searchText, status, visibility, mood, pageable);
        return ResponseResult.success(diaries);
    }

    /**
     * 构建排序对象
     */
    private Sort buildSort(String sortBy) {
        if ("createdTime-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "createdTime");
        } else if ("views-desc".equals(sortBy)) {
            return Sort.by(Sort.Direction.DESC, "views");
        } else {
            return Sort.by(Sort.Direction.DESC, "createdTime");
        }
    }

    /**
     * 查询所有日记
     */
    @GetMapping("/all")
    public ResponseResult<List<Diary>> findAllDiaries() {
        List<Diary> diaries = diaryService.findAllDiaries();
        return ResponseResult.success(diaries);
    }

    /**
     * 根据ID查询日记详情
     */
    @GetMapping("/{id}")
    public ResponseResult<Diary> fetchDiaryById(@PathVariable Long id) {
        Diary diary = diaryService.fetchDiaryById(id);
        return ResponseResult.success(diary);
    }
}

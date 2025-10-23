package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Memo;
import com.example.info.service.MemoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memos")
@RequiredArgsConstructor
public class MemoController {
    private final MemoService memoService;

    @PostMapping
    public ResponseResult<Memo> createMemo(@RequestBody Memo memo) {
        Memo savedMemo = memoService.createMemo(memo);
        return ResponseResult.success(savedMemo);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<Void> deleteMemo(@PathVariable Long id) {
        memoService.deleteMemo(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<Memo> updateMemo(
            @PathVariable Long id,
            @RequestBody Memo memo
    ) {
        Memo updatedMemo = memoService.updateMemo(id, memo);
        return ResponseResult.success(updatedMemo);
    }

    @GetMapping
    public ResponseResult<Page<Memo>> fetchMemos(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false, defaultValue = "0") Long categoryId,
            @RequestParam(required = false, defaultValue = "0") Long tagId,
            @RequestParam(required = false, defaultValue = "createdTime-desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Memo> memos = memoService.fetchMemos(searchText, categoryId, tagId, pageable);
        return ResponseResult.success(memos);
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
    public ResponseResult<List<Memo>> findAllMemos() {
        List<Memo> memos = memoService.findAllMemos();
        return ResponseResult.success(memos);
    }

    @GetMapping("/{id}")
    public ResponseResult<Memo> fetchMemoById(@PathVariable Long id) {
        Memo memo = memoService.findById(id);
        return ResponseResult.success(memo);
    }
}

package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Video;
import com.example.info.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/videos")
@RequiredArgsConstructor
public class VideoController {
    private final VideoService videoService;

    @PostMapping
    public ResponseResult<Video> createVideo(@RequestBody Video video) {
        Video savedVideo = videoService.createVideo(video);
        return ResponseResult.success(savedVideo);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<Video> updateVideo(
            @PathVariable Long id,
            @RequestBody Video video
    ) {
        Video updatedVideo = videoService.updateVideo(id, video);
        return ResponseResult.success(updatedVideo);
    }

    @GetMapping
    public ResponseResult<Page<Video>> fetchVideos(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false, defaultValue = "0") Long categoryId,
            @RequestParam(required = false, defaultValue = "0") Long tagId,
            @RequestParam(required = false, defaultValue = "createdTime-desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Video> videos = videoService.fetchVideos(searchText, categoryId, tagId, pageable);
        return ResponseResult.success(videos);
    }

    private Sort buildSort(String sortBy) {
        if ("createdTime-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "createdTime");
        } else if ("duration-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "duration");
        } else if ("duration-desc".equals(sortBy)) {
            return Sort.by(Sort.Direction.DESC, "duration");
        } else {
            return Sort.by(Sort.Direction.DESC, "createdTime");
        }
    }

    @GetMapping("/all")
    public ResponseResult<List<Video>> findAllVideos() {
        List<Video> videos = videoService.findAllVideos();
        return ResponseResult.success(videos);
    }

    @GetMapping("/{id}")
    public ResponseResult<Video> fetchVideoById(@PathVariable Long id) {
        Video video = videoService.findById(id);
        return ResponseResult.success(video);
    }
}

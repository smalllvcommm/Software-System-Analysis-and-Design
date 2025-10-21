package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Audio;
import com.example.info.service.AudioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audios")
@RequiredArgsConstructor
public class AudioController {
    private final AudioService audioService;

    @PostMapping
    public ResponseResult<Audio> createAudio(@RequestBody Audio audio) {
        Audio savedAudio = audioService.createAudio(audio);
        return ResponseResult.success(savedAudio);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> deleteAudio(@PathVariable Long id) {
        audioService.deleteAudio(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<Audio> updateAudio(
            @PathVariable Long id,
            @RequestBody Audio audio
    ) {
        Audio updatedAudio = audioService.updateAudio(id, audio);
        return ResponseResult.success(updatedAudio);
    }

    @GetMapping
    public ResponseResult<Page<Audio>> fetchAudios(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false, defaultValue = "0") Long categoryId,
            @RequestParam(required = false, defaultValue = "0") Long tagId,
            @RequestParam(required = false, defaultValue = "createdTime-desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Audio> audios = audioService.fetchAudios(searchText, categoryId, tagId, pageable);
        return ResponseResult.success(audios);
    }

    private Sort buildSort(String sortBy) {
        if ("createdTime-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "createdTime");
        } else if ("title-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "title");
        } else if ("artist-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "artist");
        } else {
            return Sort.by(Sort.Direction.DESC, "createdTime");
        }
    }

    @GetMapping("/all")
    public ResponseResult<List<Audio>> findAllAudios() {
        List<Audio> audios = audioService.findAllAudios();
        return ResponseResult.success(audios);
    }

    @GetMapping("/{id}")
    public ResponseResult<Audio> fetchAudioById(@PathVariable Long id) {
        Audio audio = audioService.findById(id);
        return ResponseResult.success(audio);
    }
}

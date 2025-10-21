package com.example.info.service;

import com.example.info.entity.Video;
import com.example.info.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepository videoRepository;

    @Transactional
    public Video createVideo(Video video) {
        return videoRepository.save(video);
    }

    @Transactional
    public void deleteVideo(Long id) {
        videoRepository.deleteById(id);
    }

    @Transactional
    public Video updateVideo(Long id, Video video) {
        Video existing = videoRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTitle(video.getTitle());
            existing.setDuration(video.getDuration());
            existing.setResolution(video.getResolution());
            existing.setSource(video.getSource());
            existing.setThumbnailUrl(video.getThumbnailUrl());
            existing.setCategory(video.getCategory());
            existing.setTags(video.getTags());
            return videoRepository.save(existing);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public Page<Video> fetchVideos(String searchText, Long categoryId, Long tagId, Pageable pageable) {
        Specification<Video> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchText != null && !searchText.isEmpty()) {
                Predicate titleLike = cb.like(root.get("title"), "%" + searchText + "%");
                Predicate resolutionLike = cb.like(root.get("resolution"), "%" + searchText + "%");
                Predicate sourceLike = cb.like(root.get("source"), "%" + searchText + "%");
                predicates.add(cb.or(titleLike, resolutionLike, sourceLike));
            }

            if (categoryId != null && categoryId != 0) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (tagId != null && tagId != 0) {
                predicates.add(cb.equal(root.get("tags").get("id"), tagId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return videoRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public Video findById(Long id) {
        return videoRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Video> findAllVideos() {
        return videoRepository.findAll();
    }
}

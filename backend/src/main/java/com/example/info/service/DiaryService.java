package com.example.info.service;

import com.example.info.entity.Diary;
import com.example.info.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

/**
 * Diary服务层
 */
@Service
@RequiredArgsConstructor
public class DiaryService {
    private final DiaryRepository diaryRepository;

    @Transactional
    public Diary createDiary(Diary diary) {
        return diaryRepository.save(diary);
    }

    @Transactional
    public void deleteDiary(Long id) {
        diaryRepository.deleteById(id);
    }

    @Transactional
    public Diary updateDiary(Long id, Diary diary) {
        Diary existingDiary = diaryRepository.findById(id).orElse(null);
        if (existingDiary != null) {
            existingDiary.setTitle(diary.getTitle());
            existingDiary.setContent(diary.getContent());
            existingDiary.setMood(diary.getMood());
            existingDiary.setWeather(diary.getWeather());
            existingDiary.setCategory(diary.getCategory());
            existingDiary.setTags(diary.getTags());
            return diaryRepository.save(existingDiary);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public Page<Diary> fetchDiaries(String searchText, Long categoryId, Long tagId, String mood, String weather, Pageable pageable) {
        Specification<Diary> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchText != null && !searchText.isEmpty()) {
                Predicate titleLike = cb.like(root.get("title"), "%" + searchText + "%");
                Predicate contentLike = cb.like(root.get("content"), "%" + searchText + "%");
                predicates.add(cb.or(titleLike, contentLike));
            }

            if (categoryId != null && categoryId != 0) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (tagId != null && tagId != 0) {
                predicates.add(cb.equal(root.get("tags").get("id"), tagId));
            }

            if (mood != null && !mood.isEmpty()) {
                predicates.add(cb.equal(root.get("mood"), Diary.Mood.valueOf(mood)));
            }

            if (weather != null && !weather.isEmpty()) {
                predicates.add(cb.equal(root.get("weather"), Diary.Weather.valueOf(weather)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return diaryRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public Diary findById(Long id) {
        return diaryRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Diary> findAllDiaries() {
        return diaryRepository.findAll();
    }
}


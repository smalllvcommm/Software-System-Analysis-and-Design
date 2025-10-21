package com.example.info.service;

import com.example.info.entity.Diary;
import com.example.info.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ReflectionUtils;
import org.springframework.beans.BeanUtils;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

/**
 * 日记服务类
 * 处理与日记相关的业务逻辑，包括创建、删除、更新、查询等操作
 */
@Service
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryRepository diaryRepository;

    /**
     * 创建新日记
     * @param diary 待创建的日记实体对象
     * @return 保存后的日记实体
     */
    @Transactional
    public Diary createDiary(Diary diary) {
        return diaryRepository.save(diary);
    }

    /**
     * 根据ID删除日记
     * @param id 要删除的日记ID
     */
    @Transactional
    public void deleteDiary(Long id) {
        diaryRepository.deleteById(id);
    }

    /**
     * 更新日记信息（部分更新）
     * @param id 要更新的日记ID
     * @param updatedDiary 包含更新字段的日记对象
     * @return 更新后的日记实体
     */
    @Transactional
    public Diary updateDiary(Long id, Diary updatedDiary) {
        Diary existingDiary = fetchDiaryById(id);

        List<String> nullFieldNames = new ArrayList<>();
        Stream.of(Diary.class.getDeclaredFields()).forEach(field -> {
            field.setAccessible(true);
            Object value = ReflectionUtils.getField(field, updatedDiary);
            if (value == null) nullFieldNames.add(field.getName());
        });

        String[] ignoreFields = nullFieldNames.toArray(new String[0]);
        BeanUtils.copyProperties(updatedDiary, existingDiary, ignoreFields);

        return diaryRepository.save(existingDiary);
    }

    /**
     * 多条件分页查询日记
     * 支持按搜索文本、状态、可见性、心情等条件筛选
     * @param searchText 搜索文本（标题或内容匹配）
     * @param status 日记状态
     * @param visibility 可见性状态
     * @param mood 心情关键词
     * @param pageable 分页参数
     * @return 符合条件的日记分页对象
     */
    @Transactional
    public Page<Diary> fetchDiaries(String searchText, String status,
                                    String visibility, String mood,
                                    Pageable pageable) {

        Specification<Diary> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchText != null && !searchText.isEmpty()) {
                Predicate titleLike = cb.like(root.get("title"), "%" + searchText + "%");
                Predicate contentLike = cb.like(root.get("content"), "%" + searchText + "%");
                predicates.add(cb.or(titleLike, contentLike));
            }

            if (status != null && !"all".equals(status)) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (visibility != null && !"all".equals(visibility)) {
                predicates.add(cb.equal(root.get("visibility"), visibility));
            }

            if (mood != null && !mood.isEmpty()) {
                predicates.add(cb.like(root.get("mood"), "%" + mood + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return diaryRepository.findAll(spec, pageable);
    }

    /**
     * 根据ID查询日记
     * @param id 日记ID
     * @return 对应的日记实体
     */
    @Transactional
    public Diary fetchDiaryById(Long id) {
        return diaryRepository.findById(id).orElse(null);
    }

    /**
     * 查询所有日记
     * @return 所有日记列表
     */
    @Transactional(readOnly = true)
    public List<Diary> findAllDiaries() {
        return diaryRepository.findAll();
    }
}

package com.example.info.repository;

import com.example.info.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Diary数据访问层接口
 */
@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    /**
     * 根据心情查询日记列表
     */
    List<Diary> findByMood(Diary.Mood mood);

    /**
     * 根据天气查询日记列表
     */
    List<Diary> findByWeather(Diary.Weather weather);

    /**
     * 根据分类ID查询日记列表
     */
    List<Diary> findByCategoryId(Long categoryId);
}


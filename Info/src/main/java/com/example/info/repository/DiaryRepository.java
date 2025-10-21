package com.example.info.repository;

import com.example.info.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * 日记数据访问层接口
 * 用于数据库中Diary实体的CRUD操作及动态条件查询
 */
@Repository
public interface DiaryRepository extends
        JpaRepository<Diary, Long>,
        JpaSpecificationExecutor<Diary> {
}

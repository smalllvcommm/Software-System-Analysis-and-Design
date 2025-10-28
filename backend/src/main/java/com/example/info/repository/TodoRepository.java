package com.example.info.repository;

import com.example.info.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Todo数据访问层接口
 */
@Repository
public interface TodoRepository extends JpaRepository<Todo, Long>, JpaSpecificationExecutor<Todo> {
    /**
     * 根据状态查询待办事项列表
     */
    List<Todo> findByStatus(Todo.TodoStatus status);

    /**
     * 根据分类ID查询待办事项列表
     */
    List<Todo> findByCategoryId(Long categoryId);

    /**
     * 根据优先级查询待办事项列表
     */
    List<Todo> findByPriorityOrderByDeadlineAsc(Integer priority);
}


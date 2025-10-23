package com.example.info.service;

import com.example.info.entity.Todo;
import com.example.info.repository.TodoRepository;
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
 * Todo服务层
 */
@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;

    @Transactional
    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    @Transactional
    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }

    @Transactional
    public Todo updateTodo(Long id, Todo todo) {
        Todo existingTodo = todoRepository.findById(id).orElse(null);
        if (existingTodo != null) {
            existingTodo.setTitle(todo.getTitle());
            existingTodo.setContent(todo.getContent());
            existingTodo.setStatus(todo.getStatus());
            existingTodo.setDeadline(todo.getDeadline());
            existingTodo.setPriority(todo.getPriority());
            existingTodo.setCategory(todo.getCategory());
            existingTodo.setTags(todo.getTags());
            return todoRepository.save(existingTodo);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public Page<Todo> fetchTodos(String searchText, Long categoryId, Long tagId, String status, Integer priority, Pageable pageable) {
        Specification<Todo> spec = (root, query, cb) -> {
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

            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), Todo.TodoStatus.valueOf(status)));
            }

            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return todoRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public Todo findById(Long id) {
        return todoRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Todo> findAllTodos() {
        return todoRepository.findAll();
    }
}


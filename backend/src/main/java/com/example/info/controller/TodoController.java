package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Todo;
import com.example.info.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Todo控制器
 */
@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {
    private final TodoService todoService;

    @PostMapping
    public ResponseResult<Todo> createTodo(@RequestBody Todo todo) {
        Todo savedTodo = todoService.createTodo(todo);
        return ResponseResult.success(savedTodo);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<Todo> updateTodo(
            @PathVariable Long id,
            @RequestBody Todo todo
    ) {
        Todo updatedTodo = todoService.updateTodo(id, todo);
        return ResponseResult.success(updatedTodo);
    }

    @GetMapping
    public ResponseResult<Page<Todo>> fetchTodos(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false, defaultValue = "0") Long categoryId,
            @RequestParam(required = false, defaultValue = "0") Long tagId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer priority,
            @RequestParam(required = false, defaultValue = "createdTime-desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Todo> todos = todoService.fetchTodos(searchText, categoryId, tagId, status, priority, pageable);
        return ResponseResult.success(todos);
    }

    private Sort buildSort(String sortBy) {
        if ("createdTime-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "createdTime");
        } else if ("title-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "title");
        } else if ("deadline-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "deadline");
        } else if ("priority-desc".equals(sortBy)) {
            return Sort.by(Sort.Direction.DESC, "priority");
        } else {
            return Sort.by(Sort.Direction.DESC, "createdTime");
        }
    }

    @GetMapping("/all")
    public ResponseResult<List<Todo>> findAllTodos() {
        List<Todo> todos = todoService.findAllTodos();
        return ResponseResult.success(todos);
    }

    @GetMapping("/{id}")
    public ResponseResult<Todo> fetchTodoById(@PathVariable Long id) {
        Todo todo = todoService.findById(id);
        return ResponseResult.success(todo);
    }
}


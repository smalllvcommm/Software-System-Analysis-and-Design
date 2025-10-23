package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Expense;
import com.example.info.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping
    public ResponseResult<Expense> createExpense(@RequestBody Expense expense) {
        Expense savedExpense = expenseService.createExpense(expense);
        return ResponseResult.success(savedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<Expense> updateExpense(
            @PathVariable Long id,
            @RequestBody Expense expense
    ) {
        Expense updatedExpense = expenseService.updateExpense(id, expense);
        return ResponseResult.success(updatedExpense);
    }

    @GetMapping
    public ResponseResult<Page<Expense>> fetchExpenses(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false, defaultValue = "0") Long categoryId,
            @RequestParam(required = false, defaultValue = "0") Long tagId,
            @RequestParam(required = false, defaultValue = "createdTime-desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Expense> expenses = expenseService.fetchExpenses(searchText, categoryId, tagId, pageable);
        return ResponseResult.success(expenses);
    }

    private Sort buildSort(String sortBy) {
        if ("createdTime-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "createdTime");
        } else if ("amount-asc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "amount");
        } else if ("amount-desc".equals(sortBy)) {
            return Sort.by(Sort.Direction.DESC, "amount");
        } else {
            return Sort.by(Sort.Direction.DESC, "createdTime");
        }
    }

    @GetMapping("/all")
    public ResponseResult<List<Expense>> findAllExpenses() {
        List<Expense> expenses = expenseService.findAllExpenses();
        return ResponseResult.success(expenses);
    }

    @GetMapping("/{id}")
    public ResponseResult<Expense> fetchExpenseById(@PathVariable Long id) {
        Expense expense = expenseService.findById(id);
        return ResponseResult.success(expense);
    }
}

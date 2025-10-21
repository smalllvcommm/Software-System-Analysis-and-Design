package com.example.info.service;

import com.example.info.entity.Expense;
import com.example.info.repository.ExpenseRepository;
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
public class ExpenseService {
    private final ExpenseRepository expenseRepository;

    @Transactional
    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    @Transactional
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    @Transactional
    public Expense updateExpense(Long id, Expense expense) {
        Expense existing = expenseRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTitle(expense.getTitle());
            existing.setAmount(expense.getAmount());
            existing.setPaymentMethod(expense.getPaymentMethod());
            existing.setMerchant(expense.getMerchant());
            existing.setExpenseType(expense.getExpenseType());
            existing.setCategory(expense.getCategory());
            existing.setTags(expense.getTags());
            return expenseRepository.save(existing);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public Page<Expense> fetchExpenses(String searchText, Long categoryId, Long tagId, Pageable pageable) {
        Specification<Expense> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchText != null && !searchText.isEmpty()) {
                Predicate titleLike = cb.like(root.get("title"), "%" + searchText + "%");
                Predicate merchantLike = cb.like(root.get("merchant"), "%" + searchText + "%");
                Predicate expenseTypeLike = cb.like(root.get("expenseType"), "%" + searchText + "%");
                predicates.add(cb.or(titleLike, merchantLike, expenseTypeLike));
            }

            if (categoryId != null && categoryId != 0) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (tagId != null && tagId != 0) {
                predicates.add(cb.equal(root.get("tags").get("id"), tagId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return expenseRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public Expense findById(Long id) {
        return expenseRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Expense> findAllExpenses() {
        return expenseRepository.findAll();
    }
}

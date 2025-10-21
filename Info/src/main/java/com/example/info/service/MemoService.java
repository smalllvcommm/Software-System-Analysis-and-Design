package com.example.info.service;

import com.example.info.entity.Memo;
import com.example.info.repository.MemoRepository;
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
public class MemoService {
    private final MemoRepository memoRepository;

    @Transactional
    public Memo createMemo(Memo memo) {
        return memoRepository.save(memo);
    }

    @Transactional
    public void deleteMemo(Long id) {
        memoRepository.deleteById(id);
    }

    @Transactional
    public Memo updateMemo(Long id, Memo memo) {
        Memo existingMemo = memoRepository.findById(id).orElse(null);
        if (existingMemo != null) {
            existingMemo.setTitle(memo.getTitle());
            existingMemo.setContent(memo.getContent());
            existingMemo.setCategory(memo.getCategory());
            existingMemo.setTags(memo.getTags());
            return memoRepository.save(existingMemo);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public Page<Memo> fetchMemos(String searchText, Long categoryId, Long tagId, Pageable pageable) {
        Specification<Memo> spec = (root, query, cb) -> {
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

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return memoRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public Memo findById(Long id) {
        return memoRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Memo> findAllMemos() {
        return memoRepository.findAll();
    }
}

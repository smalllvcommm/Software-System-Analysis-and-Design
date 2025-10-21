package com.example.info.service;

import com.example.info.entity.Website;
import com.example.info.repository.WebsiteRepository;
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
public class WebsiteService {
    private final WebsiteRepository websiteRepository;

    @Transactional
    public Website createWebsite(Website website) {
        return websiteRepository.save(website);
    }

    @Transactional
    public void deleteWebsite(Long id) {
        websiteRepository.deleteById(id);
    }

    @Transactional
    public Website updateWebsite(Long id, Website website) {
        Website existing = websiteRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTitle(website.getTitle());
            existing.setUrl(website.getUrl());
            existing.setDescription(website.getDescription());
            existing.setCategory(website.getCategory());
            existing.setTags(website.getTags());
            return websiteRepository.save(existing);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public Page<Website> fetchWebsites(String searchText, Long categoryId, Long tagId, Pageable pageable) {
        Specification<Website> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchText != null && !searchText.isEmpty()) {
                Predicate titleLike = cb.like(root.get("title"), "%" + searchText + "%");
                Predicate urlLike = cb.like(root.get("url"), "%" + searchText + "%");
                Predicate descriptionLike = cb.like(root.get("description"), "%" + searchText + "%");
                predicates.add(cb.or(titleLike, urlLike, descriptionLike));
            }

            if (categoryId != null && categoryId != 0) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (tagId != null && tagId != 0) {
                predicates.add(cb.equal(root.get("tags").get("id"), tagId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return websiteRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public Website findById(Long id) {
        return websiteRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Website> findAllWebsites() {
        return websiteRepository.findAll();
    }
}

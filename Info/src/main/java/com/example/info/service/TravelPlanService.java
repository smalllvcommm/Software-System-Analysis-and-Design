package com.example.info.service;

import com.example.info.entity.TravelPlan;
import com.example.info.repository.TravelPlanRepository;
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
public class TravelPlanService {
    private final TravelPlanRepository travelPlanRepository;

    @Transactional
    public TravelPlan createTravelPlan(TravelPlan travelPlan) {
        return travelPlanRepository.save(travelPlan);
    }

    @Transactional
    public void deleteTravelPlan(Long id) {
        travelPlanRepository.deleteById(id);
    }

    @Transactional
    public TravelPlan updateTravelPlan(Long id, TravelPlan travelPlan) {
        TravelPlan existing = travelPlanRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTitle(travelPlan.getTitle());
            existing.setStudyContent(travelPlan.getStudyContent());
            existing.setStudyDuration(travelPlan.getStudyDuration());
            existing.setProgress(travelPlan.getProgress());
            existing.setCheckInStatus(travelPlan.getCheckInStatus());
            existing.setCategory(travelPlan.getCategory());
            existing.setTags(travelPlan.getTags());
            return travelPlanRepository.save(existing);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public Page<TravelPlan> fetchTravelPlans(String searchText, Long categoryId, Long tagId, Pageable pageable) {
        Specification<TravelPlan> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchText != null && !searchText.isEmpty()) {
                Predicate titleLike = cb.like(root.get("title"), "%" + searchText + "%");
                Predicate studyContentLike = cb.like(root.get("studyContent"), "%" + searchText + "%");
                Predicate checkInStatusLike = cb.like(root.get("checkInStatus"), "%" + searchText + "%");
                predicates.add(cb.or(titleLike, studyContentLike, checkInStatusLike));
            }

            if (categoryId != null && categoryId != 0) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (tagId != null && tagId != 0) {
                predicates.add(cb.equal(root.get("tags").get("id"), tagId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return travelPlanRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public TravelPlan findById(Long id) {
        return travelPlanRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<TravelPlan> findAllTravelPlans() {
        return travelPlanRepository.findAll();
    }
}

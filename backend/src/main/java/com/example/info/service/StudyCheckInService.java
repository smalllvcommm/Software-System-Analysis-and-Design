package com.example.info.service;

import com.example.info.entity.StudyCheckIn;
import com.example.info.repository.StudyCheckInRepository;
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
public class StudyCheckInService {
    private final StudyCheckInRepository studyCheckInRepository;

    @Transactional
    public StudyCheckIn createStudyCheckIn(StudyCheckIn studyCheckIn) {
        return studyCheckInRepository.save(studyCheckIn);
    }

    @Transactional
    public void deleteStudyCheckIn(Long id) {
        studyCheckInRepository.deleteById(id);
    }

    @Transactional
    public StudyCheckIn updateStudyCheckIn(Long id, StudyCheckIn studyCheckIn) {
        StudyCheckIn existing = studyCheckInRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTitle(studyCheckIn.getTitle());
            existing.setDestination(studyCheckIn.getDestination());
            existing.setTravelDate(studyCheckIn.getTravelDate());
            existing.setTransport(studyCheckIn.getTransport());
            existing.setAttractions(studyCheckIn.getAttractions());
            existing.setCategory(studyCheckIn.getCategory());
            existing.setTags(studyCheckIn.getTags());
            return studyCheckInRepository.save(existing);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public Page<StudyCheckIn> fetchStudyCheckIns(String searchText, Long categoryId, Long tagId, Pageable pageable) {
        Specification<StudyCheckIn> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchText != null && !searchText.isEmpty()) {
                Predicate titleLike = cb.like(root.get("title"), "%" + searchText + "%");
                Predicate destinationLike = cb.like(root.get("destination"), "%" + searchText + "%");
                predicates.add(cb.or(titleLike, destinationLike));
            }

            if (categoryId != null && categoryId != 0) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (tagId != null && tagId != 0) {
                predicates.add(cb.equal(root.get("tags").get("id"), tagId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return studyCheckInRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public StudyCheckIn findById(Long id) {
        return studyCheckInRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<StudyCheckIn> findAllStudyCheckIns() {
        return studyCheckInRepository.findAll();
    }
}

package com.example.info.service;

import com.example.info.entity.Subject;
import com.example.info.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {
    private final SubjectRepository subjectRepository;

    @Transactional
    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    @Transactional
    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }

    @Transactional
    public Subject updateSubject(Long id, Subject subject) {
        Subject existingSubject = subjectRepository.findById(id).orElse(null);
        if (existingSubject != null) {
            existingSubject.setName(subject.getName());
            existingSubject.setDescription(subject.getDescription());
            return subjectRepository.save(existingSubject);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public List<Subject> findAllSubjects() {
        return subjectRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Subject findById(Long id) {
        return subjectRepository.findById(id).orElse(null);
    }
}

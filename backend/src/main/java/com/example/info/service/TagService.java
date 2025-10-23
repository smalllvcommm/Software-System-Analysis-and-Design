package com.example.info.service;

import com.example.info.entity.Tag;
import com.example.info.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    @Transactional
    public Tag createTag(Tag tag) {
        return tagRepository.save(tag);
    }

    @Transactional
    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
    }

    @Transactional
    public Tag updateTag(Long id, Tag tag) {
        Tag existingTag = tagRepository.findById(id).orElse(null);
        if (existingTag != null) {
            existingTag.setName(tag.getName());
            return tagRepository.save(existingTag);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public List<Tag> findAllTags() {
        return tagRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Tag findById(Long id) {
        return tagRepository.findById(id).orElse(null);
    }
}

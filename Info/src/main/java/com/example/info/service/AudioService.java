package com.example.info.service;

import com.example.info.entity.Audio;
import com.example.info.repository.AudioRepository;
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
public class AudioService {
    private final AudioRepository audioRepository;

    @Transactional
    public Audio createAudio(Audio audio) {
        return audioRepository.save(audio);
    }

    @Transactional
    public void deleteAudio(Long id) {
        audioRepository.deleteById(id);
    }

    @Transactional
    public Audio updateAudio(Long id, Audio audio) {
        Audio existing = audioRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTitle(audio.getTitle());
            existing.setFormat(audio.getFormat());
            existing.setArtist(audio.getArtist());
            existing.setAlbum(audio.getAlbum());
            existing.setBitrate(audio.getBitrate());
            existing.setCategory(audio.getCategory());
            existing.setTags(audio.getTags());
            return audioRepository.save(existing);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public Page<Audio> fetchAudios(String searchText, Long categoryId, Long tagId, Pageable pageable) {
        Specification<Audio> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchText != null && !searchText.isEmpty()) {
                Predicate titleLike = cb.like(root.get("title"), "%" + searchText + "%");
                Predicate artistLike = cb.like(root.get("artist"), "%" + searchText + "%");
                predicates.add(cb.or(titleLike, artistLike));
            }

            if (categoryId != null && categoryId != 0) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (tagId != null && tagId != 0) {
                predicates.add(cb.equal(root.get("tags").get("id"), tagId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return audioRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public Audio findById(Long id) {
        return audioRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Audio> findAllAudios() {
        return audioRepository.findAll();
    }
}

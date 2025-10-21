package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.entity.Subject;
import com.example.info.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subjects")
@RequiredArgsConstructor
public class SubjectController {
    private final SubjectService subjectService;

    @PostMapping
    public ResponseResult<Subject> createSubject(@RequestBody Subject subject) {
        Subject savedSubject = subjectService.createSubject(subject);
        return ResponseResult.success(savedSubject);
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseResult.success("删除成功");
    }

    @PutMapping("/{id}")
    public ResponseResult<Subject> updateSubject(
            @PathVariable Long id,
            @RequestBody Subject subject
    ) {
        Subject updatedSubject = subjectService.updateSubject(id, subject);
        return ResponseResult.success(updatedSubject);
    }

    @GetMapping
    public ResponseResult<List<Subject>> fetchSubjects() {
        List<Subject> subjects = subjectService.findAllSubjects();
        return ResponseResult.success(subjects);
    }

    @GetMapping("/all")
    public ResponseResult<List<Subject>> findAllSubjects() {
        List<Subject> subjects = subjectService.findAllSubjects();
        return ResponseResult.success(subjects);
    }

    @GetMapping("/{id}")
    public ResponseResult<Subject> fetchSubjectById(@PathVariable Long id) {
        Subject subject = subjectService.findById(id);
        return ResponseResult.success(subject);
    }
}

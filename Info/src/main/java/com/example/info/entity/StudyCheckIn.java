package com.example.info.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "study_checkins")
@Data
@EqualsAndHashCode(callSuper = false)
public class StudyCheckIn extends Info {
    @Column(length = 200)
    private String destination;

    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date travelDate;

    @Column(length = 50)
    private String transport;

    @Lob
    private String attractions;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany
    @JoinTable(
            name = "study_checkin_tag",
            joinColumns = @JoinColumn(name = "study_checkin_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();
}

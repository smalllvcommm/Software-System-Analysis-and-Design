package com.example.info.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "expenses")
@Data
@EqualsAndHashCode(callSuper = false)
public class Expense extends Info {
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(length = 50)
    private String paymentMethod;

    @Column(length = 100)
    private String merchant;

    @Column(length = 50)
    private String expenseType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany
    @JoinTable(
            name = "expense_tag",
            joinColumns = @JoinColumn(name = "expense_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();
}

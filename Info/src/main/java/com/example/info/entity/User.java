package com.example.info.entity;
import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id // 主键标识
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 主键自增策略
    private Long id;

    @Column(nullable = false, unique = true, length = 50) // 非空、唯一
    private String username;

    @Column(nullable = false, length = 100)
    private String password; // 实际需加密存储

    @Column(nullable = false)
    private String role;     // 角色：admin/user

}
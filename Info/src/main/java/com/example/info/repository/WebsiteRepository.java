package com.example.info.repository;

import com.example.info.entity.Website;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface WebsiteRepository extends JpaRepository<Website, Long>, JpaSpecificationExecutor<Website> {
}

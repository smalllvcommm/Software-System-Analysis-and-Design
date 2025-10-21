package com.example.info.repository;

import com.example.info.entity.TravelPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelPlanRepository extends JpaRepository<TravelPlan, Long>, JpaSpecificationExecutor<TravelPlan> {
}

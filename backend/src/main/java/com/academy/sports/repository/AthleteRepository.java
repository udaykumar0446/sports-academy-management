package com.academy.sports.repository;

import com.academy.sports.model.Athlete;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AthleteRepository extends JpaRepository<Athlete, Long> {
    long countByStatus(String status);
}

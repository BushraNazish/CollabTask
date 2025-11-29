package com.collabtask.collabtask.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabtask.collabtask.api.entity.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Integer> {
    
    // Find teams created by a specific user
    List<Team> findByCreatedBy_UserId(Integer userId);
    
    // Find team by name
    List<Team> findByTeamNameContaining(String teamName);
}
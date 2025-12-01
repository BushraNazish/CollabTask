package com.collabtask.collabtask.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabtask.collabtask.api.entity.Project;
import com.collabtask.collabtask.api.entity.ProjectStatus;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    
    // Find all projects in a team
    List<Project> findByTeam_TeamId(Integer teamId);
    
    // Find projects by status
    List<Project> findByStatus(ProjectStatus status);
    
    // Find projects by team and status
    List<Project> findByTeam_TeamIdAndStatus(Integer teamId, ProjectStatus status);
    
    // Find projects created by user
    List<Project> findByCreatedBy_UserId(Integer userId);
    
    // Search projects by name
    List<Project> findByProjectNameContaining(String projectName);
    
    // Find projects by priority
    List<Project> findByPriority(String priority);
}
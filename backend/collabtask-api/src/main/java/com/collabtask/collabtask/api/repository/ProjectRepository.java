package com.collabtask.collabtask.api.repository;

import com.collabtask.collabtask.api.entity.Project;
import com.collabtask.collabtask.api.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}
package com.collabtask.collabtask.api.service;

import com.collabtask.collabtask.api.entity.Project;
import com.collabtask.collabtask.api.entity.ProjectStatus;
import com.collabtask.collabtask.api.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    // Get all projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    // Get project by ID
    public Optional<Project> getProjectById(Integer projectId) {
        return projectRepository.findById(projectId);
    }
    
    // Create new project
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }
    
    // Update project
    public Project updateProject(Project project) {
        return projectRepository.save(project);
    }
    
    // Delete project
    public void deleteProject(Integer projectId) {
        projectRepository.deleteById(projectId);
    }
    
    // Get projects by team
    public List<Project> getProjectsByTeam(Integer teamId) {
        return projectRepository.findByTeam_TeamId(teamId);
    }
    
    // Get projects by status
    public List<Project> getProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }
    
    // Get projects by team and status
    public List<Project> getProjectsByTeamAndStatus(Integer teamId, ProjectStatus status) {
        return projectRepository.findByTeam_TeamIdAndStatus(teamId, status);
    }
    
    // Search projects by name
    public List<Project> searchProjectsByName(String keyword) {
        return projectRepository.findByProjectNameContaining(keyword);
    }
}
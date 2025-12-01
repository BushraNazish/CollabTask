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
    
    // Get projects by priority
    public List<Project> getProjectsByPriority(String priority) {
        return projectRepository.findByPriority(priority);
    }
    
    // Create new project
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }
    
    // Update project
    public Project updateProject(Integer projectId, Project projectDetails) {
        Project existingProject = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        
        // Update fields
        existingProject.setProjectName(projectDetails.getProjectName());
        existingProject.setDescription(projectDetails.getDescription());
        existingProject.setStatus(projectDetails.getStatus());
        existingProject.setPriority(projectDetails.getPriority());
        existingProject.setStartDate(projectDetails.getStartDate());
        existingProject.setEndDate(projectDetails.getEndDate());
        
        return projectRepository.save(existingProject);
    }
    
    // Delete project
    public void deleteProject(Integer projectId) {
        projectRepository.deleteById(projectId);
    }
    
    // Search projects by name
    public List<Project> searchProjectsByName(String keyword) {
        return projectRepository.findByProjectNameContaining(keyword);
    }
}
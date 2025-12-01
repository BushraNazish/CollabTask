package com.collabtask.collabtask.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabtask.collabtask.api.entity.Project;
import com.collabtask.collabtask.api.entity.ProjectStatus;
import com.collabtask.collabtask.api.service.ProjectService;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // Get all projects - Any authenticated user
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    // Get project by ID - Any authenticated user
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get projects by team - Any authenticated user
    @GetMapping("/team/{teamId}")
    public List<Project> getProjectsByTeam(@PathVariable Integer teamId) {
        return projectService.getProjectsByTeam(teamId);
    }

    // Get projects by status - Any authenticated user
    @GetMapping("/status/{status}")
    public List<Project> getProjectsByStatus(@PathVariable ProjectStatus status) {
        return projectService.getProjectsByStatus(status);
    }

    // Get projects by priority - Any authenticated user
    @GetMapping("/priority/{priority}")
    public List<Project> getProjectsByPriority(@PathVariable String priority) {
        return projectService.getProjectsByPriority(priority);
    }

    // Create project - ADMIN and MANAGER only
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    // Update project - ADMIN and MANAGER only
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Integer id, @RequestBody Project projectDetails) {
        Project updatedProject = projectService.updateProject(id, projectDetails);
        return ResponseEntity.ok(updatedProject);
    }

    // Delete project - ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Integer id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
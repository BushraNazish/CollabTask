package com.collabtask.collabtask.api.controller;

import com.collabtask.collabtask.api.entity.Project;
import com.collabtask.collabtask.api.entity.ProjectStatus;
import com.collabtask.collabtask.api.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    // GET /api/projects - Get all projects (with optional filters)
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(
            @RequestParam(required = false) Integer teamId,
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) String search) {
        
        List<Project> projects;
        
        // Apply filters based on query parameters
        if (teamId != null && status != null) {
            projects = projectService.getProjectsByTeamAndStatus(teamId, status);
        } else if (teamId != null) {
            projects = projectService.getProjectsByTeam(teamId);
        } else if (status != null) {
            projects = projectService.getProjectsByStatus(status);
        } else if (search != null) {
            projects = projectService.searchProjectsByName(search);
        } else {
            projects = projectService.getAllProjects();
        }
        
        return ResponseEntity.ok(projects);
    }
    
    // GET /api/projects/{id} - Get project by ID
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer id) {
        Optional<Project> project = projectService.getProjectById(id);
        return project.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    // POST /api/projects - Create new project
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project createdProject = projectService.createProject(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }
    
    // PUT /api/projects/{id} - Update project
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Integer id,
            @RequestBody Project project) {
        Optional<Project> existingProject = projectService.getProjectById(id);
        if (existingProject.isPresent()) {
            project.setProjectId(id);
            Project updatedProject = projectService.updateProject(project);
            return ResponseEntity.ok(updatedProject);
        }
        return ResponseEntity.notFound().build();
    }
    
    // DELETE /api/projects/{id} - Delete project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Integer id) {
        Optional<Project> project = projectService.getProjectById(id);
        if (project.isPresent()) {
            projectService.deleteProject(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
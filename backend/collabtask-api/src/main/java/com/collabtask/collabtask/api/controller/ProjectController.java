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
import com.collabtask.collabtask.api.service.ProjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Project Management", description = "Project CRUD operations - manage projects within teams")
@SecurityRequirement(name = "bearer-jwt")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    @Operation(
        summary = "Get all projects",
        description = "Retrieves a complete list of all projects across all teams. Accessible by all authenticated users."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved list of projects"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }
    
    @Operation(
        summary = "Get project by ID",
        description = "Retrieves detailed information about a specific project using its unique project ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved project details"),
        @ApiResponse(responseCode = "404", description = "Project not found with the specified ID"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public ResponseEntity<Project> getProjectById(
            @Parameter(description = "Unique ID of the project to retrieve", required = true, example = "1")
            @PathVariable Integer projectId) {
        return projectService.getProjectById(projectId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(
        summary = "Get projects by team",
        description = "Retrieves all projects belonging to a specific team. Useful for viewing team-specific projects."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved projects for the team"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/team/{teamId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Project> getProjectsByTeam(
            @Parameter(description = "Team ID to filter projects by", required = true, example = "1")
            @PathVariable Integer teamId) {
        return projectService.getProjectsByTeam(teamId);
    }
    
    @Operation(
        summary = "Get projects by priority",
        description = "Retrieves all projects with a specific priority level (HIGH, MEDIUM, LOW). Useful for prioritization."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved projects"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/priority/{priority}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Project> getProjectsByPriority(
            @Parameter(description = "Priority level: HIGH, MEDIUM, or LOW", required = true, example = "HIGH")
            @PathVariable String priority) {
        return projectService.getProjectsByPriority(priority);
    }
    
    @Operation(
        summary = "Create new project",
        description = "Creates a new project within a team. Only ADMIN and MANAGER roles can create projects."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Project created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input - validation failed"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN or MANAGER role")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }
    
    @Operation(
        summary = "Update project",
        description = "Updates an existing project's information such as name, description, status, or priority."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Project updated successfully"),
        @ApiResponse(responseCode = "404", description = "Project not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN or MANAGER role")
    })
    @PutMapping("/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Project> updateProject(
            @Parameter(description = "ID of the project to update", required = true, example = "1")
            @PathVariable Integer projectId,
            @RequestBody Project projectDetails) {
        Project updatedProject = projectService.updateProject(projectId, projectDetails);
        return ResponseEntity.ok(updatedProject);
    }
    
    @Operation(
        summary = "Delete project",
        description = "Permanently deletes a project from the system. Only ADMIN role can delete projects."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Project deleted successfully - No content returned"),
        @ApiResponse(responseCode = "404", description = "Project not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN role")
    })
    @DeleteMapping("/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(
            @Parameter(description = "ID of the project to delete", required = true, example = "1")
            @PathVariable Integer projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }
}

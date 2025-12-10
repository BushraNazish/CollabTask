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

import com.collabtask.collabtask.api.entity.Task;
import com.collabtask.collabtask.api.entity.TaskPriority;
import com.collabtask.collabtask.api.entity.TaskStatus;
import com.collabtask.collabtask.api.service.TaskService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Task Management", description = "Task CRUD operations - create, assign, and track tasks within projects")
@SecurityRequirement(name = "bearer-jwt")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @Autowired
    private com.collabtask.collabtask.api.service.UserService userService;
    
    @Operation(
        summary = "Get all tasks",
        description = "Retrieves a complete list of all tasks across all projects. Accessible by all authenticated users."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved list of tasks"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }
    
    @Operation(
        summary = "Get task by ID",
        description = "Retrieves detailed information about a specific task using its unique task ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved task details"),
        @ApiResponse(responseCode = "404", description = "Task not found with the specified ID"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public ResponseEntity<Task> getTaskById(
            @Parameter(description = "Unique ID of the task to retrieve", required = true, example = "1")
            @PathVariable Integer taskId) {
        return taskService.getTaskById(taskId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(
        summary = "Get tasks by project",
        description = "Retrieves all tasks belonging to a specific project. Useful for viewing project-specific tasks."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved tasks for the project"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Task> getTasksByProject(
            @Parameter(description = "Project ID to filter tasks by", required = true, example = "1")
            @PathVariable Integer projectId) {
        return taskService.getTasksByProject(projectId);
    }
    
    @Operation(
        summary = "Get tasks by assigned user",
        description = "Retrieves all tasks assigned to a specific user. Useful for personal task lists and workload management."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved assigned tasks"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/assigned/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Task> getTasksByAssignedUser(
            @Parameter(description = "User ID to filter assigned tasks by", required = true, example = "1")
            @PathVariable Integer userId) {
        return taskService.getTasksByAssignedUser(userId);
    }
    
    @Operation(
        summary = "Get tasks by status",
        description = "Retrieves all tasks with a specific status (TO_DO, IN_PROGRESS, COMPLETED). Useful for filtering workflows."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved tasks by status"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Task> getTasksByStatus(
            @Parameter(description = "Task status: TO_DO, IN_PROGRESS, or COMPLETED", required = true, example = "IN_PROGRESS")
            @PathVariable String status) {
        // Convert String to TaskStatus enum
        TaskStatus taskStatus = TaskStatus.valueOf(status);
        return taskService.getTasksByStatus(taskStatus);
    }
    
    @Operation(
        summary = "Get tasks by priority",
        description = "Retrieves all tasks with a specific priority level (HIGH, MEDIUM, LOW). Useful for prioritization."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved tasks by priority"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/priority/{priority}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Task> getTasksByPriority(
            @Parameter(description = "Priority level: HIGH, MEDIUM, or LOW", required = true, example = "HIGH")
            @PathVariable String priority) {
        // Convert String to TaskPriority enum
        TaskPriority taskPriority = TaskPriority.valueOf(priority);
        return taskService.getTasksByPriority(taskPriority);
    }
    
    @Operation(
        summary = "Get tasks by assigned user and status",
        description = "Retrieves tasks assigned to a specific user with a specific status. Useful for filtered personal task views."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved filtered tasks"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/assigned/{userId}/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Task> getTasksByAssignedUserAndStatus(
            @Parameter(description = "User ID to filter by", required = true, example = "1")
            @PathVariable Integer userId,
            @Parameter(description = "Task status: TO_DO, IN_PROGRESS, or COMPLETED", required = true, example = "TO_DO")
            @PathVariable String status) {
        // Convert String to TaskStatus enum
        TaskStatus taskStatus = TaskStatus.valueOf(status);
        return taskService.getTasksByAssignedUserAndStatus(userId, taskStatus);
    }
    
    @Operation(
        summary = "Create new task",
        description = "Creates a new task within a project. Only ADMIN and MANAGER roles can create tasks."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Task created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input - validation failed"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN or MANAGER role")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public Task createTask(@RequestBody Task task) {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.collabtask.collabtask.api.entity.User currentUser = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        task.setCreatedBy(currentUser);
        return taskService.createTask(task);
    }
    
    @Operation(
        summary = "Update task",
        description = "Updates an existing task's information such as title, description, status, priority, or assigned user."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Task updated successfully"),
        @ApiResponse(responseCode = "404", description = "Task not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN or MANAGER role")
    })
    @PutMapping("/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Task> updateTask(
            @Parameter(description = "ID of the task to update", required = true, example = "1")
            @PathVariable Integer taskId,
            @RequestBody Task taskDetails) {
        Task updatedTask = taskService.updateTask(taskId, taskDetails);
        return ResponseEntity.ok(updatedTask);
    }
    
    @Operation(
        summary = "Delete task",
        description = "Permanently deletes a task from the system. Only ADMIN role can delete tasks."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Task deleted successfully - No content returned"),
        @ApiResponse(responseCode = "404", description = "Task not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN role")
    })
    @DeleteMapping("/{taskId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(
            @Parameter(description = "ID of the task to delete", required = true, example = "1")
            @PathVariable Integer taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}

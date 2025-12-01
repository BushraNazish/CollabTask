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

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // Get all tasks - Any authenticated user
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // Get task by ID - Any authenticated user
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Integer id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get tasks by project - Any authenticated user
    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable Integer projectId) {
        return taskService.getTasksByProject(projectId);
    }

    // Get tasks assigned to user - Any authenticated user
    @GetMapping("/assigned/{userId}")
    public List<Task> getTasksAssignedToUser(@PathVariable Integer userId) {
        return taskService.getTasksByAssignedUser(userId);
    }

    // Get tasks by status - Any authenticated user
    @GetMapping("/status/{status}")
    public List<Task> getTasksByStatus(@PathVariable TaskStatus status) {
        return taskService.getTasksByStatus(status);
    }

    // Get tasks by priority - Any authenticated user
    @GetMapping("/priority/{priority}")
    public List<Task> getTasksByPriority(@PathVariable TaskPriority priority) {
        return taskService.getTasksByPriority(priority);
    }

    // Create task - ADMIN and MANAGER only
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    // Update task - ADMIN and MANAGER only
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Integer id, @RequestBody Task taskDetails) {
        Task updatedTask = taskService.updateTask(id, taskDetails);
        return ResponseEntity.ok(updatedTask);
    }

    // Delete task - ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
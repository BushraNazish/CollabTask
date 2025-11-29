package com.collabtask.collabtask.api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.collabtask.collabtask.api.entity.Task;
import com.collabtask.collabtask.api.entity.TaskPriority;
import com.collabtask.collabtask.api.entity.TaskStatus;
import com.collabtask.collabtask.api.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    // GET /api/tasks - Get all tasks (with optional filters)
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(
            @RequestParam(required = false) Integer projectId,
            @RequestParam(required = false) Integer assignedTo,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) Boolean unassigned,
            @RequestParam(required = false) Boolean overdue,
            @RequestParam(required = false) String search) {
        
        List<Task> tasks;
        
        // Apply filters based on query parameters
        if (overdue != null && overdue) {
            tasks = taskService.getOverdueTasks();
        } else if (unassigned != null && unassigned) {
            tasks = taskService.getUnassignedTasks();
        } else if (projectId != null && status != null) {
            tasks = taskService.getTasksByProjectAndStatus(projectId, status);
        } else if (projectId != null) {
            tasks = taskService.getTasksByProject(projectId);
        } else if (assignedTo != null) {
            tasks = taskService.getTasksByAssignedUser(assignedTo);
        } else if (status != null) {
            tasks = taskService.getTasksByStatus(status);
        } else if (priority != null) {
            tasks = taskService.getTasksByPriority(priority);
        } else if (search != null) {
            tasks = taskService.searchTasks(search);
        } else {
            tasks = taskService.getAllTasks();
        }
        
        return ResponseEntity.ok(tasks);
    }
    
    // GET /api/tasks/{id} - Get task by ID
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Integer id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    // POST /api/tasks - Create new task
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }
    
    // PUT /api/tasks/{id} - Update task
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Integer id,
            @RequestBody Task task) {
        Optional<Task> existingTask = taskService.getTaskById(id);
        if (existingTask.isPresent()) {
            task.setTaskId(id);
            Task updatedTask = taskService.updateTask(task);
            return ResponseEntity.ok(updatedTask);
        }
        return ResponseEntity.notFound().build();
    }
    
    // DELETE /api/tasks/{id} - Delete task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer id) {
        Optional<Task> task = taskService.getTaskById(id);
        if (task.isPresent()) {
            taskService.deleteTask(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // PUT /api/tasks/{id}/assign/{userId} - Assign task to user
    @PutMapping("/{id}/assign/{userId}")
    public ResponseEntity<Task> assignTask(
            @PathVariable Integer id,
            @PathVariable Integer userId) {
        try {
            Task task = taskService.assignTask(id, userId);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // PUT /api/tasks/{id}/status - Update task status
    @PutMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Integer id,
            @RequestParam TaskStatus status) {
        try {
            Task task = taskService.updateTaskStatus(id, status);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // PUT /api/tasks/{id}/priority - Update task priority
    @PutMapping("/{id}/priority")
    public ResponseEntity<Task> updateTaskPriority(
            @PathVariable Integer id,
            @RequestParam TaskPriority priority) {
        try {
            Task task = taskService.updateTaskPriority(id, priority);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
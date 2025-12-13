package com.collabtask.collabtask.api.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.collabtask.collabtask.api.entity.Project;
import com.collabtask.collabtask.api.entity.Task;
import com.collabtask.collabtask.api.entity.TaskPriority;
import com.collabtask.collabtask.api.entity.TaskStatus;
import com.collabtask.collabtask.api.entity.User;
import com.collabtask.collabtask.api.repository.ProjectRepository;
import com.collabtask.collabtask.api.repository.TaskRepository;
import com.collabtask.collabtask.api.repository.UserRepository;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;
    
    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    
    // Get task by ID
    public Optional<Task> getTaskById(Integer taskId) {
        return taskRepository.findById(taskId);
    }
    
    // Get tasks by project
    public List<Task> getTasksByProject(Integer projectId) {
        return taskRepository.findByProject_ProjectId(projectId);
    }
    
    // Get tasks assigned to user
    public List<Task> getTasksByAssignedUser(Integer userId) {
        return taskRepository.findByAssignedTo_UserId(userId);
    }
    
    // Get unassigned tasks
    public List<Task> getUnassignedTasks() {
        return taskRepository.findByAssignedToIsNull();
    }
    
    // Get tasks by status
    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }
    
    // Get tasks by priority
    public List<Task> getTasksByPriority(TaskPriority priority) {
        return taskRepository.findByPriority(priority);
    }
    
    // Get tasks by project and status
    public List<Task> getTasksByProjectAndStatus(Integer projectId, TaskStatus status) {
        return taskRepository.findByProject_ProjectIdAndStatus(projectId, status);
    }
    
    // Get tasks by assigned user and status
    public List<Task> getTasksByAssignedUserAndStatus(Integer userId, TaskStatus status) {
        return taskRepository.findByAssignedTo_UserIdAndStatus(userId, status);
    }
    
    // Get overdue tasks
    public List<Task> getOverdueTasks() {
        return taskRepository.findByDueDateBeforeAndStatusNot(
            LocalDate.now(), 
            TaskStatus.COMPLETED
        );
    }
    
    // Search tasks by title
    public List<Task> searchTasks(String keyword) {
        return taskRepository.findByTitleContaining(keyword);
    }
    
    // Create new task
    public Task createTask(Task task) {
        if (task.getProject() != null) {
            Project project = projectRepository.findById(task.getProject().getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            task.setProject(project);
        }
        if (task.getAssignedTo() != null) {
            User user = userRepository.findById(task.getAssignedTo().getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedTo(user);
        }
        return taskRepository.save(task);
    }
    
    // Update task - UPDATED METHOD SIGNATURE
    public Task updateTask(Integer taskId, Task taskDetails) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        
        // Update fields
        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());
        existingTask.setStatus(taskDetails.getStatus());
        existingTask.setPriority(taskDetails.getPriority());
        existingTask.setDueDate(taskDetails.getDueDate());
        if (taskDetails.getAssignedTo() != null) {
            User user = userRepository.findById(taskDetails.getAssignedTo().getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            existingTask.setAssignedTo(user);
        } else {
            existingTask.setAssignedTo(null);
        }
        
        return taskRepository.save(existingTask);
    }
    
    // Delete task
    public void deleteTask(Integer taskId) {
        taskRepository.deleteById(taskId);
    }
    
    // Assign task to user
    @Transactional
    public Task assignTask(Integer taskId, Integer userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        task.setAssignedTo(user);
        return taskRepository.save(task);
    }
    
    // Update task status
    @Transactional
    public Task updateTaskStatus(Integer taskId, TaskStatus newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setStatus(newStatus);
        return taskRepository.save(task);
    }
    
    // Update task priority
    @Transactional
    public Task updateTaskPriority(Integer taskId, TaskPriority newPriority) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setPriority(newPriority);
        return taskRepository.save(task);
    }
}
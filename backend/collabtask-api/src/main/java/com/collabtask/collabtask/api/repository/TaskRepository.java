package com.collabtask.collabtask.api.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabtask.collabtask.api.entity.Task;
import com.collabtask.collabtask.api.entity.TaskPriority;
import com.collabtask.collabtask.api.entity.TaskStatus;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    
    // Find tasks by project
    List<Task> findByProject_ProjectId(Integer projectId);
    
    // Check if tasks exist for a project
    boolean existsByProject_ProjectId(Integer projectId);
    
    // Find tasks assigned to a user
    List<Task> findByAssignedTo_UserId(Integer userId);
    
    // Find unassigned tasks
    List<Task> findByAssignedToIsNull();
    
    // Find tasks by status
    List<Task> findByStatus(TaskStatus status);
    
    // Find tasks by priority
    List<Task> findByPriority(TaskPriority priority);
    
    // Find tasks by project and status
    List<Task> findByProject_ProjectIdAndStatus(Integer projectId, TaskStatus status);
    
    // Find tasks by assigned user and status
    List<Task> findByAssignedTo_UserIdAndStatus(Integer userId, TaskStatus status);
    
    // Find overdue tasks (due date before today and not completed)
    List<Task> findByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);
    
    // Search tasks by title
    List<Task> findByTitleContaining(String keyword);
}
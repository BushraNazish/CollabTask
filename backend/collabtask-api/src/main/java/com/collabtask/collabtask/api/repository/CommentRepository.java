package com.collabtask.collabtask.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabtask.collabtask.api.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    
    // Find all comments on a task
    List<Comment> findByTask_TaskId(Integer taskId);
    
    // Find all comments by a user
    List<Comment> findByUser_UserId(Integer userId);
    
    // Find comments on a task, ordered by creation time
    List<Comment> findByTask_TaskIdOrderByCreatedAtAsc(Integer taskId);
}
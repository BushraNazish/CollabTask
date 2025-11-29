package com.collabtask.collabtask.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.collabtask.collabtask.api.entity.Comment;
import com.collabtask.collabtask.api.repository.CommentRepository;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    // Get all comments
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }
    
    // Get comment by ID
    public Optional<Comment> getCommentById(Integer commentId) {
        return commentRepository.findById(commentId);
    }
    
    // Create new comment
    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }
    
    // Update comment
    public Comment updateComment(Comment comment) {
        return commentRepository.save(comment);
    }
    
    // Delete comment
    public void deleteComment(Integer commentId) {
        commentRepository.deleteById(commentId);
    }
    
    // Get comments by task (ordered chronologically)
    public List<Comment> getCommentsByTask(Integer taskId) {
        return commentRepository.findByTask_TaskIdOrderByCreatedAtAsc(taskId);
    }
    
    // Get comments by user
    public List<Comment> getCommentsByUser(Integer userId) {
        return commentRepository.findByUser_UserId(userId);
    }
}
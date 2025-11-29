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

import com.collabtask.collabtask.api.entity.Comment;
import com.collabtask.collabtask.api.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    // GET /api/comments - Get all comments (with optional filters)
    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments(
            @RequestParam(required = false) Integer taskId,
            @RequestParam(required = false) Integer userId) {
        
        List<Comment> comments;
        
        if (taskId != null) {
            comments = commentService.getCommentsByTask(taskId);
        } else if (userId != null) {
            comments = commentService.getCommentsByUser(userId);
        } else {
            comments = commentService.getAllComments();
        }
        
        return ResponseEntity.ok(comments);
    }
    
    // GET /api/comments/{id} - Get comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Integer id) {
        Optional<Comment> comment = commentService.getCommentById(id);
        return comment.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    // POST /api/comments - Create new comment
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        Comment createdComment = commentService.createComment(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }
    
    // PUT /api/comments/{id} - Update comment
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Integer id,
            @RequestBody Comment comment) {
        Optional<Comment> existingComment = commentService.getCommentById(id);
        if (existingComment.isPresent()) {
            comment.setCommentId(id);
            Comment updatedComment = commentService.updateComment(comment);
            return ResponseEntity.ok(updatedComment);
        }
        return ResponseEntity.notFound().build();
    }
    
    // DELETE /api/comments/{id} - Delete comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Integer id) {
        Optional<Comment> comment = commentService.getCommentById(id);
        if (comment.isPresent()) {
            commentService.deleteComment(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
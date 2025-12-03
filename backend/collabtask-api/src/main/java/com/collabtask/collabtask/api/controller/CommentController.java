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

import com.collabtask.collabtask.api.entity.Comment;
import com.collabtask.collabtask.api.service.CommentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/comments")
@Tag(name = "Comment Management", description = "Comment operations - add comments and discussions to tasks")
@SecurityRequirement(name = "bearer-jwt")
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    @Operation(
        summary = "Get all comments",
        description = "Retrieves a complete list of all comments across all tasks. Primarily for admin monitoring purposes."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved list of comments"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Comment> getAllComments() {
        return commentService.getAllComments();
    }
    
    @Operation(
        summary = "Get comment by ID",
        description = "Retrieves detailed information about a specific comment using its unique comment ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved comment details"),
        @ApiResponse(responseCode = "404", description = "Comment not found with the specified ID"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/{commentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public ResponseEntity<Comment> getCommentById(
            @Parameter(description = "Unique ID of the comment to retrieve", required = true, example = "1")
            @PathVariable Integer commentId) {
        return commentService.getCommentById(commentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(
        summary = "Get comments by task",
        description = "Retrieves all comments for a specific task. This is the primary way to view task discussions."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved comments for the task"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/task/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Comment> getCommentsByTask(
            @Parameter(description = "Task ID to retrieve comments for", required = true, example = "1")
            @PathVariable Integer taskId) {
        return commentService.getCommentsByTask(taskId);
    }
    
    @Operation(
        summary = "Get comments by user",
        description = "Retrieves all comments created by a specific user. Useful for tracking user contributions and activity."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved user's comments"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Comment> getCommentsByUser(
            @Parameter(description = "User ID to filter comments by", required = true, example = "1")
            @PathVariable Integer userId) {
        return commentService.getCommentsByUser(userId);
    }
    
    @Operation(
        summary = "Create new comment",
        description = "Adds a new comment to a task. All authenticated users can create comments for collaboration."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comment created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input - validation failed"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Task not found")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public Comment createComment(@RequestBody Comment comment) {
        return commentService.createComment(comment);
    }
    
    @Operation(
        summary = "Update comment",
        description = "Updates an existing comment's text. Users can edit their own comments, ADMIN and MANAGER can edit any comment."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comment updated successfully"),
        @ApiResponse(responseCode = "404", description = "Comment not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Can only edit own comments unless ADMIN/MANAGER")
    })
    @PutMapping("/{commentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public ResponseEntity<Comment> updateComment(
            @Parameter(description = "ID of the comment to update", required = true, example = "1")
            @PathVariable Integer commentId,
            @RequestBody Comment commentDetails) {
        // Set the comment ID from path variable into the comment object
        commentDetails.setCommentId(commentId);
        Comment updatedComment = commentService.updateComment(commentDetails);
        return ResponseEntity.ok(updatedComment);
    }
    
    @Operation(
        summary = "Delete comment",
        description = "Permanently deletes a comment from a task. Only ADMIN role can delete any comment."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Comment deleted successfully - No content returned"),
        @ApiResponse(responseCode = "404", description = "Comment not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN role")
    })
    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteComment(
            @Parameter(description = "ID of the comment to delete", required = true, example = "1")
            @PathVariable Integer commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}

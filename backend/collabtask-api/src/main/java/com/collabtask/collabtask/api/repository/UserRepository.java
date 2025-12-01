package com.collabtask.collabtask.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabtask.collabtask.api.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Find user by email
    Optional<User> findByEmail(String email);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find users by role - NEW METHOD ADDED
    List<User> findByRole(String role);
}
package com.collabtask.collabtask.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.collabtask.collabtask.api.entity.User;
import com.collabtask.collabtask.api.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Get user by ID
    public Optional<User> getUserById(Integer userId) {
        return userRepository.findById(userId);
    }
    
    // Get user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // Get users by role - NEW METHOD ADDED
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }
    
    // Create new user
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    // Update existing user - UPDATED METHOD SIGNATURE
    public User updateUser(Integer userId, User userDetails) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Update fields
        existingUser.setName(userDetails.getName());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setRole(userDetails.getRole());
        
        return userRepository.save(existingUser);
    }
    
    // Delete user
    public void deleteUser(Integer userId) {
        userRepository.deleteById(userId);
    }
    
    // Check if email exists
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
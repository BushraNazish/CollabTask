package com.collabtask.collabtask.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.collabtask.collabtask.api.entity.User;
import com.collabtask.collabtask.api.exception.ResourceNotFoundException;
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
    
    // Get users by role
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }
    
    // Create new user
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    // Update existing user - NOW THROWS CUSTOM EXCEPTION
    public User updateUser(Integer userId, User userDetails) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        // Update fields
        // Update fields only if they are not null (Partial Update)
        if (userDetails.getName() != null) {
            existingUser.setName(userDetails.getName());
        }
        if (userDetails.getEmail() != null) {
            existingUser.setEmail(userDetails.getEmail());
        }
        if (userDetails.getRole() != null) {
            existingUser.setRole(userDetails.getRole());
        }
        if (userDetails.getPassword() != null) {
            existingUser.setPassword(userDetails.getPassword());
        }
        
        return userRepository.save(existingUser);
    }
    
    // Delete user - NOW THROWS CUSTOM EXCEPTION
    public void deleteUser(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        userRepository.deleteById(userId);
    }
    
    // Check if email exists
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
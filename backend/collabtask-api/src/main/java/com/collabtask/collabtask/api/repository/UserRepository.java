package com.collabtask.collabtask.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabtask.collabtask.api.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Custom query methods
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
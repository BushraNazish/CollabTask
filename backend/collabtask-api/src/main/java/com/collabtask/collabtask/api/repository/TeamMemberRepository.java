package com.collabtask.collabtask.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabtask.collabtask.api.entity.TeamMember;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Integer> {
    
    // Find all members of a team
    List<TeamMember> findByTeam_TeamId(Integer teamId);
    
    // Find all teams a user is in
    List<TeamMember> findByUser_UserId(Integer userId);
    
    // Check if user is in a team
    boolean existsByTeam_TeamIdAndUser_UserId(Integer teamId, Integer userId);
    
    // Find specific team membership
    Optional<TeamMember> findByTeam_TeamIdAndUser_UserId(Integer teamId, Integer userId);
    
    // Delete team membership
    void deleteByTeam_TeamIdAndUser_UserId(Integer teamId, Integer userId);
}
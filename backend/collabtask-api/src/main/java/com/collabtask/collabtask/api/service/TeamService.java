package com.collabtask.collabtask.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.collabtask.collabtask.api.entity.Team;
import com.collabtask.collabtask.api.entity.TeamMember;
import com.collabtask.collabtask.api.entity.User;
import com.collabtask.collabtask.api.repository.TeamMemberRepository;
import com.collabtask.collabtask.api.repository.TeamRepository;
import com.collabtask.collabtask.api.repository.UserRepository;

@Service
public class TeamService {
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private TeamMemberRepository teamMemberRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all teams
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }
    
    // Get team by ID
    public Optional<Team> getTeamById(Integer teamId) {
        return teamRepository.findById(teamId);
    }
    
    // Get teams by creator - NEW METHOD
    public List<Team> getTeamsByCreator(Integer creatorId) {
        return teamRepository.findByCreatedBy_UserId(creatorId);
    }
    
    // Create new team
    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }
    
    // Update team - UPDATED METHOD SIGNATURE
    public Team updateTeam(Integer teamId, Team teamDetails) {
        Team existingTeam = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamId));
        
        // Update fields
        existingTeam.setTeamName(teamDetails.getTeamName());
        existingTeam.setDescription(teamDetails.getDescription());
        
        return teamRepository.save(existingTeam);
    }
    
    // Delete team
    public void deleteTeam(Integer teamId) {
        teamRepository.deleteById(teamId);
    }
    
    // Get all members of a team
    public List<TeamMember> getTeamMembers(Integer teamId) {
        return teamMemberRepository.findByTeam_TeamId(teamId);
    }
    
    // Add member to team
    @Transactional
    public TeamMember addMemberToTeam(Integer teamId, Integer userId) {
        // Check if already member
        if (teamMemberRepository.existsByTeam_TeamIdAndUser_UserId(teamId, userId)) {
            throw new RuntimeException("User is already a member of this team");
        }
        
        // Get team and user
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create team member
        TeamMember teamMember = new TeamMember();
        teamMember.setTeam(team);
        teamMember.setUser(user);
        
        return teamMemberRepository.save(teamMember);
    }
    
    // Remove member from team
    @Transactional
    public void removeMemberFromTeam(Integer teamId, Integer userId) {
        if (!teamMemberRepository.existsByTeam_TeamIdAndUser_UserId(teamId, userId)) {
            throw new RuntimeException("User is not a member of this team");
        }
        teamMemberRepository.deleteByTeam_TeamIdAndUser_UserId(teamId, userId);
    }
}
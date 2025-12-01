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

import com.collabtask.collabtask.api.entity.Team;
import com.collabtask.collabtask.api.entity.TeamMember;
import com.collabtask.collabtask.api.service.TeamService;

@RestController
@RequestMapping("/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    // Get all teams - Any authenticated user
    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }

    // Get team by ID - Any authenticated user
    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Integer id) {
        return teamService.getTeamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get teams by creator - Any authenticated user
    @GetMapping("/creator/{creatorId}")
    public List<Team> getTeamsByCreator(@PathVariable Integer creatorId) {
        return teamService.getTeamsByCreator(creatorId);
    }

    // Create team - ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Team createTeam(@RequestBody Team team) {
        return teamService.createTeam(team);
    }

    // Update team - ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable Integer id, @RequestBody Team teamDetails) {
        Team updatedTeam = teamService.updateTeam(id, teamDetails);
        return ResponseEntity.ok(updatedTeam);
    }

    // Delete team - ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Integer id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    // Add team member - ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{teamId}/members/{userId}")
    public ResponseEntity<TeamMember> addTeamMember(@PathVariable Integer teamId, @PathVariable Integer userId) {
        TeamMember teamMember = teamService.addMemberToTeam(teamId, userId);
        return ResponseEntity.ok(teamMember);
    }

    // Remove team member - ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<Void> removeTeamMember(@PathVariable Integer teamId, @PathVariable Integer userId) {
        teamService.removeMemberFromTeam(teamId, userId);
        return ResponseEntity.noContent().build();
    }

    // Get team members - Any authenticated user
    @GetMapping("/{teamId}/members")
    public List<TeamMember> getTeamMembers(@PathVariable Integer teamId) {
        return teamService.getTeamMembers(teamId);
    }
}
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
import org.springframework.web.bind.annotation.RestController;

import com.collabtask.collabtask.api.entity.Team;
import com.collabtask.collabtask.api.entity.TeamMember;
import com.collabtask.collabtask.api.service.TeamService;

@RestController
@RequestMapping("/api/teams")
public class TeamController {
    
    @Autowired
    private TeamService teamService;
    
    // GET /api/teams - Get all teams
    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        List<Team> teams = teamService.getAllTeams();
        return ResponseEntity.ok(teams);
    }
    
    // GET /api/teams/{id} - Get team by ID
    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Integer id) {
        Optional<Team> team = teamService.getTeamById(id);
        return team.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    // POST /api/teams - Create new team
    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        Team createdTeam = teamService.createTeam(team);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTeam);
    }
    
    // PUT /api/teams/{id} - Update team
    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable Integer id, @RequestBody Team team) {
        Optional<Team> existingTeam = teamService.getTeamById(id);
        if (existingTeam.isPresent()) {
            team.setTeamId(id);
            Team updatedTeam = teamService.updateTeam(team);
            return ResponseEntity.ok(updatedTeam);
        }
        return ResponseEntity.notFound().build();
    }
    
    // DELETE /api/teams/{id} - Delete team
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Integer id) {
        Optional<Team> team = teamService.getTeamById(id);
        if (team.isPresent()) {
            teamService.deleteTeam(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // GET /api/teams/{id}/members - Get team members
    @GetMapping("/{id}/members")
    public ResponseEntity<List<TeamMember>> getTeamMembers(@PathVariable Integer id) {
        List<TeamMember> members = teamService.getTeamMembers(id);
        return ResponseEntity.ok(members);
    }
    
    // POST /api/teams/{teamId}/members/{userId} - Add member to team
    @PostMapping("/{teamId}/members/{userId}")
    public ResponseEntity<TeamMember> addMemberToTeam(
            @PathVariable Integer teamId,
            @PathVariable Integer userId) {
        try {
            TeamMember teamMember = teamService.addMemberToTeam(teamId, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(teamMember);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // DELETE /api/teams/{teamId}/members/{userId} - Remove member from team
    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<Void> removeMemberFromTeam(
            @PathVariable Integer teamId,
            @PathVariable Integer userId) {
        try {
            teamService.removeMemberFromTeam(teamId, userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
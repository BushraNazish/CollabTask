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
import com.collabtask.collabtask.api.service.TeamService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/teams")
@Tag(name = "Team Management", description = "Team CRUD operations - create, manage, and organize teams")
@SecurityRequirement(name = "bearer-jwt")
public class TeamController {
    
    @Autowired
    private TeamService teamService;
    
    @Autowired
    private com.collabtask.collabtask.api.service.UserService userService;
    
    @Operation(
        summary = "Get all teams",
        description = "Retrieves a complete list of all teams in the system. Accessible by all authenticated users."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved list of teams"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }
    
    @Operation(
        summary = "Get team by ID",
        description = "Retrieves detailed information about a specific team using its unique team ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved team details"),
        @ApiResponse(responseCode = "404", description = "Team not found with the specified ID"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/{teamId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public ResponseEntity<Team> getTeamById(
            @Parameter(description = "Unique ID of the team to retrieve", required = true, example = "1")
            @PathVariable Integer teamId) {
        return teamService.getTeamById(teamId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(
        summary = "Get teams by creator",
        description = "Retrieves all teams created by a specific user. Useful for viewing teams owned by a particular user."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved teams"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/creator/{creatorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEMBER')")
    public List<Team> getTeamsByCreator(
            @Parameter(description = "User ID of the team creator", required = true, example = "1")
            @PathVariable Integer creatorId) {
        return teamService.getTeamsByCreator(creatorId);
    }
    
    @Operation(
        summary = "Create new team",
        description = "Creates a new team with the provided details. Only ADMIN and MANAGER roles can create teams."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Team created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input - validation failed"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN or MANAGER role")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public Team createTeam(@RequestBody Team team) {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.collabtask.collabtask.api.entity.User currentUser = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        team.setCreatedBy(currentUser);
        return teamService.createTeam(team);
    }
    
    @Operation(
        summary = "Update team",
        description = "Updates an existing team's information such as name or description. Only ADMIN and MANAGER can update teams."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Team updated successfully"),
        @ApiResponse(responseCode = "404", description = "Team not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN or MANAGER role")
    })
    @PutMapping("/{teamId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Team> updateTeam(
            @Parameter(description = "ID of the team to update", required = true, example = "1")
            @PathVariable Integer teamId,
            @RequestBody Team teamDetails) {
        Team updatedTeam = teamService.updateTeam(teamId, teamDetails);
        return ResponseEntity.ok(updatedTeam);
    }
    
    @Operation(
        summary = "Delete team",
        description = "Permanently deletes a team from the system. Only ADMIN role can delete teams."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Team deleted successfully - No content returned"),
        @ApiResponse(responseCode = "404", description = "Team not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN role")
    })
    @DeleteMapping("/{teamId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTeam(
            @Parameter(description = "ID of the team to delete", required = true, example = "1")
            @PathVariable Integer teamId) {
        teamService.deleteTeam(teamId);
        return ResponseEntity.noContent().build();
    }
}

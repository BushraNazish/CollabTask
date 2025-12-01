package com.collabtask.collabtask.api.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Extract Authorization header
        String authHeader = request.getHeader("Authorization");

        // Check if header exists and starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Extract token (remove "Bearer " prefix)
            String token = authHeader.substring(7);

            try {
                // Extract email and role from token
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);

                // Validate token
                if (email != null && jwtUtil.validateToken(token, email)) {
                    // Create authority with role
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                    // Create authentication object
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    Collections.singletonList(authority)
                            );

                    // Set additional details
                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    // Set authentication in security context
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                // Token validation failed - do nothing, request will be unauthorized
                System.err.println("JWT validation failed: " + e.getMessage());
            }
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }
}
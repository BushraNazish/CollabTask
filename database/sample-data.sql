-- Sample Data for CollabTask
-- This file contains instructions for creating sample data through API

USE collabtask_db;

-- Note: Passwords must be hashed using BCrypt through the API
-- Do NOT insert plain text passwords directly into the database

-- Create sample users through the API endpoints:
-- Use Postman to call POST http://localhost:8080/auth/register

/*
Example API calls for creating sample users:

1. Register Admin User:
POST http://localhost:8080/auth/register
{
  "name": "Admin User",
  "email": "admin@collabtask.com",
  "password": "admin123",
  "role": "ADMIN"
}

2. Register Manager:
POST http://localhost:8080/auth/register
{
  "name": "Manager Priya",
  "email": "priya@collabtask.com",
  "password": "priya123",
  "role": "MANAGER"
}

3. Register Developer/Member:
POST http://localhost:8080/auth/register
{
  "name": "Developer Rahul",
  "email": "rahul@collabtask.com",
  "password": "rahul123",
  "role": "MEMBER"
}

After creating users, create teams, projects, and tasks through respective API endpoints.
*/

-- Verification queries:
-- Check if users were created:
-- SELECT user_id, name, email, role, created_at FROM users;

-- Check if teams were created:
-- SELECT team_id, team_name, description, created_by FROM teams;

-- Check if projects were created:
-- SELECT project_id, project_name, team_id, status FROM projects;

-- Check if tasks were created:
-- SELECT task_id, task_name, project_id, assigned_to, status FROM tasks;
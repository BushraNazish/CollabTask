# CollabTask Database Documentation

## Overview

This directory contains the database schema and related documentation for the CollabTask application.

## Files

- `schema.sql` - Complete database schema with all tables
- `sample-data.sql` - Instructions for creating sample data via API
- `README.md` - This file (database documentation)

## Database Setup

### Prerequisites
- MySQL 8.0 or higher
- MySQL client or MySQL Workbench

### Setup Instructions

1. **Create the database and tables:**

**Option A: Using MySQL Workbench**
- Open MySQL Workbench
- Open `schema.sql`
- Execute the script (click ⚡ lightning bolt icon)

**Option B: Using command line**
```bash
mysql -u root -p < database/schema.sql
```

2. **Verify tables were created:**
```sql
USE collabtask_db;
SHOW TABLES;
```

Expected output:
```
+-------------------------+
| Tables_in_collabtask_db |
+-------------------------+
| comments                |
| projects                |
| tasks                   |
| team_members            |
| teams                   |
| users                   |
+-------------------------+
```

## Database Schema

### Entity Relationship Diagram
```
users (1) ─────< (M) team_members (M) >───── (1) teams
                                                 │
                                                 │ (1)
                                                 V
                                              projects (M)
                                                 │
                                                 │ (1)
                                                 V
users (1) ────< (M) tasks (M) >──────────────┘
   │                │
   │ (1)            │ (1)
   V                V
comments (M) <───── tasks
```

### Tables

#### 1. users
Stores user account information with role-based access control.

**Columns:**
- `user_id` (PK, AUTO_INCREMENT) - Unique user identifier
- `name` VARCHAR(100) - User's full name
- `email` VARCHAR(100, UNIQUE) - User's email address
- `password` VARCHAR(255) - BCrypt hashed password
- `role` ENUM - User role: ADMIN, MANAGER, or MEMBER
- `created_at` TIMESTAMP - Account creation timestamp

**Indexes:**
- Primary Key: `user_id`
- Unique Index: `email`
- Index: `role`

---

#### 2. teams
Stores team information.

**Columns:**
- `team_id` (PK, AUTO_INCREMENT) - Unique team identifier
- `team_name` VARCHAR(100) - Team name
- `description` TEXT - Team description
- `created_by` (FK → users.user_id) - User who created the team
- `created_at` TIMESTAMP - Team creation timestamp

**Relationships:**
- Many-to-One with `users` (created_by)
- One-to-Many with `team_members`
- One-to-Many with `projects`

---

#### 3. team_members
Junction table for many-to-many relationship between teams and users.

**Columns:**
- `team_member_id` (PK, AUTO_INCREMENT) - Unique identifier
- `team_id` (FK → teams.team_id) - Team reference
- `user_id` (FK → users.user_id) - User reference
- `joined_at` TIMESTAMP - Membership timestamp

**Constraints:**
- Unique constraint on (team_id, user_id) - Prevents duplicate memberships

---

#### 4. projects
Stores project information.

**Columns:**
- `project_id` (PK, AUTO_INCREMENT) - Unique project identifier
- `project_name` VARCHAR(100) - Project name
- `description` TEXT - Project description
- `team_id` (FK → teams.team_id) - Associated team
- `status` ENUM - PLANNING, IN_PROGRESS, COMPLETED, ON_HOLD
- `priority` ENUM - LOW, MEDIUM, HIGH, CRITICAL
- `start_date` DATE - Project start date
- `end_date` DATE - Project end date
- `created_at` TIMESTAMP - Project creation timestamp

---

#### 5. tasks
Stores task information.

**Columns:**
- `task_id` (PK, AUTO_INCREMENT) - Unique task identifier
- `task_name` VARCHAR(200) - Task name
- `description` TEXT - Task description
- `project_id` (FK → projects.project_id) - Associated project
- `assigned_to` (FK → users.user_id, nullable) - Assigned user
- `status` ENUM - TODO, IN_PROGRESS, IN_REVIEW, COMPLETED
- `priority` ENUM - LOW, MEDIUM, HIGH, CRITICAL
- `due_date` DATE - Task deadline
- `created_at` TIMESTAMP - Task creation timestamp
- `updated_at` TIMESTAMP - Last update timestamp (auto-updates)

---

#### 6. comments
Stores task comments.

**Columns:**
- `comment_id` (PK, AUTO_INCREMENT) - Unique comment identifier
- `task_id` (FK → tasks.task_id) - Associated task
- `user_id` (FK → users.user_id) - Comment author
- `comment_text` TEXT - Comment content
- `created_at` TIMESTAMP - Comment creation timestamp

---

## Creating Sample Data

**Important:** Do NOT insert users directly into the database with plain text passwords.

**Use the API endpoints to create data with proper password hashing:**

See `sample-data.sql` for example API calls.

### Recommended Order:
1. Create users (POST /auth/register)
2. Login as admin (POST /auth/login)
3. Create teams (POST /teams)
4. Add team members (POST /teams/{id}/members)
5. Create projects (POST /projects)
6. Create tasks (POST /tasks)
7. Add comments (POST /comments)

## Database Maintenance

### Backup
```bash
mysqldump -u root -p collabtask_db > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
mysql -u root -p collabtask_db < backup_20251129.sql
```

### Drop and Recreate
```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS collabtask_db;"
mysql -u root -p < database/schema.sql
```

## Security Notes

- **Passwords:** All passwords are BCrypt hashed (never plain text)
- **Foreign Keys:** Maintain referential integrity
- **Cascade Deletes:** Deleting a user/team/project cascades to related records
- **Set NULL:** Deleting assigned user sets task.assigned_to to NULL

## Performance Optimization

- **Indexes** added on frequently queried columns:
  - users: email, role
  - teams: created_by
  - team_members: team_id, user_id
  - projects: team_id, status, priority
  - tasks: project_id, assigned_to, status, priority
  - comments: task_id, user_id

## Supported MySQL Features

- AUTO_INCREMENT for primary keys
- ENUM types for constrained values
- TIMESTAMP with automatic updates (updated_at)
- Foreign key constraints
- Composite unique keys
- InnoDB engine for ACID compliance
- UTF8MB4 character set for emoji support
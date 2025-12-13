# CollabTask: Full Stack Project Management Platform

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)

**CollabTask** is a comprehensive project management solution designed to streamline team collaboration. It features a robust **Spring Boot** backend for secure data handling and a modern **React** frontend for an intuitive user experience.

---

## 📋 Table of Contents
- [User Journey & Interface](#-user-journey--interface)
  - [Authentication](#1-authentication)
  - [Dashboard](#2-dashboard)
  - [Project Management](#3-project-management)
  - [Task Tracking](#4-task-tracking)
  - [Team & User Management](#5-team--user-management)
- [Backend Business Logic](#-backend-business-logic)
  - [Core Rules](#core-rules)
  - [API Documentation (Swagger)](#api-documentation-swagger)
  - [Data Model (ERD)](#data-model-erd)
- [Getting Started](#-getting-started)

---

## 🗺 User Journey & Interface

The application follows a secure and structured flow, as illustrated below. Users interact with a clean, responsive UI to manage their work.

### User Journey Flowchart

```mermaid
graph TD
    A[Public Visitor] -->|Access App| B(Login / Register);
    B -->|Success| C{Has Token?};
    C -- Yes --> D[Dashboard Layout];
    C -- No --> B;
    
    D --> E[Dashboard Overview];
    D --> F[Projects Page];
    D --> G[Tasks Page];
    D --> H[Teams Page];
    D --> I[Users Management];
    
    F --> F1[Filter Projects];
    F --> F2[Create/Edit Project];
    
    G --> G1[Multi-Select Filters];
    G --> G2[Task Details Modal];
    G --> G3[Create/Edit Task];
```

### 1. Authentication
Secure access is verified via JWT.
- **Register**: New users can create an account.
- **Login**: Existing users authenticate to receive a secure token.

| Register | Login |
| :---: | :---: |
| ![Register Page](images/frontend%20webpages/Register%20Page.png) | ![Login Page](images/frontend%20webpages/Login%20Page.png) |

### 2. Dashboard
The command center of the application. Provides a high-level overview of project statuses, pending tasks, and team activities.

![Dashboard](images/frontend%20webpages/Dashboard.png)

### 3. Project Management
Users can create and manage multiple projects.
- **Projects Page**: View all projects with status indicators.
- **Filtering**: Filter projects by status or team.

![Projects Page](images/frontend%20webpages/Projects%20Page.png)

### 4. Task Tracking
The core of productivity.
- **My Tasks**: A detailed view of all tasks assigned to the user or their team.
- **Advanced Filtering**: Use the **Professional Filter Bar** to slice data by Status, Priority, Project, or Assignee.
- **Task Search**: Instant text search for task titles.

![My Tasks Page](images/frontend%20webpages/My%20Tasks%20Page.png)

### 5. Team & User Management
- **Teams**: Manage team creation and member lists.
- **Users**: Admin-accessible user management (Edit/Delete users).

| Teams Page | Users Page |
| :---: | :---: |
| ![Teams Page](images/frontend%20webpages/Teams%20Page.png) | ![Users Page](images/frontend%20webpages/Users%20Page.png) |

---

## 🧠 Backend Business Logic

The backend enforces strict data integrity and business rules.

### Core Rules

#### Projects
- **Deletion Protection**: A project *cannot* be deleted if it has associated tasks. This prevents data loss.
- **Status Workflow**: `PLANNING` → `IN_PROGRESS` → `COMPLETED` (or `ON_HOLD`).

#### Tasks
- **Overdue Logic**: Tasks are automatically flagged as overdue if `Due Date < Today` and status is not `COMPLETED`.
- **Assignment**: Tasks can be re-assigned or left unassigned.

#### Access Control (RBAC)
- **ADMIN**: Full system access (User management, etc.).
- **MANAGER**: Team and Project management.
- **MEMBER**: Standard access (Create tasks, update status).

### API Documentation (Swagger)

The API is fully documented using Swagger UI.

#### Auth & Comments
Endpoints for user authentication and task comments.
![Auth-Comment](images/backend%20swagger/Auth-Comment.png)

#### Teams & Users
Endpoints for managing team structures and user accounts.
![Team-User](images/backend%20swagger/Team-User.png)

#### Projects & Tasks
Core endpoints for the main application entities.
![Project-Task](images/backend%20swagger/Project-Task.png)

#### Data Schemas
Comprehensive request/response bodies.
![Schemas](images/backend%20swagger/Schemas.png)

### Data Model (ERD)

The following diagram illustrates the relationship between Users, Teams, Projects, and Tasks.

```mermaid
erDiagram
    USER ||--o{ PROJECT : "creates"
    USER ||--o{ TASK : "assigned to"
    USER ||--o{ TEAM : "creates"
    USER ||--o{ TEAM_MEMBER : "is member of"
    
    TEAM ||--o{ PROJECT : "owns"
    TEAM ||--o{ TEAM_MEMBER : "has members"
    
    PROJECT ||--o{ TASK : "contains"
    
    USER {
        int user_id PK
        string name
        string email
        string password
        enum role "ADMIN, MANAGER, MEMBER"
    }

    PROJECT {
        int project_id PK
        string project_name
        string description
        enum status "PLANNING, IN_PROGRESS, COMPLETED, ON_HOLD"
        string priority
        date start_date
        date end_date
    }

    TASK {
        int task_id PK
        string title
        string description
        enum priority "HIGH, MEDIUM, LOW"
        enum status "TO_DO, IN_PROGRESS, COMPLETED"
        date due_date
    }

    TEAM {
        int team_id PK
        string team_name
        string description
    }
```

---

## 🚀 Getting Started

To run the full stack application locally:

### 1. Backend (Spring Boot)
```bash
cd backend/collabtask-api
mvn spring-boot:run
```
*Server runs on port 8080.*

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
*App runs on http://localhost:5173.*

---
*CollabTask Documentation*

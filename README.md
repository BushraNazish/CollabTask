# 🚀 CollabTask - Task Management System

A full-stack web application for managing tasks, projects, and teams with role-based access control.

## 📋 Project Overview

CollabTask is a comprehensive task management system built with modern technologies, featuring:
- User authentication with JWT
- Role-based authorization (Admin, Manager, Member)
- Team and project management
- Task assignment and tracking
- RESTful API architecture

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.4.1
- **Language:** Java 17
- **Database:** MySQL 8.0
- **Security:** Spring Security + JWT
- **ORM:** Spring Data JPA (Hibernate)
- **Build Tool:** Maven

### Frontend (Coming Soon)
- React
- Axios
- React Router

## 📂 Project Structure
```
CollabTaskProject/
├── backend/
│   └── collabtask-api/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/collabtask/collabtask/api/
│       │   │   │   ├── controller/
│       │   │   │   ├── dto/
│       │   │   │   ├── entity/
│       │   │   │   ├── repository/
│       │   │   │   ├── security/
│       │   │   │   └── service/
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       └── pom.xml
└── frontend/ (Coming Soon)
```

## ✨ Features Implemented

### Phase 1: Database Design ✅
- Normalized 6-table schema
- Complex relationships (One-to-Many, Many-to-Many)
- Proper constraints and indexes

### Phase 2: Backend API ✅
- 31 REST API endpoints
- CRUD operations for all entities
- Complex filtering and search
- Business logic implementation

### Phase 2B: Security Foundation ✅
- JWT-based authentication
- Password encryption with BCrypt
- User registration and login
- Stateless session management
- Public and protected endpoints

## 🔐 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Users
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Teams
- `GET /teams` - Get all teams
- `GET /teams/{id}` - Get team by ID
- `POST /teams` - Create team
- And more...

### Projects
- CRUD operations for projects
- Filter by team, status, priority

### Tasks
- CRUD operations for tasks
- Complex filtering and assignment

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6+
- Git

### Database Setup
1. Create database:
```sql
CREATE DATABASE collabtask_db;
```

2. Update `application.properties` with your MySQL credentials

### Running the Application

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/CollabTask.git
cd CollabTask
```

2. Navigate to backend:
```bash
cd backend/collabtask-api
```

3. Run the application:
```bash
mvn spring-boot:run
```

4. Server will start at: `http://localhost:8080`

## 📝 Database Schema

- **users** - User accounts with roles
- **teams** - Team information
- **team_members** - Team membership (junction table)
- **projects** - Project details
- **tasks** - Task information
- **comments** - Task comments

## 🔒 Security

- JWT token-based authentication
- BCrypt password hashing
- Role-based access control (RBAC)
- Stateless session management
- CSRF protection disabled (JWT in headers)

## 🎯 Next Steps

- [ ] JWT Filter & Authorization
- [ ] Input Validation & Error Handling
- [ ] API Documentation (Swagger)
- [ ] Frontend Development (React)
- [ ] Deployment

## 👨‍💻 Author

**Bushra**
- GitHub: [@BushraNazish](https://github.com/BushraNazish)

## 📄 License

This project is private and not licensed for public use.

---

**Status:** 🚧 In Active Development
**Last Updated:** November 29, 2025
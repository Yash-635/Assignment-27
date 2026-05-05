# MERN CRUD Application with MongoDB Relationships

A full-stack application demonstrating **One-to-Many** and **Many-to-Many** relationships in MongoDB using Docker multi-container orchestration.

## 🏗️ Architecture

This project uses a **multi-container Docker** setup with:

```
┌─────────────────────────────────────────────┐
│         Docker Network (bridge)             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌──────────────┐       │
│  │   Frontend   │  │   Backend    │       │
│  │ (React+Vite)│  │(Node+Express)│       │
│  │  Port 5173   │  │  Port 5000   │       │
│  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                │
│         └─────────┬───────┘                │
│                   │                        │
│            ┌──────▼─────────┐             │
│            │   MongoDB      │             │
│            │   Port 27017   │             │
│            │   Volume: db   │             │
│            └────────────────┘             │
│                                             │
└─────────────────────────────────────────────┘
```

## 📦 Containers

### 1. **MongoDB (mongo:7)**
- **Purpose**: Document database
- **Port**: 27017
- **Database**: `demoDB`
- **Volume**: `mongo_data` (persistent storage)
- **Health Check**: MongoDB ping every 10s

### 2. **Backend (Node.js + Express)**
- **Purpose**: REST API server
- **Port**: 5000
- **Routes**:
  - `/users` - User CRUD operations
  - `/students` - Student CRUD operations
  - `/students/courses` - Course management
  - `/students/enroll` - Student enrollment
- **Health Check**: HTTP GET to `/users` every 10s
- **Dependencies**: Requires MongoDB to be healthy

### 3. **Frontend (React + Vite)**
- **Purpose**: Web UI
- **Port**: 5173
- **Features**: Complete CRUD UI with real-time updates
- **Dependencies**: Requires Backend to be healthy

## 🗄️ Database Relationships

### One-to-Many: Users → Posts
```
User (1) ──── (Many) Posts
- One user can have multiple posts
- Each post belongs to exactly one user
- Delete user → automatically deletes all posts
```

### Many-to-Many: Students ↔ Courses
```
Students (Many) ──── (Many) Courses
- Many students can enroll in many courses
- Many courses can have many students
- Bidirectional references via arrays
```

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Running with Docker Compose

```bash
# Build and start all containers
docker-compose up --build

# Or run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Remove containers and volumes
docker-compose down -v
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017/demoDB

## 📝 API Endpoints

### Users (One-to-Many with Posts)

```bash
# GET all users with posts
GET /users

# GET single user
GET /users/:userId

# CREATE user
POST /users
Body: { "name": "John Doe" }

# UPDATE user
PUT /users/:userId
Body: { "name": "Jane Doe" }

# DELETE user and all posts
DELETE /users/:userId

# CREATE post for user
POST /users/:userId/posts
Body: { "title": "My First Post" }

# UPDATE post
PUT /users/:userId/posts/:postId
Body: { "title": "Updated Post" }

# DELETE post
DELETE /users/:userId/posts/:postId
```

### Students & Courses (Many-to-Many)

```bash
# GET all students with courses
GET /students

# GET single student
GET /students/:studentId

# CREATE student
POST /students/student
Body: { "name": "Alice" }

# UPDATE student
PUT /students/:studentId
Body: { "name": "Alice Smith" }

# DELETE student
DELETE /students/:studentId

# CREATE course
POST /students/course
Body: { "title": "React Basics" }

# GET all courses
GET /students/courses

# UPDATE course
PUT /students/courses/:courseId
Body: { "title": "Advanced React" }

# DELETE course
DELETE /students/courses/:courseId

# ENROLL student in course
POST /students/enroll
Body: { "studentId": "...", "courseId": "..." }

# UNENROLL student from course
DELETE /students/:studentId/courses/:courseId
```

## 🎯 Key Features

✅ **Full CRUD Operations**
- Create, Read, Update, Delete for users, posts, students, and courses

✅ **MongoDB Relationships**
- One-to-Many: User → Posts
- Many-to-Many: Students ↔ Courses

✅ **Docker Multi-Container**
- Orchestrated services with docker-compose
- Health checks for all containers
- Networking and volume management
- Automatic service dependency management

✅ **React Frontend**
- Modern UI with real-time updates
- Form validation
- Edit/Delete functionality
- Responsive design

✅ **Production Ready**
- Error handling
- Health checks
- Restart policies
- Volume persistence

## 🛠️ Technology Stack

**Frontend**
- React 19.1.0
- Vite 6.3.5
- Axios 1.15.0

**Backend**
- Node.js 20 (Alpine)
- Express 5.2.1
- Mongoose 8.23.0
- CORS 2.8.6

**Database**
- MongoDB 7

**DevOps**
- Docker & Docker Compose
- Multi-stage builds
- Health checks
- Named volumes

## 📊 Project Structure

```
.
├── docker-compose.yml          # Multi-container orchestration
├── backend/
│   ├── Dockerfile              # Backend container config
│   ├── .dockerignore           # Docker build optimization
│   ├── package.json
│   ├── server.js               # Express server
│   ├── models/
│   │   ├── User.js             # User schema (One-to-Many)
│   │   ├── Post.js             # Post schema
│   │   ├── Student.js          # Student schema (Many-to-Many)
│   │   └── Course.js           # Course schema
│   └── routes/
│       ├── userRoutes.js       # User & Post routes
│       └── studentRoutes.js    # Student & Course routes
└── frontend/
    ├── Dockerfile              # Frontend container config
    ├── .dockerignore           # Docker build optimization
    ├── package.json
    ├── src/
    │   ├── App.jsx             # Main React component
    │   └── App.css             # Styling
    └── vite.config.js
```

## 🧪 Testing

### Manual Testing Steps

1. **Create Users**
   - Use frontend UI to add users
   - Verify in MongoDB

2. **Create Posts**
   - Select a user and add posts
   - Confirm One-to-Many relationship

3. **Create Students & Courses**
   - Add students and courses
   - Enroll students in courses

4. **Verify Many-to-Many**
   - Check that a student can have multiple courses
   - Check that a course can have multiple students

5. **Test CRUD Operations**
   - Update user/student names
   - Delete posts/courses
   - Verify cascading deletes

## 📋 Troubleshooting

**Containers won't start:**
```bash
# Check logs
docker-compose logs mongo
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down -v
docker-compose up --build
```

**MongoDB connection error:**
```bash
# Ensure MongoDB is running and healthy
docker-compose ps
docker-compose logs mongo
```

**Frontend can't connect to backend:**
- Check backend is running: http://localhost:5000/users
- Verify API_URL in frontend code
- Check docker network: docker network ls

**Port already in use:**
```bash
# Change ports in docker-compose.yml
# Or free up the ports:
lsof -ti:5173 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

## 📚 Learning Outcomes

This project demonstrates:

✨ Docker multi-container orchestration
✨ MongoDB document relationships (1:N and M:N)
✨ Express.js REST API design
✨ React hooks and state management
✨ Full-stack application architecture
✨ Data validation and error handling
✨ Cascading operations (delete user → delete posts)
✨ Health checks and service dependencies

---

**University Assignment 27** - MERN Stack with MongoDB Relationships
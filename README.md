# Social Media Application

> A full-stack social media web application where users can create accounts, share posts, like posts, comment on posts, manage their profile, and reset their password via email.

---

## Overview

This project is a **Full-Stack Social Media Application** built using **React, Node.js, Express, and MongoDB**.

The application allows users to:

- Register and log in
- Create and manage posts
- Like and comment on posts
- Upload a profile avatar
- Reset their password via email

The project follows a **RESTful architecture** with a clear separation between frontend and backend.

---

## Tech Stack

### Frontend

- React
- React Router
- Context API
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt (password hashing)
- Multer (file uploads)
- Nodemailer (email system)

---

## Main Features

### User System

- User registration
- User login / logout
- JWT authentication
- Protected routes

### Posts

- Create, edit and delete posts
- Upload post image
- View feed with pagination

### Likes

- Like / unlike posts
- Like counter

### Comments

- Add comments to posts
- View comments
- Delete own comments

### Profile

- User profile page
- Upload profile avatar
- View user posts

### Password Recovery

- Forgot password
- Email reset link
- Token-based password reset
- Token expiration for security

---

## Authentication & Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes using middleware
- Reset password tokens with expiration
- Only post owners can edit or delete posts

---

## Database Structure

The application uses **MongoDB** with the following collections:

- Users
- Posts
- Comments
- PostLikes
- Tokens (for password reset)

### Relationships

- One User → Many Posts
- One Post → Many Comments
- One Post → Many Likes
- One User → Many Comments

---

## Main API Endpoints

### Auth Routes

```
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password/:token
```

### Post Routes

```
GET    /posts
POST   /posts
PATCH  /posts/:id
DELETE /posts/:id
POST   /posts/:id/like
```

### Comment Routes

```
GET    /comments/:postId
POST   /comments/:postId
DELETE /comments/:id
```

---

## Project Structure

### Backend

```
backend/
 ├── models
 ├── routes
 ├── middleware
 ├── util
 ├── templates
 └── index.js
```

### Frontend

```
frontend/
 ├── components
 ├── pages
 ├── context
 ├── services
 └── App.js
```

---

## Setup & Installation

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/albenisahamidi/social-media-app.git
cd social-media-app
```

### 2. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 3. Environment variables

Create a `.env` file inside the **backend** folder:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/socialmedia_app
JWT_SECRET=your_secret_key

SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

FRONTEND_URL=http://localhost:3000
```

### 4. Run the application

Start the backend (runs on `http://localhost:5001`):

```bash
cd backend
npm run dev
```

Start the frontend (runs on `http://localhost:3000`):

```bash
cd frontend
npm start
```

---

## What This Project Demonstrates

- Full-stack application development
- REST API design
- JWT authentication
- MongoDB database modeling
- Frontend-backend integration
- Secure password handling
- Email-based password recovery

---

## Author

**Albenisa Hamidi**
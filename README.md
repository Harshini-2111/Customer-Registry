# Customer Care Registry

A full-stack MERN application for logging, tracking, and resolving customer
complaints, with real-time chat between customers and support agents.

## Tech Stack
- **Frontend:** React (Vite), React Router, Axios, Socket.io-client
- **Backend:** Node.js, Express.js, Mongoose, Socket.io, JWT auth
- **Database:** MongoDB

## Features
- User registration/login (customer or support agent role) with JWT auth
- Customers can lodge complaints with category, priority, and description
- Customers can view their own complaint history and status
- Agents/admins have a dashboard to view all complaints, filter by status,
  and update complaint status
- Real-time chat thread per complaint (Socket.io) between customer and agent
- Centralized error handling and protected routes

## Project Structure
```
Customer-Care/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── api/         # Axios instance
│       ├── components/  # Navbar, ChatBox, ProtectedRoute
│       ├── context/      # AuthContext
│       └── pages/        # Home, Login, Register, Complaints, MyComplaints, AgentDashboard
└── server/          # Express backend
    ├── config/          # MongoDB connection
    ├── controllers/     # auth, complaint, message logic
    ├── middleware/       # auth (JWT), error handler
    ├── models/            # User, Complaint, Message (Mongoose schemas)
    └── routes/            # /api/auth, /api/complaints, /api/messages
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# edit .env and set MONGO_URI, JWT_SECRET, etc.
npm run dev
```
Server runs on `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Frontend runs on `http://localhost:5173`.

### 3. Using the App
1. Register a **Customer** account and a separate **Support Agent** account
   (use two different browsers/incognito windows, or logout/login).
2. As a customer, lodge a complaint from "Lodge Complaint".
3. As an agent, open "Agent Dashboard" to see all complaints, update status,
   and open a live chat with the customer.
4. Both sides can chat in real time via the "Open Chat" / "Chat with
   Customer" button on each complaint card.

## API Overview

| Method | Endpoint                  | Description                          | Auth        |
|--------|----------------------------|---------------------------------------|-------------|
| POST   | /api/auth/register          | Register a new user                   | Public      |
| POST   | /api/auth/login              | Login and receive JWT                 | Public      |
| GET    | /api/auth/me                  | Get current user profile              | Required    |
| POST   | /api/complaints                | Create a new complaint                | User        |
| GET    | /api/complaints/my              | Get logged-in user's complaints       | User        |
| GET    | /api/complaints                  | Get all complaints                    | Agent/Admin |
| GET    | /api/complaints/:id                | Get single complaint                  | Owner/Staff |
| PUT    | /api/complaints/:id                  | Update complaint status/priority      | Agent/Admin |
| DELETE | /api/complaints/:id                    | Delete a complaint                    | Owner/Staff |
| GET    | /api/messages/:complaintId               | Get chat messages for a complaint     | Owner/Staff |
| POST   | /api/messages/:complaintId                 | Send a chat message                   | Owner/Staff |

## Notes
- Passwords are hashed with bcrypt before storage.
- JWT tokens are stored in `localStorage` on the client and attached to each
  API request via an Axios interceptor.
- Real-time chat uses Socket.io rooms keyed by complaint ID.

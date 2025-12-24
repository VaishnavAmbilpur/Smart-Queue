🏥 Problem Statement & Solution Overview

In many hospitals and clinics, patients face long waiting times, uncertainty about their turn, frequent crowding at reception, and a lack of transparency in the consultation process. Receptionists struggle to manage queues manually, doctors have no real‑time control over patient flow, and patients remain unaware of their exact position in line. This leads to frustration, inefficiency, and poor experience for both patients and healthcare staff.

💡 Our Solution

This Smart Hospital Queue Management System digitizes and streamlines the entire queue process. The reception team can easily register patients and automatically generate a unique live‑tracking link for each patient. Patients can monitor their real‑time status, position in the queue, and estimated waiting time from their phones—reducing anxiety and crowding.

Doctors get a dedicated dashboard to control availability, manage consultation time, pause queues, and mark patients as completed or cancelled. The system also supports reordering of top priority patients and maintains a secure history log with filters for tracking past records.

👥 Intended Users

    Patients – to track live queue status and reduce waiting frustration

    Reception Staff – to manage entries efficiently without manual effort

    Doctors / Healthcare Providers – to control workflow and improve consultation management

This system ultimately enhances transparency, efficiency, and trust in hospital queue management.


# Smart Queue

Smart Queue is a full-stack web application that digitizes and simplifies queue management for real-world use cases such as clinics, service centers, offices, and counters.

Users can take and track queue numbers through a clean frontend interface, while the backend manages queue state, validations, and real-time updates.

---

## 🚀 Features

- Digital queue ticket generation
- Real-time queue status tracking
- Backend-driven queue management
- Modular backend architecture
- Modern frontend built with Vite
- Designed for scalability and real-world usage

---

## 📁 Project Structure

```

Smart-Queue/
├── backend/
│   ├── config/         # App & environment configuration
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── socket/         # WebSocket logic
│   ├── utils/          # Utility functions
│   ├── validators/    # Request validation logic
│   ├── .env            # Environment variables
│   ├── server.js       # Backend entry point
│   └── package.json
│
├── frontend/
│   └── vite-project/
│       ├── public/     # Static assets
│       ├── src/        # Frontend source code
│       ├── index.html
│       ├── vite.config.js
│       ├── vercel.json
│       └── package.json
│
└── README.md

````

---

## 🛠️ Setup Instructions

### 🔹 Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Git

---

### 🔧 Backend Setup

```bash
cd backend
npm install
````

Create a `.env` file in the `backend` folder and configure required environment variables.

Start the backend server:

```bash
npm start
```

The backend will run on the configured port (default: `http://localhost:5000`).
Change the Cors in server.js the origin to the url of frontend localhost
since it is connected to Deployed Website (Using Vercel)

---

### 🎨 Frontend Setup

```bash
cd frontend/vite-project
npm install
npm run dev
```
change the base url in services of app.js and socket.js
to the backend local route 

Open the URL shown in the terminal to access the frontend application.

---

## 🔁 How the System Works

1. Users access the frontend and request a queue ticket.
2. Requests are sent to the backend via REST APIs.
3. Backend manages queue state and validations.
4. Queue updates are reflected in real time using sockets.
5. Staff/admin actions advance or modify the queue.

---

## 🧠 Tech Stack

### Frontend

* JavaScript
* Vite
* HTML5
* Tailwind CSS

### Backend

* Node.js
* Express.js
* Socket.io ( Websocket )
* REST APIs

### Tools & Others

* Git & GitHub
* Vercel (Frontend deployment)
* Environment-based configuration
* Render (Backend deployment)

---

## 👨‍💻 Team — The Debuggers

A team of developers building practical, full-stack applications with a focus on clean code, scalability, and real-world use cases.

| Name                            | Role                             |
| ------------------------------- | -------------------------------- |
| 🧑‍💻 **Vaishnav Ambilpur**     | Full Stack Developer / Team Lead |
| 👨‍💻 **Nadam Eshwanth Raj**    | Full Stack Developer             |
| 👨‍💻 **Vishnu Vardhan Vemula** | Full Stack Developer             |
| 👨‍💻 **Aadithya Motapalukula** | Full Stack Developer             |

---

## 🔮 Future Enhancements

* Authentication for admins/staff
* Notifications for users
* Queue analytics and wait-time estimation
* Improved mobile experience

---

## 📜 License

This project is open-source and intended for learning and development purposes.

```



# 📝 Daily Todo - Task Management Made Simple

## 📌 Introduction

Daily Todo is a simple and efficient task management application that allows users to add, update, delete, and reorder their daily tasks using a drag-and-drop feature. With an intuitive interface, users can easily manage their to-do list, ensuring better productivity and organization. The app provides a seamless experience for tracking and updating tasks in real-time, helping users stay on top of their daily goals.

---

## 📖 Table of Contents

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Installation](#-installation)
- [Dependencies](#-dependencies)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🚀 Live Demo

🔗 [Live Application](#) _(Replace with the actual deployed link)_

---

## ✨ Features

- ✅ Add, update, and delete tasks effortlessly.
- 🔄 Drag-and-drop feature to reorder tasks.
- 🔥 Real-time task updates with Socket.io.
- 🎨 Beautiful and responsive UI using TailwindCSS.
- 📅 Date selection using React Datepicker.
- 🚀 Optimized performance with React Query.
- 🔔 Notifications with React Hot Toast.
- 🔒 Secure API communication using Express and MongoDB.

---

## 🛠 Technologies Used

### **Frontend:**
- [React](https://react.dev/) (v19.0.0)
- [React Router](https://reactrouter.com/) (v7.2.0)
- [TailwindCSS](https://tailwindcss.com/) (v4.0.7)
- [React Icons](https://react-icons.github.io/react-icons/)
- [React Datepicker](https://reactdatepicker.com/) (v8.1.0)
- [SweetAlert2](https://sweetalert2.github.io/) (v11.17.2)
- [Axios](https://axios-http.com/) (v1.7.9)

### **Backend:**
- [Express](https://expressjs.com/) (v4.21.2)
- [MongoDB](https://www.mongodb.com/) (v6.13.0)
- [Socket.io](https://socket.io/) (v4.8.1)
- [CORS](https://www.npmjs.com/package/cors) (v2.8.5)
- [Dotenv](https://www.npmjs.com/package/dotenv) (v16.4.7)

---

## 📥 Installation

Follow these steps to set up and run the project locally.

### **Prerequisites**
Make sure you have installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MongoDB](https://www.mongodb.com/) (for backend)
- A package manager: `npm` or `yarn`

### **Clone the repository**
```sh
git clone https://github.com/abdulHasib2030/daily-todo.git
cd daily-todo

```
### Install dependencies
```sh
# Install frontend dependencies
cd todo-client-side
npm install

# Install backend dependencies
cd ../todo-server-side
npm install
```
### Run the application
```sh
# Start the frontend
cd todo-client-side
npm run dev

# Start the backend
cd ../todo-server-side
node index.js
```
## 📦 Dependencies
### Frontend Dependencies
```sh
"@dnd-kit/core": "^6.3.1",
"@dnd-kit/sortable": "^10.0.0",
"@dnd-kit/utilities": "^3.2.2",
"@tailwindcss/vite": "^4.0.7",
"@tanstack/react-query": "^5.66.8",
"axios": "^1.7.9",
"date-fns": "^4.1.0",
"firebase": "^11.3.1",
"flowbite-react": "^0.10.2",
"localforage": "^1.10.0",
"match-sorter": "^8.0.0",
"react": "^19.0.0",
"react-datepicker": "^8.1.0",
"react-dom": "^19.0.0",
"react-hot-toast": "^2.5.2",
"react-icons": "^5.5.0",
"react-router-dom": "^7.2.0",
"socket.io-client": "^4.8.1",
"sort-by": "^1.2.0",
"sweetalert2": "^11.17.2",
"tailwindcss": "^4.0.7"
```
### Backend Dependencies
```sh
"cors": "^2.8.5",
"dotenv": "^16.4.7",
"express": "^4.21.2",
"mongodb": "^6.13.0",
"socket.io": "^4.8.1"
```
## 🎯 Usage
* Open the application.
* Add tasks to your list.
* Drag and drop to reorder tasks.
* Click on a task to edit or delete it.

## ⚙️ Configuration
-   Environment Variables
    Create a .env file in the server/ directory and add:
```sh
DB_PASS=Your_MongoDB_Password
DB_NAME=Your_MongoDB_Database_Name
```
## 🛠 Troubleshooting
- If the backend doesn't start, ensure MongoDB is running.
- If styles are not applied, restart the frontend development server.
- If API calls fail, check CORS policies and backend logs.


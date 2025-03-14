# Todo App with Firebase Authentication

A React-based Todo application with user authentication, profile management, and real-time todo list updates.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A Firebase account

## Setup Instructions

1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies

```bash
npm install
```

3. Create a Firebase Project

   - Go to Firebase Console
   - Create a new project
   - Enable Authentication with Email/Password
   - Create a Firestore Database
   - Create a Storage bucket

4. Set up Firebase Configuration
   - In your Firebase project settings, find your web app configuration
   - Create a .env file in the project root directory
   - Add your Firebase configuration:

```plaintext
VITE_APP_FIREBASE_API_KEY=your_api_key
VITE_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_APP_FIREBASE_PROJECT_ID=your_project_id
VITE_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_FIREBASE_APP_ID=your_app_id
```

5. Set up Firebase Security Rules
   Firestore Rules:

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /todos/{todoId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId ||
                        request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

Storage Rules:

```plaintext
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profilePics/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Start the development server

```bash
npm run dev
```

The application should now be running on http://localhost:5173

## Features

- User Authentication (Sign up/Sign in)
- Profile Management
  - Update profile picture
  - Update name
- Todo List
  - Add todos
  - Edit todos
  - Mark todos as complete
  - Delete todos

## Project Structure

- /src
  - /components
    - /todos - Todo list related components
    - Account.jsx - Profile management
    - Login.jsx - User login
    - Signup.jsx - User registration
    - Navbar.jsx - Navigation component
  - firebase.js - Firebase configuration
  - App.jsx - Main application component

## Technologies Used

- React
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Tailwind CSS

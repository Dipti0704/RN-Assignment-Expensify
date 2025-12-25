# Expensify - Smart Expense Tracking Application

A modern, full-stack expense tracking mobile application built with React Native (Expo) for the frontend and Node.js with Express for the backend. Track daily expenses, analyze spending patterns, and manage budgets effectively. 

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Authentication & Security
- User registration with email and password
- Secure login with JWT token authentication
- Password hashing using bcryptjs
- Token-based session management
- Auto-login with AsyncStorage
- Change password functionality
- Secure logout

### Expense Management
- Add new expenses with amount, category, and payment method
- Delete expenses with confirmation
- Real-time expense tracking
- Multiple categories (Food, Transport, Shopping, Entertainment, Bills, Health, Education, Other)
- Multiple payment methods (Cash, Credit Card, Debit Card, UPI, Net Banking, Other)
- Description field for expense notes
- Date and time tracking

### Analytics & Statistics
- Monthly spending overview
- Daily spending tracker
- Category-wise expense breakdown
- Visual bar charts for spending analysis
- Percentage-based category distribution
- Transaction count per category
- Spending insights and trends
- Period selector (Day, Week, Month, Year)



---

## Tech Stack

### Frontend Technologies
- **React Native** (v0.81.5) - Mobile application framework
- **Expo** (SDK 54) - Development and build platform
- **TypeScript** - Type-safe JavaScript
- **Expo Router** (v6.0) - File-based navigation
- **Context API** - State management
- **AsyncStorage** - Local data persistence
- **Ionicons** - Icon library
- **React Hooks** - useState, useEffect, useCallback, useFocusEffect

### Backend Technologies
- **Node.js** (v16+) - JavaScript runtime
- **Express.js** (v4.18+) - Web application framework
- **MongoDB** (v6.0+) - NoSQL database
- **Mongoose** (v7.0+) - MongoDB ODM
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

---

## Project Structure

### Complete Folder Structure

```
expensify-project/
│
├── backend/                              # Backend server
│   ├── config/
│   │   └── db.js                         # MongoDB connection configuration
│   │
│   ├── middleware/
│   │   └── auth.js                       # JWT authentication middleware
│   │
│   ├── models/
│   │   ├── User.js                       # User schema and model
│   │   └── Expense.js                    # Expense schema and model
│   │
│   ├── routes/
│   │   ├── auth.js                       # Authentication routes
│   │   └── expenses.js                   # Expense CRUD and stats routes
│   │
│   ├── .env                              # Environment variables
│   ├── server.js                         # Main server file
│   ├── package.json                      # Backend dependencies
│   └── package-lock.json
│
├── expensifyfrontend/                    # Frontend mobile app
│   ├── app/                              # Application screens
│   │   ├── (auth)/                       # Authentication flow
│   │   │   ├── login.tsx                 # Login screen
│   │   │   ├── signup.tsx                # Registration screen
│   │   │   ├── splash.tsx                # Splash screen with animations
│   │   │   └── _layout.tsx               # Auth layout wrapper
│   │   │
│   │   ├── (tabs)/                       # Main tab navigation
│   │   │   ├── index.tsx                 # Home dashboard
│   │   │   ├── expenses.tsx              # Expenses list with filters
│   │   │   ├── add.tsx                   # Add expense form
│   │   │   ├── stats.tsx                 # Statistics and charts
│   │   │   ├── profile.tsx               # User profile and settings
│   │   │   └── _layout.tsx               # Tab navigation layout
│   │   │
│   │   ├── _layout.tsx                   # Root layout with AuthProvider
│   │   └── index.tsx                     # App entry point
│   │
│   ├── constants/
│   │   ├── theme.ts                      # Colors, spacing, fonts, shadows
│   │   └── categories.ts                 # Expense categories and payment methods
│   │
│   ├── context/
│   │   └── AuthContext.tsx               # Authentication state management
│   │
│   ├── services/
│   │   └── api.ts                        # API service layer with all endpoints
│   │
│   ├── assets/                           # Images, icons, and fonts
│   │   ├── icon.png
│   │   ├── splash.png
│   │   └── adaptive-icon.png
│   │
│   ├── app.json                          # Expo configuration
│   ├── package.json                      # Frontend dependencies
│   ├── tsconfig.json                     # TypeScript configuration
│   ├── babel.config.js                   # Babel configuration
│   └── package-lock.json
│
└── README.md                             # Project documentation
```

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **MongoDB** (v6.0 or higher)
  - Local installation OR
  - MongoDB Atlas cloud account
- **Git** (v2.30.0 or higher)
- **Expo Go** mobile app (for testing)
  - Download from App Store (iOS)
  - Download from Play Store (Android)


---

## Installation & Setup

### Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd backend
```

#### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv

#### Step 3: Create Environment File
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000

# For MongoDB Atlas (Cloud):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expensify

# JWT Configuration
JWT_SECRET=your_very_secret_jwt_key_here_change_in_production


```


#### Step 4: Start Backend Server
```bash
node server.js
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

---

### Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd expensifyfrontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- expo
- expo-router
- react-native
- @react-native-async-storage/async-storage
- @expo/vector-icons
- react
- typescript

#### Step 3: Configure API URL

Open `services/api.ts` and update the API URL:

```typescript
// Find your computer's IP address:
// Windows: Open CMD and type: ipconfig
// Mac: Open Terminal and type: ifconfig
// Linux: Open Terminal and type: ip addr show

// Look for IPv4 Address (e.g., 192.168.1.5)

const API_URL = 'http://YOUR_IP_ADDRESS:5000/api';

// Example:
// const API_URL = 'http://192.168.1.5:5000/api';
```

**Important Notes:**
- Replace `YOUR_IP_ADDRESS` with your actual local IP
- Do NOT use `localhost` or `127.0.0.1` (won't work on mobile)
- Your phone and computer must be on the same Wi-Fi network

#### Step 4: Start Expo Development Server
```bash
npm start
# or
npx expo start
```

#### Step 5: Run on Mobile Device

**Option 1: Using Expo Go (Recommended)**
1. Install **Expo Go** app on your mobile device
2. Scan the QR code shown in terminal
   - **Android**: Use Expo Go app
3. App will load on your device


---

## Environment Configuration

### Backend Environment Variables

#### Required Variables
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expensify
JWT_SECRET=your_secret_key
```

#### MongoDB Connection Strings


**MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expensify?retryWrites=true&w=majority
```



#### JWT Secret Generation
Generate a secure JWT secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

```

### Frontend Configuration

Update `services/api.ts`:
```typescript
const API_URL = 'http://YOUR_LOCAL_IP:5000/api';
```

---

## Running the Application

### Development Mode

#### Terminal 1 - Backend
```bash
cd backend
node server.js
```

#### Terminal 2 - Frontend
```bash
cd expensifyfrontend
npx expo start
```

### Production Mode

#### Backend
```bash
cd backend
NODE_ENV=production node server.js
```

#### Frontend
```bash
cd expensifyfrontend
npx expo start --no-dev --minify
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

## Frontend Architecture

### State Management
- **Context API** for global auth state
- **Local State** (useState) for component-specific data
- **AsyncStorage** for persistent token storage

### Navigation Structure
```
App Entry (index.tsx)
├── Auth Flow (if not authenticated)
│   ├── Splash Screen
│   ├── Login Screen
│   └── Sign Up Screen
└── Main App (if authenticated)
    └── Tab Navigation
        ├── Home Dashboard
        ├── Expenses List
        ├── Add Expense
        ├── Statistics
        └── Profile
```

### Component Patterns
- Functional components with Hooks
- TypeScript for type safety
- Custom hooks (useAuth)
- Reusable utility functions
- Modular styling with StyleSheet

---

## Backend Architecture

### Server Structure
```
Express Server
├── Middleware
│   ├── CORS
│   ├── JSON Parser
│   └── Auth Middleware (JWT)
├── Routes
│   ├── Auth Routes
│   └── Expense Routes
└── Database Connection
```

### Authentication Flow
1. User registers/logs in
2. Server validates credentials
3. Server generates JWT token
4. Token sent to client
5. Client stores token in AsyncStorage
6. Token sent in Authorization header for protected routes
7. Server verifies token using middleware





### Technologies Used
- React Native team for mobile framework
- Expo team for development platform
- MongoDB team for database
- Express.js team for backend framework
- Ionic team for Ionicons
- All open-source contributors

### Inspiration
- Modern expense tracking applications
- Personal finance management needs
- Clean UI/UX 
- Mobile-first approach

---
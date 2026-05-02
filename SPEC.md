# Online Examination System - Specification Document

## 1. Project Overview

**Project Name:** Online Examination System
**Type:** Full-stack Web Application
**Core Functionality:** A secure online examination platform allowing admins to create exams and students to take timed tests with immediate results
**Target Users:** Educational institutions, training centers, certification bodies

## 2. Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **CORS:** cors middleware

### Frontend
- **Framework:** React.js 18
- **Routing:** react-router-dom v6
- **HTTP Client:** axios
- **State Management:** React Context API
- **Styling:** Custom CSS with CSS Variables
- **Icons:** Lucide React

### Project Structure
```
OnlineExamSystem/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── examController.js
│   │   ├── questionController.js
│   │   └── resultController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Exam.js
│   │   ├── Question.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── examRoutes.js
│   │   ├── questionRoutes.js
│   │   └── resultRoutes.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ExamCard.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   └── Chart.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudentExams.jsx
│   │   │   ├── ExamStart.jsx
│   │   │   ├── ExamPage.jsx
│   │   │   ├── ExamResult.jsx
│   │   │   ├── AdminExams.jsx
│   │   │   ├── CreateExam.jsx
│   │   │   ├── EditExam.jsx
│   │   │   ├── ManageQuestions.jsx
│   │   │   ├── AllResults.jsx
│   │   │   └── Analytics.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── index.jsx
│   ├── package.json
│   └── README.md
│
└── README.md
```

## 3. UI/UX Specification

### Color Palette
- **Primary:** #2563EB (Royal Blue)
- **Primary Dark:** #1D4ED8
- **Primary Light:** #3B82F6
- **Secondary:** #10B981 (Emerald Green)
- **Accent:** #F59E0B (Amber)
- **Danger:** #EF4444 (Red)
- **Background:** #F8FAFC (Light Gray)
- **Surface:** #FFFFFF
- **Text Primary:** #1E293B (Slate 800)
- **Text Secondary:** #64748B (Slate 500)
- **Border:** #E2E8F0 (Slate 200)
- **Dark Background:** #0F172A (Slate 900)

### Typography
- **Font Family:** 'Inter', 'Segoe UI', system-ui, sans-serif
- **Heading 1:** 2.5rem (40px), weight 700
- **Heading 2:** 2rem (32px), weight 600
- **Heading 3:** 1.5rem (24px), weight 600
- **Heading 4:** 1.25rem (20px), weight 500
- **Body:** 1rem (16px), weight 400
- **Small:** 0.875rem (14px), weight 400
- **Caption:** 0.75rem (12px), weight 400

### Spacing System
- **xs:** 0.25rem (4px)
- **sm:** 0.5rem (8px)
- **md:** 1rem (16px)
- **lg:** 1.5rem (24px)
- **xl:** 2rem (32px)
- **2xl:** 3rem (48px)

### Responsive Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Components

#### Buttons
- **Primary Button:** Blue background (#2563EB), white text, rounded-md, padding 10px 20px
- **Secondary Button:** White background, blue border, blue text
- **Danger Button:** Red background (#EF4444), white text
- **Ghost Button:** Transparent background, gray text
- **States:** Hover (darken 10%), Active (scale 0.98), Disabled (opacity 0.5)

#### Input Fields
- **Default:** White background, slate-200 border, rounded-md, padding 12px 16px
- **Focus:** Blue border (#2563EB), subtle blue shadow
- **Error:** Red border (#EF4444), red text below

#### Cards
- **Background:** White
- **Border:** 1px solid #E2E8F0
- **Border Radius:** 12px
- **Shadow:** 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- **Padding:** 24px

#### Navigation Bar
- **Height:** 64px
- **Background:** White
- **Border Bottom:** 1px solid #E2E8F0
- **Logo:** Left aligned, font-weight bold, blue text

#### Sidebar (Admin)
- **Width:** 256px
- **Background:** #0F172A (Dark)
- **Items:** White text, hover highlight

### Animations
- **Transition Duration:** 200ms ease-in-out
- **Page Transitions:** Fade in (300ms)
- **Loading:** Pulse animation
- **Button Hover:** Transform scale(1.02)
- **Card Hover:** TranslateY(-4px), shadow increase

## 4. Functionality Specification

### Authentication System

#### User Registration
- Fields: Name, Email, Password, Confirm Password
- Validation:
  - Name: Required, min 2 characters
  - Email: Required, valid email format, unique
  - Password: Required, min 6 characters
  - Confirm Password: Must match password
- Role selection: Student (default) or Admin
- Returns: JWT token and user data

#### User Login
- Fields: Email, Password
- Validation: Email and password required
- Returns: JWT token and user data
- Token expiry: 7 days

#### JWT Middleware
- Validates token in Authorization header
- Extracts user ID from token
- Attaches user to request object
- Returns 401 if invalid

### Student Features

#### View Available Exams
- Lists all active exams
- Shows: Title, Duration, Total Questions, Status
- Filters: Not attempted, Attempted
- Sort by: Date, Title

#### Start Exam
- Validates exam exists and is active
- Checks not already attempted
- Randomizes question order
- Starts timer
- Prevents multiple tabs (warning)

#### Exam Taking
- One question at a time or all questions view
- Navigation: Previous, Next, Mark for Review
- Timer: Countdown display
- Auto-submit on timer end
- Copy/Paste disabled (anti-cheat)
- Tab switch warning

#### Submit Exam
- Manual submit button
- Confirmation dialog
- Auto-submit when time ends
- Calculates score immediately
- Stores results in database

#### View Results
- Score display (percentage and marks)
- Time taken
- Correct/Incorrect breakdown
- Review all questions with answers

### Admin Features

#### Dashboard
- Total students count
- Total exams count
- Total results count
- Average score
- Recent activity

#### Manage Exams
- Create exam: Title, Description, Duration, Total Marks
- Edit exam: All fields
- Delete exam: With confirmation
- Activate/Deactivate exam

#### Manage Questions
- Add question: Question text, 4 options, correct answer
- Edit question
- Delete question
- Bulk import (optional)

#### View All Results
- Filter by exam
- Filter by student
- Sort by date, score
- Export results (optional)

### Anti-Cheat Features
- Disable right-click context menu
- Disable copy/cut/paste
- Warn on tab switch
- Fullscreen option (optional)

### Timer System
- Countdown from exam duration
- Visual indicator (progress bar)
- Audio alert at 5 minutes (optional)
- Auto-submit at 0:00

## 5. Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required, min 2),
  email: String (required, unique, valid email),
  password: String (hashed, required),
  role: String (enum: ['student', 'admin'], default: 'student'),
  createdAt: Date,
  updatedAt: Date
}
```

### Exams Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  duration: Number (minutes, required),
  totalMarks: Number,
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Questions Collection
```javascript
{
  _id: ObjectId,
  examId: ObjectId (ref: Exam, required),
  question: String (required),
  options: [String] (4 items, required),
  correctAnswer: Number (0-3, index of correct option),
  marks: Number (default: 1),
  createdAt: Date,
  updatedAt: Date
}
```

### Results Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  examId: ObjectId (ref: Exam, required),
  score: Number,
  totalMarks: Number,
  answers: [{
    questionId: ObjectId,
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  timeTaken: Number (seconds),
  submittedAt: Date,
  createdAt: Date
}
```

## 6. API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Exam Routes
- `GET /api/exams` - Get all exams (admin)
- `GET /api/exams/student` - Get available exams (student)
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams` - Create exam (admin)
- `PUT /api/exams/:id` - Update exam (admin)
- `DELETE /api/exams/:id` - Delete exam (admin)

### Question Routes
- `GET /api/questions/:examId` - Get questions for exam
- `POST /api/questions` - Add question (admin)
- `PUT /api/questions/:id` - Update question (admin)
- `DELETE /api/questions/:id` - Delete question (admin)

### Result Routes
- `POST /api/results` - Submit exam result
- `GET /api/results/student` - Get student's results
- `GET /api/results/exam/:examId` - Get results for exam (admin)
- `GET /api/results/:id` - Get specific result
- `GET /api/results` - Get all results (admin)

### Analytics Routes
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/exam/:id` - Get exam analytics

## 7. Acceptance Criteria

### Authentication
- [ ] User can register with name, email, password
- [ ] User can login and receive JWT token
- [ ] Invalid credentials show error
- [ ] JWT protects private routes

### Student Flow
- [ ] Student sees list of available exams
- [ ] Student can start exam with timer
- [ ] Timer counts down and auto-submits
- [ ] Student can navigate between questions
- [ ] Student receives score after submission
- [ ] Student can review answers

### Admin Flow
- [ ] Admin can create new exam
- [ ] Admin can add questions to exam
- [ ] Admin can edit/delete exams and questions
- [ ] Admin can view all student results
- [ ] Dashboard shows analytics

### UI/UX
- [ ] Responsive on mobile and desktop
- [ ] Loading states displayed
- [ ] Toast notifications for actions
- [ ] Clean, consistent design

### Security
- [ ] Passwords hashed
- [ ] JWT tokens validated
- [ ] Anti-cheat measures work
- [ ] Admin routes protected


# 🚀 Genflow Task Management Application

A comprehensive full-stack task management system built with **Angular 20** and **Node.js/Express** that enables efficient project and sprint management with role-based access control. This application follows modern software architecture principles with a clean separation of concerns and modular design.

## 📖 About the Project

Genflow Task Management is an enterprise-level application designed to streamline project management workflows. It provides a robust platform for teams to organize, track, and manage tasks across different projects and sprints. The system supports three distinct user roles (Admin, Team Lead, and Team Member) with role-specific dashboards and functionalities.

### 🎯 Key Features

- **Role-Based Access Control**: Admin, Team Lead, and Team Member roles with specific permissions
- **Project & Sprint Management**: Create and manage projects with sprint-based task organization
- **Task Workflow**: Complete task lifecycle from creation to completion with status tracking
- **File Upload System**: Attach completion files and links to tasks
- **Responsive Design**: Mobile-first approach with responsive UI components
- **Real-time Updates**: Dynamic task status updates and notifications
- **User Management**: Comprehensive user creation and management system
- **Dashboard Analytics**: Role-specific dashboards with relevant metrics

## 🔄 Complete Application Workflow

### 1. **Authentication Flow**
```
Landing Page → Login → OTP Verification → Role-based Dashboard
     ↓
Forgot Password → OTP → Reset Password → Login
```

### 2. **Admin Workflow**
```
Admin Dashboard → User Management → Create Users/Teams → Project Management
      ↓
Create Projects → Assign Team Leads → Monitor Performance → Generate Reports
```

### 3. **Team Lead Workflow**
```
Lead Dashboard → Task Management → Create Tasks → Assign to Members
      ↓
Sprint Planning → Review Submissions → Accept/Reject Tasks → Track Progress
```

### 4. **Team Member Workflow**
```
Member Dashboard → View Assigned Tasks → Mark as Read → Work on Tasks
      ↓
Upload Completion Files → Move to Review → Receive Feedback → Complete Tasks
```

### 5. **Task Lifecycle**
```
To-Do → In-Progress → Review → Completed
  ↑         ↓          ↓        ↓
Created → Work Started → Submit for Review → Approved/Rejected
```

## 🏗️ Folder Structure

The project follows a **Domain-Driven Design (DDD)** architecture with clear separation between frontend and backend concerns.

### Why Domain-Based Architecture?

We chose this architecture for several key reasons:

1. **Scalability**: Each domain (auth, admin, lead, member) can be developed and scaled independently
2. **Maintainability**: Clear boundaries make it easier to locate and modify specific features
3. **Team Collaboration**: Different teams can work on different domains without conflicts
4. **Code Reusability**: Shared components and services are centralized in core modules
5. **Testing**: Domain isolation makes unit and integration testing more straightforward

```
📦 Genflow-Task-Management/
├── 🖥️ backend/                          # Node.js/Express API Server
│   ├── src/
│   │   ├── 🛡️ middleware/              # Authentication & Error Handling
│   │   │   ├── authMiddleware.js        # JWT Token Validation
│   │   │   └── errorMiddleware.js       # Global Error Handler
│   │   ├── 🗃️ models/                  # MongoDB Schemas
│   │   │   ├── User.js                  # User Schema with Role Management
│   │   │   ├── Project.js               # Project Schema
│   │   │   ├── Sprint.js                # Sprint Schema
│   │   │   ├── Task.js                  # Task Schema with File Uploads
│   │   │   ├── Team.js                  # Team Management Schema
│   │   │   └── Counter.js               # Auto-increment Counter Schema
│   │   ├── 🎯 controllers/             # Business Logic Layer
│   │   │   ├── userController.js        # User CRUD & Authentication
│   │   │   ├── adminController.js       # Admin-specific Operations
│   │   │   ├── leadController.js        # Team Lead Operations
│   │   │   ├── projectController.js     # Project Management
│   │   │   ├── sprintController.js      # Sprint Management
│   │   │   ├── taskController.js        # Task CRUD & File Handling
│   │   │   └── teamController.js        # Team Management
│   │   ├── 🛣️ routes/                   # API Route Definitions
│   │   │   ├── userRoutes.js            # User Authentication Routes
│   │   │   ├── adminRoutes.js           # Admin Panel Routes
│   │   │   ├── leadRoutes.js            # Team Lead Routes
│   │   │   ├── projectRoutes.js         # Project Management Routes
│   │   │   └── taskRoutes.js            # Task Management Routes
│   │   ├── ⚙️ config/                   # Configuration Files
│   │   │   └── db.js                    # MongoDB Connection Setup
│   │   ├── 🛠️ utils/                    # Utility Functions
│   │   │   └── seedData.js              # Database Seeding
│   │   └── 🚀 server.js                 # Express Server Entry Point
│   ├── 📁 uploads/                      # File Upload Storage
│   ├── 🔧 .env                          # Environment Variables
│   └── 📄 package.json                  # Backend Dependencies
│
├── 🌐 frontend/                         # Angular 20 Client Application
│   ├── src/
│   │   ├── 🏠 app/
│   │   │   ├── 🔐 auth/                 # Authentication Module
│   │   │   │   ├── login/               # Login Component
│   │   │   │   ├── signup/              # Registration Component
│   │   │   │   ├── forgot-password/     # Password Recovery
│   │   │   │   ├── otp-verification/    # OTP Validation
│   │   │   │   └── set-new-password/    # Password Reset
│   │   │   ├── 🏗️ core/                 # Core Application Services
│   │   │   │   ├── 🛡️ guard/           # Route Guards
│   │   │   │   │   ├── auth/            # Authentication Guard
│   │   │   │   │   └── role/            # Role-based Access Guard
│   │   │   │   └── 🔧 services/         # Shared Services
│   │   │   │       ├── auth/            # Authentication Service
│   │   │   │       ├── user/            # User Management Service
│   │   │   │       ├── task/            # Task Management Service
│   │   │   │       ├── project/         # Project Service
│   │   │   │       ├── team/            # Team Management Service
│   │   │   │       ├── toast/           # Notification Service
│   │   │   │       └── local-storage/   # Local Storage Service
│   │   │   ├── 📊 model/                # TypeScript Interfaces
│   │   │   │   └── user.model.ts        # User Type Definitions
│   │   │   ├── 📱 pages/                # Feature Modules
│   │   │   │   ├── 👤 admin/            # Admin Domain
│   │   │   │   │   ├── admin-dashboard/ # Admin Dashboard
│   │   │   │   │   ├── user-management/ # User CRUD Operations
│   │   │   │   │   ├── project-management/ # Project Administration
│   │   │   │   │   ├── performance-management/ # Analytics
│   │   │   │   │   ├── report-management/ # Report Generation
│   │   │   │   │   ├── content-management/ # Content Administration
│   │   │   │   │   ├── settings/        # Admin Settings
│   │   │   │   │   ├── help-center/     # Help Documentation
│   │   │   │   │   └── sidebar/         # Admin Navigation
│   │   │   │   ├── 👨‍💼 lead/             # Team Lead Domain
│   │   │   │   │   ├── dashboard/       # Lead Dashboard
│   │   │   │   │   ├── task-management/ # Task Assignment & Review
│   │   │   │   │   ├── create-task/     # Task Creation Interface
│   │   │   │   │   ├── backlogs/        # Sprint Backlog Management
│   │   │   │   │   ├── calendar/        # Calendar View
│   │   │   │   │   ├── lead-profile/    # Profile Management
│   │   │   │   │   ├── lead-settings/   # Lead Settings
│   │   │   │   │   └── sidebar/         # Lead Navigation
│   │   │   │   ├── 👥 member/           # Team Member Domain
│   │   │   │   │   ├── dashboard/       # Member Dashboard
│   │   │   │   │   ├── tasks/           # Task View & Management
│   │   │   │   │   ├── calendar/        # Personal Calendar
│   │   │   │   │   ├── reports/         # Personal Reports
│   │   │   │   │   ├── profile/         # Profile Management
│   │   │   │   │   ├── settings/        # Member Settings
│   │   │   │   │   └── sidebar/         # Member Navigation
│   │   │   │   ├── 🏠 home/             # Public Landing Page
│   │   │   │   │   ├── header/          # Site Header
│   │   │   │   │   ├── hero/            # Hero Section
│   │   │   │   │   ├── features/        # Feature Showcase
│   │   │   │   │   ├── about/           # About Section
│   │   │   │   │   ├── contact/         # Contact Information
│   │   │   │   │   ├── testimonials/    # User Testimonials
│   │   │   │   │   ├── impacts/         # Impact Statistics
│   │   │   │   │   ├── footer/          # Site Footer
│   │   │   │   │   └── back-to-top/     # Scroll to Top
│   │   │   │   └── 🔄 shared/           # Shared Components
│   │   │   │       ├── confirmation-dialog/ # Confirmation Modals
│   │   │   │       └── toast/           # Toast Notifications
│   │   │   ├── 🛣️ app.routes.ts         # Application Routing
│   │   │   ├── ⚙️ app.config.ts         # App Configuration
│   │   │   └── 🚀 app.ts               # Root Component
│   │   ├── 🌍 environments/             # Environment Configuration
│   │   │   ├── environment.ts           # Production Environment
│   │   │   └── environment.development.ts # Development Environment
│   │   └── 🖼️ public/                   # Static Assets
│   │       ├── assets/                  # Images & Resources
│   │       └── logo/                    # Application Logos
│   └── 📄 package.json                  # Frontend Dependencies
│
├── 📚 README.md                         # Project Documentation
└── 🚀 start-all-services.bat           # Quick Start Script
```

### 🏛️ Architecture Benefits

1. **Modular Design**: Each domain is self-contained with its own components, services, and routes
2. **Separation of Concerns**: Clear distinction between authentication, business logic, and presentation layers
3. **Scalable Structure**: Easy to add new features without affecting existing functionality
4. **Code Reusability**: Shared services and components reduce code duplication
5. **Maintainable Codebase**: Logical organization makes debugging and updates efficient

## 🔐 Demo Credentials

Use these credentials to explore different user roles:

### 👤 Admin Access
- **Email**: `admin@gnworx.ai`
- **Password**: `admin123`
- **Capabilities**: Full system access, user management, project creation, analytics

### 👨‍� Team Lead Access  
- **Email**: `mithiesofficial@gmail.com`
- **Password**: `@Mithies23`
- **Capabilities**: Task management, team oversight, sprint planning, task review

### 👥 Team Member Access
- **Email**: `hemadharshini@gmai.com`
- **Password**: `@Hema1511`
- **Capabilities**: Task execution, file uploads, status updates, personal dashboard

> 💡 **Note**: Additional users can be created through the Admin panel. Remember the credentials when creating new users for testing purposes.

## ⚙️ Setup Instructions

Follow these steps to run the project locally:

### 📋 Prerequisites

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **MongoDB**: Version 5.x or higher ([Download](https://www.mongodb.com/try/download/community))
- **Git**: Latest version ([Download](https://git-scm.com/downloads))
- **Angular CLI**: Latest version

### 🔧 Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/mithies-ponnusamy/Task-Management-Application.git
cd Task-Management-Application
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env  # Windows
# or
cp .env.example .env    # Linux/Mac

# Start MongoDB service (if not running)
# Windows: net start MongoDB
# Linux/Mac: sudo systemctl start mongod

# Start the backend server
node src/server.js
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup
```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Install Angular CLI globally (if not installed)
npm install -g @angular/cli

# Start the development server
ng serve

# Or use npm
npm start
```

The frontend will run on `http://localhost:4200`

#### 4. Quick Start (Alternative)
```bash
# Use the provided batch file (Windows only)
./start-all-services.bat
```

### 🔧 Environment Configuration

Create a `.env` file in the backend directory with:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/genflow-task-management
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

### 🗃️ Database Setup

The application will automatically create the required database and collections. For initial data seeding:

```bash
cd backend
node seed.js
```

### ✅ Verification

1. Visit `http://localhost:4200` for the frontend
2. API endpoints available at `http://localhost:5000/api`
3. Test login with provided demo credentials

## 🔮 Future Enhancements

### 🚀 Planned Features

1. **Real-time Collaboration**
   - WebSocket integration for live task updates
   - Real-time notifications and chat functionality
   - Collaborative task editing

2. **Advanced Analytics**
   - Task completion analytics and trends
   - Team performance metrics and insights
   - Custom report generation and scheduling

3. **Integration Capabilities**
   - Third-party tool integrations (Slack, Teams, Jira)
   - REST API expansion for external applications
   - Webhook support for external notifications

4. **Enhanced User Experience**
   - Progressive Web App (PWA) capabilities
   - Dark mode theme support
   - Advanced search and filtering options

5. **Security Enhancements**
   - Two-factor authentication (2FA)
   - OAuth integration (Google, Microsoft)
   - Advanced audit logging and compliance features

6. **Mobile Applications**
   - Native iOS and Android applications
   - Offline mode support
   - Push notifications

7. **Performance Optimizations**
   - Server-side rendering (SSR) enhancements
   - Caching strategies implementation
   - Database query optimizations

8. **DevOps & Deployment**
   - Docker containerization
   - CI/CD pipeline setup
   - Cloud deployment guides (AWS, Azure, GCP)

### 🔧 Technical Debt & Improvements

- Code splitting and lazy loading optimization
- Comprehensive test coverage (unit, integration, e2e)
- API documentation with Swagger/OpenAPI
- Performance monitoring and logging
- Accessibility (a11y) compliance

## 🛠️ Technology Stack

### Frontend
- **Framework**: Angular 20
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **HTTP Client**: Angular HTTP Client
- **State Management**: Angular Services
- **Routing**: Angular Router with Guards

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration

### Development Tools
- **Version Control**: Git
- **Code Editor**: VS Code (recommended)
- **Package Manager**: npm
- **Task Runner**: Angular CLI
- **Database GUI**: MongoDB Compass (optional)

## � Contact & Support

For questions, support, or collaboration opportunities:

### 👨‍💻 Project Maintainer
**Mithies Ponnusamy**
- 📧 **Email**: [mithiesofficial@gmail.com](mailto:mithiesofficial@gmail.com)
- 📱 **Phone**: +91 6383350764 | +91 6374624848
- 🐙 **GitHub**: [mithies-ponnusamy](https://github.com/mithies-ponnusamy)
- 🔗 **Repository**: [Task-Management-Application](https://github.com/mithies-ponnusamy/Task-Management-Application.git)

### 🤝 Contributing

We welcome contributions! Please feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation

### 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

<div align="center">

**⭐ Don't forget to star the repository if you find it helpful! ⭐**

Made with ❤️ by [Mithies Ponnusamy](https://github.com/mithies-ponnusamy)

</div>
# React + TypeScript + Vite

# Invoice Management Application

A modern, full-featured invoice management application built with React, TypeScript, and Firebase.

## 🚀 Features

- **User Authentication**: Secure login/signup with Firebase Auth
- **Invoice Management**: Create, view, edit, and manage invoices
- **Responsive Design**: Optimized for desktop and mobile devices
- **Payment Tracking**: Track payment status and confirmations
- **Customer Management**: Add and manage customer information
- **Invoice Actions**: Download PDF, duplicate, and share invoices
- **Dashboard Analytics**: Overview of paid, overdue, draft, and unpaid invoices

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Netlify serverless function
- **State Management**: React Context + use state
- **Testing**: vitest, React Testing Library
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components
│   ├── invoice/         # Invoice-related components
│   ├── auth/            # Authentication components
│   └── common/          # Common components
    └── modal/          # Modal components

├── pages/               # Page components
├── hooks/               # Custom React hooks
├── contexts/            # React contexts
├── services/            # API services
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── __tests__/           # Test files

```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**

```bash
git clone
cd invoice-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore
   - Copy your Firebase config

4. **Environment Setup**
   Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

```

5. **Start the development server**

```bash
npm run dev
```

6. **Start the Socket.IO server** (in a separate terminal)

```bash
npm run server
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 🏗 Architecture Overview

### Authentication Flow

- Firebase Authentication for secure user management
- Protected routes using React Router
- Persistent login state with localStorage backup

### Data Management

- Firebase Firestore for data persistence
- Real-time updates using Firestore listeners
- Socket.IO for immediate UI feedback

### State Management

- React Context for global state
- useReducer for complex state logic
- Custom hooks for business logic

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first approach
- Tailwind CSS breakpoints
- Touch-friendly interfaces
- Optimized layouts for all screen sizes

## 🔧 Key Components

### InvoiceDashboard

Main dashboard showing invoice statistics and recent activities.

### InvoiceDetail

Detailed view of individual invoices with payment tracking.

### CreateInvoice

Form component for creating new invoices with validation.

### AuthWrapper

HOC for protecting authenticated routes.

## 📊 Mock Backend

The application includes a comprehensive mock backend that simulates:

- Invoice CRUD operations
- Customer management

## 🚨 Error Handling

Comprehensive error handling for:

- Network connectivity issues
- Firebase authentication errors
- Form validation errors

## 🔒 Security Features

- Input validation and sanitization
- Protected API endpoints
- Secure Firebase rules
- XSS protection

## 📈 Performance Optimizations

- Efficient re-rendering strategies
- caching Frontend requests

## 🎨 Design System

- Consistent color palette
- Typography scale
- Component variants
- Accessibility compliance

## 🙏 Acknowledgments

- Design inspiration from modern invoice applications
- Firebase for backend services
- Tailwind CSS for styling system
- React community for best practices

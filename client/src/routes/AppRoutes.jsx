import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

// Import all necessary pages
import RoleSelectionPage from '../pages/RoleSelectionPage.jsx';
import StudentJoinPage from '../pages/StudentJoinPage.jsx';
import TeacherSessionPage from '../pages/TeacherSessionPage.jsx';
import StudentSessionPage from '../pages/StudentSessionPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<RoleSelectionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Student Flow --- */}
        {/* Route for students who manually need to enter a code */}
        <Route path="/join" element={<StudentJoinPage />} />
        
        {/* Route for students who have a direct link with the session ID */}
        <Route path="/session/:sessionId" element={<StudentJoinPage />} />
        
        {/* The actual live polling view for the student after joining */}
        <Route path="/session/:sessionId/live" element={<StudentSessionPage />} />

        {/* --- Protected Teacher Route --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/session/:sessionId/teacher" element={<TeacherSessionPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;


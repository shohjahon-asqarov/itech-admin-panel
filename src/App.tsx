import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadForm from './pages/LeadForm';
import Teachers from './pages/Teachers';
import TeacherForm from './pages/TeacherForm';
import Testimonials from './pages/Testimonials';
import TestimonialForm from './pages/TestimonialForm';
import Courses from './pages/Courses';
import CourseForm from './pages/CourseForm';
import Settings from './pages/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Leads Routes */}
              <Route path="leads" element={<Leads />} />
              <Route path="leads/new" element={<LeadForm />} />
              <Route path="leads/:id" element={<LeadForm />} />
              
              {/* Teachers Routes */}
              <Route path="teachers" element={<Teachers />} />
              <Route path="teachers/new" element={<TeacherForm />} />
              <Route path="teachers/:id" element={<TeacherForm />} />
              
              {/* Testimonials Routes */}
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="testimonials/new" element={<TestimonialForm />} />
              <Route path="testimonials/:id" element={<TestimonialForm />} />
              
              {/* Courses Routes */}
              <Route path="courses" element={<Courses />} />
              <Route path="courses/new" element={<CourseForm />} />
              <Route path="courses/:id" element={<CourseForm />} />
              
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
          
          {/* Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="!bg-white/95 !backdrop-blur-xl !border !border-gray-200/50 !shadow-xl !rounded-2xl !text-gray-900"
            bodyClassName="!text-sm !font-medium"
            progressClassName="!bg-gradient-to-r !from-blue-500 !to-indigo-500"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
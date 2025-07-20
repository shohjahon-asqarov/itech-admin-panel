import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ui/error-boundary';
import { CustomToastContainer } from './components/ui/toast';
import { ProtectedRoute, PublicRoute, UnauthorizedPage } from './components/ui/protected-route';
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

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Unauthorized Page */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected Routes */}
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

                {/* Settings Route */}
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 max-w-md w-full text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                        </svg>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Sahifa topilmadi
                      </h1>
                      <p className="text-gray-600 mb-6">
                        Kechirasiz, qidirayotgan sahifa mavjud emas yoki o'chirilgan.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => window.history.back()}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          Orqaga qaytish
                        </button>
                        <button
                          onClick={() => window.location.href = '/dashboard'}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          Bosh sahifa
                        </button>
                      </div>
                    </div>
                  </div>
                }
              />
            </Routes>

            {/* Professional Toast Container */}
            <CustomToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
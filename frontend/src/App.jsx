import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import InventoryDashboard from './pages/InventoryDashboard';
import SupplierManagement from './pages/SupplierManagement';
import UserManagement from './pages/UserManagement';
import CustomerDashboard from './pages/CustomerDashboard';
import Segments from './pages/Segments';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {token && <Navbar />}
        <div className="flex-grow flex flex-col">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <InventoryDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/suppliers"
              element={
                <ProtectedRoute requireRole="Owner">
                  <SupplierManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute requireRole="Owner">
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
                    <CustomerDashboard />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/segments"
              element={
                <ProtectedRoute requireRole="Owner">
                  <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
                    <Segments />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/inventory" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

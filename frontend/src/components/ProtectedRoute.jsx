import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireRole }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (requireRole && user.role !== requireRole) {
        return <Navigate to="/inventory" replace />; // Redirect non-owners to dashboard if they try to access owner routes
    }

    return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isLoggedIn, userType, allowedUserTypes }) => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');

    const isActuallyLoggedIn = isLoggedIn || !!token;
    const actualUserType = userType || storedUserType;

    if (!isActuallyLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedUserTypes && !allowedUserTypes.includes(actualUserType)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
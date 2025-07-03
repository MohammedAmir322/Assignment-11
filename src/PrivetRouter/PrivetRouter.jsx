import React from 'react';
import { use } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Navigate } from 'react-router';

const PrivetRouter = ({ children }) => {
    const { user } = use(AuthContext)
    if (user && user.email) {
        return children;
    }
    if (!user) {
        return <Navigate to="/auth/signIn" state={location.pathname}></Navigate>;
    }
    return children;
};

export default PrivetRouter;
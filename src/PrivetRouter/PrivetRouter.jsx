import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../Context/AuthContext';

const PrivateRouter = ({ children }) => {
    const { user,loading } = useContext(AuthContext);
    const location = useLocation();

if(loading){
    return <span className="loading loading-bars loading-xl"></span>
}


    if (!user) {
        return <Navigate to="/login" state={ location.pathname } replace />

    }

    return children 
    };

export default PrivateRouter;

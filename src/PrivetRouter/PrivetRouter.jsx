import React from 'react';
import { use } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Navigate } from 'react-router';

const PrivetRouter = ({children}) => {
    const {user}=use(AuthContext)
    if(!user){
        <Navigate to='/login'></Navigate>
    }
    return children;
};

export default PrivetRouter;
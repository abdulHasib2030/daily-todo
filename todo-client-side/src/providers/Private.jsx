import React, { useContext } from 'react';
import { AuthContext } from './AuthProviders';
import Loading from '../components/Loading';
import { Navigate } from 'react-router-dom';

const Private = ({children}) => {
    const {user, loading} = useContext(AuthContext)
    if(loading) return <Loading />

    if(user) return children
    return <Navigate to={'/login'}></Navigate>
};

export default Private;
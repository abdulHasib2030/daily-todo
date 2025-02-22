import React, { useContext } from 'react';
import { AuthContext } from './AuthProviders';
import Loading from '../components/Loading';
import { Navigate } from 'react-router-dom';

const LogRedirect = ({ children }) => {
   const { user, loading } = useContext(AuthContext)
   if (loading) return <Loading />

   if (user) return <Navigate to={'/home'}></Navigate>
   return children
};

export default LogRedirect;
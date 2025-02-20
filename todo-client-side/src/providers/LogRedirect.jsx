import React, { useContext } from 'react';
import { AuthContext } from './AuthProviders';
import Loading from '../components/Loading';
import { Navigate } from 'react-router-dom';

const LogRedirect = ({children}) => {
   const {user} = useContext(AuthContext)
   
   
   if(user) return <Navigate to={'/home'}></Navigate>
   return children
};

export default LogRedirect;
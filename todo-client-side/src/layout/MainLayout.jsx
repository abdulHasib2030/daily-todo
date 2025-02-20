import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../providers/AuthProviders';
import Loading from '../components/Loading';

const MainLayout = () => {
    const {loading} = useContext(AuthContext)
    if(loading) return <Loading></Loading>
    return (
        <div >
            <Navbar></Navbar>
            <div className='w-11/12 mx-auto'>

          
            <Toaster/>
            <Outlet></Outlet>
            </div>
        </div>
    );
};

export default MainLayout;
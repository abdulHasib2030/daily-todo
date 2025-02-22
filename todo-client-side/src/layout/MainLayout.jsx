import React, { useContext, useState } from 'react';
import Navbar from '../components/Navbars';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../providers/AuthProviders';
import Loading from '../components/Loading';
import Footer from '../components/Footer';

const MainLayout = () => {
    // const [loading, loading] = useState(true)
    const {user,loading} = useContext(AuthContext)
    if(loading){
        return  <Loading/>
    }
    return (
        <div >
            <Navbar></Navbar>
            <div className='w-11/12 mx-auto'>

          
            <Toaster/>
            <Outlet></Outlet>

            <Footer/>
            </div>
        </div>
    );
};

export default MainLayout;
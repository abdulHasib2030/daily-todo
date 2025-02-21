import {
    createBrowserRouter,
 
  } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/userAccount/Login";
import Signup from "../pages/userAccount/Signup";
import Private from "../providers/Private";
import Dashboard from "../pages/Dashboard/Dashboard";
import LogRedirect from "../providers/LogRedirect";
import TaskList from "../pages/Dashboard/TaskList";

export const router = createBrowserRouter([
    {
        path:'/',
        element: <MainLayout></MainLayout>,
        children: [
            {
                path:'/',
                element: <Home></Home>
            },
            {
                path:'/login',
                element: <LogRedirect><Login></Login></LogRedirect>
            },
            {
                path:'/signup',
                element: <LogRedirect><Signup /></LogRedirect>
            },
            {
                path: '/home',
                element: <Private><TaskList/></Private>
            },

        ]
    }
])
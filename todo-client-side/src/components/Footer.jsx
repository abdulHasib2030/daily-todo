import React from 'react';
import { LuListTodo } from "react-icons/lu";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='mt-10'>
           <div className='border dark:border-gray-900'></div> 
           <div className='text-center '>
           <Link to={'/'} className=" text-xl flex items-center gap-3 py-6 justify-center"><img src="https://img.icons8.com/?size=100&id=w0JUG294E8rU&format=png&color=000000" className='w-10' alt="" /> Daily To-Do</Link>
            <div>
               <p className='md:w-4/5 w-11/12 mx-auto '>Daily Todo is a simple and efficient task management application that allows users to add, update, delete, and reorder their daily tasks using a drag-and-drop feature. With an intuitive interface, users can easily manage their to-do list, ensuring better productivity and organization. The app provides a seamless experience for tracking and updating tasks in real time, helping users stay on top of their daily goals.</p>
               
                           </div>

<p className='py-5 text-sm'>© 2025 Daily To-Do™. All Rights Reserved.</p>
           </div>
        </div>
    );
};

export default Footer;
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProviders';
import { Link, NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { auth } from '../firebase/firebase';
import { LuListTodo } from "react-icons/lu";
import { Button, Navbar } from "flowbite-react";
import { IoMdMoon } from "react-icons/io";
import { IoSunny } from "react-icons/io5";

const Navbars = () => {
  const { user, logout } = useContext(AuthContext)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);


//   const toggleDarkMode = () => {
//     const htmlElement = document.documentElement;
//     console.log(htmlElement.classList.contains('dark'), htmlElement.classList.value);
//     if (htmlElement.classList.contains('dark')) {
//         htmlElement.classList.remove('dark');
//         htmlElement.classList.add('light')
//         localStorage.setItem('theme', 'light');
//         setThemeIcon(false)
//     } else {
//         htmlElement.classList.add('dark');
//         htmlElement.classList.remove('light')

//         localStorage.setItem('theme', 'dark');
//         setThemeIcon(true)
//     }
// };

// Apply the saved theme on page load
// const savedTheme = localStorage.getItem('theme');

// if (savedTheme === 'dark') {

//     document.documentElement.classList.add('dark');
//     document.documentElement.classList.remove('light');

// } else {
//     document.documentElement.classList.remove('dark');
//     document.documentElement.classList.add('light');

// }

  const logoutUser = () => {
    logout()

  }

  return (
    //         <div className='border-b dark:border-gray-600 w-full'>
    //             <div className="navbar w-11/12 mx-auto ">
    //   <div className="flex-1 ">
    //     <Link to={'/'} className=" text-xl flex items-center gap-3"><LuListTodo className='text-3xl  text-[#E3B40B]' /> Daily To-Do</Link>
    //   </div>
    //   <div className="flex gap-2">
    //     {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
    //     {
    //         user ? <button onClick={logoutUser} className="btn btn-soft">Logout</button>

    //     :
    //     <>
    //     <Link to={'/login'}><button className="btn btn-soft">Login</button></Link>
    //     <Link to={'/signup'}><button className="btn btn-soft">Sign Up</button></Link>
    //     </>
    //     }
    //     <button onClick={toggleTheme}>
    //     <select className="select select-bordered w-full max-w-xs">
    //   <option onClick={()=>toggleTheme('system')}>system</option>
    //   <option >dark</option>
    //   <option >light</option>
    // </select>
    //     </button>
    //   </div>
    // </div>
    //         </div>

    <nav className="bg-white border-gray-200 dark:bg-gray-900 ">
      <div className="w-11/12 flex flex-wrap items-center justify-between mx-auto py-4">
        <Link to={'/'} className=" text-xl flex items-center gap-3"><img src="https://img.icons8.com/?size=100&id=w0JUG294E8rU&format=png&color=000000" className='w-10' alt="" /> Daily To-Do</Link>

        <div className=" w-full  md:w-auto" id="navbar-default">

          {
            user ?
              // <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-4 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
               <>
               <Link to={'/home'}>
                <button className="relative mr-4 inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
                        <span className="absolute   inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a2aeff_0%,#3749be_50%,#a2aeff_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="inline-flex h-full   w-full cursor-pointer items-center justify-center rounded-full dark:bg-[#070e41] bg-[#ffffff] px-8 py-1 text-sm font-medium dark:text-gray-50 text-black backdrop-blur-3xl">
                           Your To-Do
                        </span>
                    </button>
                </Link>
                <button onClick={logoutUser} className="py-2.5 px-5  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Logout</button>
                </> // </ul>
              :
              <ul className="font-medium flex gap-5 p-4 md:p-0 mt-4  rounded-lg  md:flex-row md:space-x-4 rtl:space-x-reverse md:mt-0 md:border-0   dark:border-gray-700">
                <Link to={'/login'}>
                  <button type="button" className="py-2.5 px-5  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Login</button>
                </Link>
                <Link to={'/signup'}>
                  <button type="button" className="py-2.5 px-5  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Sign Up</button>
                </Link>
              </ul>
          }
          
        </div>

      </div>
    </nav>
  );
};

export default Navbars;
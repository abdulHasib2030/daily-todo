import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProviders';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const {user }= useContext(AuthContext)
    const [theme, setTheme] = useState( localStorage.getItem('theme') || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") 

    useEffect(()=>{
      if(theme === 'dark'){
        document.documentElement.classList.add('dark')
      }
      else{
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('theme', theme)
    }, [theme])


    const toggleTheme = () =>{
      console.log(theme);
      setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <Link to={'/'} className=" text-xl">Daily Todo</Link>
  </div>
  <div className="flex gap-2">
    {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
    {
        user ?
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={0}
        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
    :
    <>
    <Link to={'/login'}><button className="btn btn-soft">Login</button></Link>
    <Link to={'/signup'}><button className="btn btn-soft">Sign Up</button></Link>
    </>
    }
    <button onClick={toggleTheme}>
    <select className="select select-bordered w-full max-w-xs">
  <option onClick={()=>toggleTheme('system')}>system</option>
  <option >dark</option>
  <option >light</option>
</select>
    </button>
  </div>
</div>
        </div>
    );
};

export default Navbar;
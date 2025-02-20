import React, { useContext, useState } from 'react';
import img from '../../assets/login.jpg'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProviders';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
    const [error, setError] = useState({})
    const [loading, setLoading] = useState(false)
    const { login, google } = useContext(AuthContext)
     const navigate = useNavigate()

    const handleLoginUpForm = (e) => {
        e.preventDefault()
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        if (!email) return setError({ email: "Email required." })
        if (!password) return setError({ password: "Password required." })
        else setError({})
        setLoading(true)
        login(email, password)
            .then((res) => {
                if(res.user){
                    navigate('/')
                    toast.success("Login Successfully.")
                    setLoading(false)
                }
                else  toast.error("Invalid email and password.")
            })
            .catch(err => {
                toast.error("Invalid email and password.")
                setLoading(false)
            })

    }

    const handleGoogle = () =>{
        google()
        .then(res =>{
           if(res.user){
            navigate('/')
            toast.success("Sign Up Successfully.")
           }
           else toast.error("Something wrong.")
        })
        .catch(err =>{
            toast.error("Something wrong.")
        })
      }
    return (
        <div>
            <div className=" bg-base-200 min-h-screen">
                <div className="md:flex ">
                    <div className="text-center order-1 md:w-1/2 mx-auto ">
                        <img className='md:block hidden h-full' src={img} alt="" />
                    </div>
                    <div className=" bg-base-100   md:w-1/2 lg:pt-32">
                        <div className="card-body">
                            <h1 className="text-5xl font-bold">Login now</h1>

                            <fieldset className="fieldset w-full">
                                <form onSubmit={handleLoginUpForm} className='space-y-3 text-lg dark:text-white'>

                                    <label className="fieldset-label">Email</label>
                                    <input name='email' type="email" className="input w-full" placeholder="Enter your mail" />
                                    {
                                        error?.email && <p className='text-red-500'>{error?.email}</p>
                                    }
                                    <label className="fieldset-label">Password</label>
                                    <input name='password' type="password" className="input w-full" placeholder="Password" />
                                    {
                                        error?.password && <p className='text-red-500'>{error?.password}</p>
                                    }
                                    {/* <div><a className="link link-hover">Forgot password?</a></div> */}
                                    {
                                        loading ?
                                            <button type='submit' className="btn btn-neutral mt-4"><span className="loading loading-spinner loading-lg"></span></button>
                                            :
                                            <button type='submit' className="btn btn-neutral mt-4">Login</button>
                                    }
                                    <p>Don't have an account <Link to={'/signup'}><span className='link text-blue-500'>Sign Up</span></Link></p>
                                </form>
                                 <div className='divider uppercase'>or</div>
                                                                <button onClick={handleGoogle} className='flex cursor-pointer items-center gap-3 text-2xl text-center justify-center border py-2 rounded-lg dark:border-gray-600'><FcGoogle /> Login with Google </button>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
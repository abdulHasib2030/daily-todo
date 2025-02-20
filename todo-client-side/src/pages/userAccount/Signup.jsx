import React from 'react';
import img from '../../assets/signup.jpg'
import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProviders';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import axios from 'axios'
const Signup = () => {
    const { createUser, user } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({})
    const navigate = useNavigate()
    
    const handleSignUpForm = (e) =>{
        e.preventDefault()

        const form = e.target
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        if(!name ){
           return setError({name: "Name required"})
        }
        if(!email ){
           return setError({email: "Email required"})
        }
        if(!password ){
           return setError({password: "Password required"})
        }
        if(password.length < 6){
            return setError({password: "Password length at least 6 character required."})
        }
        else{
            setError({})
        }

    setLoading(true)
        createUser(email, password)
        .then(res => {
            if(res.user){

                const res =  axios.post('http://localhost:5000/signup/', {name:name, email:email, userId: user.uid})
                
                updateProfile(auth.currentUser, {
                    displayName: name
                }).then(()=>{

                   navigate('/')
                toast.success("Sign Up Successfully.")  
                })
                .catch((errr)=>{
                    setError(errr)
                })
                 setLoading(false)
            }
        })
        .catch(err => {
            toast.error("Already this email account create.")
            setLoading(false)

        })
    }
    console.log(user);
    return (
        <div>
            <div className=" bg-base-200 min-h-screen">
                <div className="md:flex ">
                    <div className="text-center order-1 md:w-1/2 mx-auto ">
                        <img className='md:block hidden h-full' src={img} alt="" />
                    </div>
                    <div className=" bg-base-100   md:w-1/2 lg:pt-32">
                        <div className="card-body">
                            <h1 className="text-5xl font-bold">Create a Account</h1>

                            <fieldset className="fieldset w-full">
                                <form onSubmit={handleSignUpForm} className='space-y-3 text-lg dark:text-white'>
                                <label className="fieldset-label">Name</label>
                                <input name='name' type="text" className="input w-full" placeholder="Enter your name" />
                                {
                                    error?.name && <p className='text-red-500'>{error?.name}</p>
                                }
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
                                <button type='submit' className="btn btn-neutral mt-4">Sign Up</button>
                                }
                                <p>Already have an account <Link to={'/login'}><span className='link text-blue-500'>Login</span></Link></p>
                                </form>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
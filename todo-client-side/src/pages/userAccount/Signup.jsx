import React from 'react';
import img from '../../assets/signup.jpg'
import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProviders';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const Signup = () => {
    const { createUser } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleSignUpForm = (e) =>{
        e.preventDefault()

        const form = e.target
        const email = form.email.value;
        const password = form.password.value;
        if(!email || !password){
           return toast.error('Field fill up')
        }
    setLoading(true)
        createUser(email, password)
        .then(res => {
            if(res.user){
                navigate('/')
                toast.success("Sign Up Successfully.")
                setLoading(false)
            }
        })
        .catch(err => {
            toast.error("Already this email account create.")
            setLoading(false)

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
                            <h1 className="text-5xl font-bold">Create a Account</h1>

                            <fieldset className="fieldset w-full">
                                <form onSubmit={handleSignUpForm}>
                                <label className="fieldset-label">Email</label>
                                <input name='email' type="email" className="input w-full" placeholder="Email" />
                                <label className="fieldset-label">Password</label>
                                <input name='password' type="password" className="input w-full" placeholder="Password" />
                                <div><a className="link link-hover">Forgot password?</a></div>
                                {
                                    loading ? 
                                    <button type='submit' className="btn btn-neutral mt-4"><span className="loading loading-spinner loading-lg"></span></button>
                                     :
                                <button type='submit' className="btn btn-neutral mt-4">Login</button>
                                }
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
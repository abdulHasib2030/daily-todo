import React from 'react';
import img from '../../assets/login.jpg'

const Login = () => {
    return (
        <div>
            <div className=" bg-base-200 min-h-screen">
                <div className="md:flex ">
                    <div className="text-center order-1 md:w-1/2 mx-auto ">
                        <img className='md:block hidden h-full' src={img} alt="" />
                    </div>
                    <div className=" bg-base-100   md:w-1/2 lg:pt-32">
                        <div className="card-body">
                        <h1 className="text-5xl font-bold">Login now!</h1>

                            <fieldset className="fieldset w-full">
                                <label className="fieldset-label">Email</label>
                                <input type="email" className="input w-full" placeholder="Email" />
                                <label className="fieldset-label">Password</label>
                                <input type="password" className="input w-full" placeholder="Password" />
                                <div><a className="link link-hover">Forgot password?</a></div>
                                <button className="btn btn-neutral mt-4">Login</button>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
import React from 'react';
import banner from '../../assets/banner.jpg'
import { Link } from 'react-router-dom';


const Banner = () => {
    return (
        <div className='md:flex md:h-[60vh] lg:h-[80vh] justify-center items-center pt-10 md:pt-0'>
            <div className='md:w-1/2  '>
                <img src={banner} className='w-[600px] mx-auto rounded-lg' alt="" />
            </div>
            <div className='md:w-1/2 text-center'>
                <h1 className='text-4xl font-bold  mx-auto '> Organize your daily tasks efficiently and boost <span className='text-[#F5B400] text-'>productivity.</span> </h1>
                <Link to={'/login'}>
                    <button className="relative mt-10 inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
                        <span className="absolute   inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a2aeff_0%,#3749be_50%,#a2aeff_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="inline-flex h-full  uppercase w-full cursor-pointer items-center justify-center rounded-full dark:bg-[#070e41] bg-[#ffffff] px-8 py-1 text-sm font-medium dark:text-gray-50 text-black backdrop-blur-3xl">
                            Get Started
                        </span>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Banner;
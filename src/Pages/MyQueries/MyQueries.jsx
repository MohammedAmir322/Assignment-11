import React from 'react';

import QueryCard from './QueryCard';

import { useLoaderData, useNavigate } from 'react-router'; 

const MyQueries = () => {
    const navigate = useNavigate();
    const queries = useLoaderData();
    console.log(queries);

    return (
        <div>
            <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-10 flex flex-col items-center justify-center mb-8 overflow-hidden">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center drop-shadow-lg">
                    Welcome to Product Recommend!
                </h1>
                <p className="text-lg md:text-xl text-white mb-6 text-center max-w-2xl">
                    Ask your product queries, get recommendations, and help others make better choices.
                </p>
                <button
                    className="btn btn-accent btn-lg px-8 text-lg shadow-md"
                    onClick={() => navigate('/add-queries')}
                >
                    Add Queries
                </button>
                {/* Decorative shapes */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-pink-300 opacity-30 rounded-full -z-10 blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-300 opacity-30 rounded-full -z-10 blur-2xl"></div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 w-11/12 mx-auto'>
                {
                    queries.map(querie => <QueryCard key={querie._id} querie={querie} />) 
                }
            </div>
        </div>
    );
};

export default MyQueries;
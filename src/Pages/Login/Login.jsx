import React from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                background: 'linear-gradient(135deg, #f0abfc 0%, #e0e7ff 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div className="relative z-10 bg-white bg-opacity-90 rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-4 text-purple-700">Login to Your Account</h2>
                <form className="w-full flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered w-full"
                        required
                    />
                    <button className="btn btn-primary w-full mt-2">Login</button>
                </form>
                <div className="divider my-4">OR</div>
                <button className="btn btn-outline btn-google w-full flex items-center justify-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <g>
                            <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.1 33.4 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11.1 0 19.7-7.9 19.7-19 0-1.3-.1-2.1-.2-3z"/>
                            <path fill="#34A853" d="M6.3 14.7l7 5.1C15.2 17.1 19.2 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 15.6 3 8.1 8.6 6.3 14.7z"/>
                            <path fill="#FBBC05" d="M24 44c5.6 0 10.6-1.9 14.5-5.2l-6.7-5.5C29.6 36 24 36 24 36c-5.6 0-10.3-3.6-12-8.5l-7 5.4C8.1 39.4 15.6 44 24 44z"/>
                            <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.2 3.2-4.1 5.5-7.7 5.5-4.6 0-8.4-3.8-8.4-8.5s3.8-8.5 8.4-8.5c2.5 0 4.7.9 6.3 2.4l6.2-6.2C38.1 8.6 31.6 3 24 3c-6.6 0-12 5.4-12 12s5.4 12 12 12c5.6 0 10.1-3.6 11.7-8.5z"/>
                        </g>
                    </svg>
                    Sign in with Google
                </button>
                <p className="mt-6 text-gray-600">
                    Don't have an account?{' '}
                    <button
                        className="text-purple-700 font-semibold underline"
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
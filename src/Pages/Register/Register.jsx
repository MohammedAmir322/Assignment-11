import React, { useContext } from 'react';
import Lottie from 'lottie-react';
import registerAnimation from '../../assets/Lotte/Animation - 1749119691760.json';
import { useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import { FcGoogle } from "react-icons/fc";
const Register = () => {
    const { createUser, logInWithGoogle } = useContext(AuthContext); // <-- add logInWithGoogle
    const navigate = useNavigate();
    const location = useLocation()

    // Handle form submission
    const handleSubmit = e => {
        e.preventDefault();
        const form = e.target;
        const fullName = form.fullName.value;
        const email = form.email.value;
        const password = form.password.value;
        const photoURL = form.photoURL.value;
        console.log('Full Name:', fullName);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Photo URL:', photoURL);
        console.log('Form submitted');

        createUser(email, password)
            .then(result => {
                console.log('User created:', result.user);
                navigate(location.state || '/');
            })
            .catch(error => {
                console.error('Error creating user:', error);
            });
    };

    // Handle Google Sign In
    const handleGoogleSignIn = () => {
        logInWithGoogle()
            .then(result => {
                console.log('Google sign in success:', result.user);
               navigate(location.state || '/');
            })
            .catch(error => {
                console.error('Google sign in error:', error);
            });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                background: 'linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Animation */}
            <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none z-0">
                <Lottie
                    animationData={registerAnimation}
                    loop={true}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            {/* Registration Card */}
            <div
                className="relative z-10 rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center"
                style={{
                    background: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(8px)'
                }}
            >
                <h2 className="text-3xl font-bold mb-4 text-purple-700">Create Your Account</h2>
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        className="input input-bordered w-full"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="input input-bordered w-full"
                        required
                    />
                    <input
                        type="url"
                        name="photoURL"
                        placeholder="Photo URL"
                        className="input input-bordered w-full"
                    />
                    <button className="btn btn-primary w-full mt-2">Register</button>
                </form>
                <div className="divider my-4">OR</div>
                <button
                    className="btn btn-outline btn-google w-full flex items-center justify-center gap-2"
                    onClick={handleGoogleSignIn}
                >
                    <FcGoogle size= "20" />
                    Sign up with Google
                </button>
                <p className="mt-6 text-gray-600">
                    Already have an account?{' '}
                    <button
                        className="text-purple-700 font-semibold underline"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
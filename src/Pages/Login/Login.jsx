import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import Lottie from 'lottie-react';
import loginLottie from '../../assets/Lotte/Login.json';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
    const navigate = useNavigate();
    const { logInUser, logInWithGoogle } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleLogin = e => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        logInUser(email, password)
            .then(result => {
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/');
            })
            .catch(error => {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: error.message,
                });
            });
    };

    // Google Sign In handler
    const handleGoogleSignIn = () => {
        setLoading(true);
        logInWithGoogle()
            .then(result => {
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Google Sign-In Successful!',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/');
            })
            .catch(error => {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Google Sign-In Failed',
                    text: error.message,
                });
            });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                background: 'linear-gradient(135deg, #f0abfc 0%, #e0e7ff 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div className="flex bg-transparent rounded-xl shadow-lg max-w-3xl w-full">
                {/* Login Form Side */}
                <div
                    className="relative z-10 rounded-l-xl shadow-lg p-8 w-full md:w-1/2 flex flex-col items-center"
                    style={{
                        background: 'rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(8px)'
                    }}
                >
                    <h2 className="text-3xl font-bold mb-4 text-purple-700">Login to Your Account</h2>
                    <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
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
                        <button className="btn btn-primary w-full mt-2" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className="divider my-4">OR</div>
                    <button
                        className="btn btn-outline btn-google w-full flex items-center justify-center gap-2"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <FcGoogle />
                        Sign in with Google
                    </button>
                    <p className="mt-6 text-gray-600">
                        Don't have an account?{' '}
                        <button
                            className="text-purple-700 font-semibold underline"
                            onClick={() => navigate('/register')}
                            disabled={loading}
                        >
                            Register
                        </button>
                    </p>
                </div>
                {/* Lottie Animation Side */}
                <div className="hidden md:flex items-center justify-center w-1/2 p-6">
                    <Lottie animationData={loginLottie} loop={true} style={{ width: '100%', height: '300px' }} />
                </div>
            </div>
        </div>
    );
};

export default Login;
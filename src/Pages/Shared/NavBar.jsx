import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { NavLink, useNavigate } from 'react-router';

const NavBar = () => {
    const { user, logOutUser } = useContext(AuthContext);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logOutUser()
            .then(() => {
                console.log('User logged out successfully');
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    const guestLinks = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/queries">Queries</NavLink></li>
            <li><NavLink to="/blog">Blog</NavLink></li>
            <li><NavLink  to="/login">Log-in</NavLink></li>
            <li><NavLink to="/register">Register</NavLink></li>
        </>
    );

    const userLinks = (
        <>
            <li ><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/queries">Queries</NavLink></li>
            <li><NavLink to="/recommendations">Recommendations For Me</NavLink></li>
            <li><NavLink to="/my-queries">My Queries</NavLink></li>
            {/* <li><NavLink to="/add-Queries">Add Queries</NavLink></li> */}

            <li><NavLink to="/my-recommendations">My Recommendations</NavLink></li>
                        <li><NavLink to="/blog">Blog</NavLink></li>

            <li>
                <button className="btn  hover:bg-red-600" onClick={handleLogout}>
                    Logout
                </button>
            </li>
        </>
    );

    // Avatar 
    const getInitial = (name, email) => {
        if (name && name.length > 0) return name[0].toUpperCase();
        if (email && email.length > 0) return email[0].toUpperCase();
        return 'U';
    };

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                    >
                        {user ? userLinks : guestLinks}
                    </ul>
                </div>
                {/* Logo + Website Name */}
                <div className=" text-xl flex items-center gap-2 justify-center sm:justify-start">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        className="inline-block fill-primary"
                    >
                        <circle cx="12" cy="12" r="10" fill="#fff" />
                        <text
                            x="12"
                            y="16"
                            textAnchor="middle"
                            fontSize="10"
                            fill="#1976d2"
                            fontFamily="Arial"
                        >
                            PR
                        </text>
                    </svg>
                    <span className="text-accent sm:text-lg">Product Recommend</span>
                </div>

            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {user ? userLinks : guestLinks}
                </ul>
            </div>
            <div className="navbar-end">
                {user && (
                    <div className="relative">
                        <button
                            className="avatar avatar-placeholder btn btn-ghost btn-circle"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <div className="bg-neutral text-neutral-content w-12 rounded-full flex items-center justify-center">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="User"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl">
                                        {getInitial(user.displayName, user.email)}
                                    </span>
                                )}
                            </div>
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                <div className="p-4 border-b">
                                    <div className="font-bold">{user.displayName || user.email}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                                <ul className="menu p-2 ">
                                    <li>
                                        <button
                                            className="btn btn-ghost btn-sm w-full justify-start"
                                            onClick={() => {
                                                navigate(`/user/${user.email}`);
                                                setShowMenu(false);
                                            }}
                                        >
                                            👤 My Profile
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="btn btn-error btn-sm w-full "
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavBar;
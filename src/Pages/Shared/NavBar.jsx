import React from 'react';
import { NavLink } from 'react-router';


// Example: Replace with your actual authentication logic
const isLoggedIn = false; // Set to true to test logged-in state
const user = { name: "John Doe" }; // Example user object

const NavBar = () => {
    const guestLinks = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/queries">Queries</NavLink></li>
            <li><NavLink className="btn hover:bg-red-600" to="/register">Register </NavLink></li>
            <li><NavLink className="btn hover:bg-red-600" to="/login">Log-in</NavLink></li>
        </>
    );

    const userLinks = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/queries">Queries</NavLink></li>
            <li><NavLink to="/recommendations">Recommendations For Me</NavLink></li>
            <li><NavLink to="/my-queries">My Queries</NavLink></li>
            <li><NavLink to="/my-recommendations">My Recommendations</NavLink></li>
            <li><NavLink to="/logout">Logout</NavLink></li>
        </>
    );

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
                        {isLoggedIn ? userLinks : guestLinks}
                    </ul>
                </div>
                {/* Logo + Website Name */}
                <NavLink to="/" className="btn btn-ghost text-xl flex items-center gap-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" className="inline-block fill-primary">
                        <circle cx="12" cy="12" r="10" fill="#fff" />
                        <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#1976d2" fontFamily="Arial">PR</text>
                    </svg>
                    Product Recommend
                </NavLink>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {isLoggedIn ? userLinks : guestLinks}
                </ul>
            </div>
            <div className="navbar-end">
                {isLoggedIn ? (
                    <span className="mr-2 font-semibold">Hello, {user.name}</span>
                ) : null}
            </div>
        </div>
    );
};

export default NavBar;
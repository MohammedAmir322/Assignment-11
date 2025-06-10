import React from 'react';

const Footer = () => {
    return (
        <footer className="footer footer-horizontal footer-center bg-primary text-primary-content p-10">
            <aside className="flex flex-col items-center">
                {/* Logo */}
                <svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block fill-current mb-2"
                >
                    {/* Example logo path */}
                    <circle cx="12" cy="12" r="10" fill="#fff" />
                    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#1976d2" fontFamily="Arial">PR</text>
                </svg>
                {/* Website Name */}
                <p className="font-bold text-lg mb-1">Product Recommend</p>
                <p className="mb-1">Your trusted product advisor</p>
                <p>
                    &copy; {new Date().getFullYear()} Product Recommend. All rights reserved.
                </p>
            </aside>
            <nav>
                <div className="grid grid-flow-col gap-4">
                    {/* Facebook */}
                    <a
                        href="https://facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="fill-current"
                        >
                            <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                        </svg>
                    </a>
                    {/* LinkedIn */}
                    <a
                        href="https://linkedin.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="fill-current"
                        >
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.605v5.591z" />
                        </svg>
                    </a>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;
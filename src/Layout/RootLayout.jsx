import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../Pages/Shared/Footer';
import NavBar from '../Pages/Shared/NavBar';
import { SimpleChat } from '../Ai/ChatBot';

const RootLayout = () => {
    return (
        <div>
            <div className="sticky top-0 z-50  shadow-sm  mx-auto">
                <NavBar ></NavBar>
            </div>
            <div  >
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
            <SimpleChat></SimpleChat>
        </div>
    );
};

export default RootLayout;
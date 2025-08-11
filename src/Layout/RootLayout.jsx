import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../Pages/Shared/Footer';
import NavBar from '../Pages/Shared/NavBar';

const RootLayout = () => {
    return (
        <div>
            <div className="sticky top-0 z-50  shadow-sm w-11/12 mx-auto">
                <NavBar ></NavBar>
            </div>
            <div  >
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;
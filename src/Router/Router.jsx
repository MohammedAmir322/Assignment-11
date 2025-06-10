import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Error from "../Pages/Shared/Error";

const Router = createBrowserRouter([
    {
        path: "/",
        errorElement: <Error />,
        Component:RootLayout,
        children: [
            {
                index: true,
                Component:Home,
            },
            {
                path: "/register",
                Component: Register,
            },
            {
                path: "/login",
                Component: Login,
            },
        ],
    },
]);
export default Router;
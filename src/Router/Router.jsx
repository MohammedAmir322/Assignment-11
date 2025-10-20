import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Error from "../Pages/Shared/Error";
import Queries from "../Pages/Queries";
import PrivetRouter from "../PrivetRouter/PrivetRouter";
import MyQueries from "../Pages/MyQueries/MyQueries";
import AddQueries from "../Pages/MyQueries/AddQueries";
import QueriesCardDetails from "../Pages/MyQueries/QueriesCardDetails";
import UpdateProduct from "../Pages/MyQueries/UpdateProduct";
import Recommend from "../Pages/Recommend";
import MyRecommendations from "../Pages/MyRecommendations";
import MyQueryRecommendations from "../Pages/MyQueryRecommendations";
import UserProfile from "../Pages/UserProfile";


const Router = createBrowserRouter([
    {
        path: "/",
        errorElement: <Error />,
        Component: RootLayout,
        children: [
            {
                index: true,
                loader: () => fetch('https://product-server-navy.vercel.app/my-queries'),
                Component: Home,
            },
            {
                path: "/queries",
                loader: () => fetch('https://product-server-navy.vercel.app/my-queries'),
                Component: Queries,
                // element: <PrivetRouter><Queries></Queries></PrivetRouter>
            },
            {
                path: "/my-Queries",
                // loader: () => fetch('https://product-server-navy.vercel.app/queries'),
                element: <PrivetRouter><MyQueries></MyQueries></PrivetRouter>,
               
            },
            {
                path: "/add-queries",
                // Component: AddQueries,
                element: <PrivetRouter><AddQueries></AddQueries></PrivetRouter>
            },
            {
                path: "/updateProduct/:id",
                loader: ({ params }) => fetch(`https://product-server-navy.vercel.app/queries/${params.id}`),
                // Component: UpdateProduct
                element: <PrivetRouter><UpdateProduct></UpdateProduct></PrivetRouter>
            },
            {
                path: "/queriesCardDetails/:id",
                loader: ({ params }) => fetch(`https://product-server-navy.vercel.app/queries/${params.id}`),
                element: <PrivetRouter><QueriesCardDetails></QueriesCardDetails></PrivetRouter>,
                // Component: QueriesCardDetails
            },
            {
                path:"/recommend/:id",
                loader: ({ params }) => fetch(`https://product-server-navy.vercel.app/my-queries/${params.id}`),
                element: <PrivetRouter><Recommend></Recommend></PrivetRouter>,
                // Component: Recommend,
            },
            {
                path:"/my-recommendations",
                // Component: MyRecommendations,
                element: <PrivetRouter><MyRecommendations></MyRecommendations></PrivetRouter>,
            },
            {
                path:"/recommendations",
                // Component: MyQueryRecommendations,
                element: <PrivetRouter><MyQueryRecommendations></MyQueryRecommendations></PrivetRouter>,
            },
            {
                path: "/user/:email",
                element: <UserProfile />,
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
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


const Router = createBrowserRouter([
    {
        path: "/",
        errorElement: <Error />,
        Component: RootLayout,
        children: [
            {
                index: true,
                loader: () => fetch('http://localhost:3000/my-queries'),
                Component: Home,
            },
            {
                path: "/queries",
                loader: () => fetch('http://localhost:3000/my-queries'),
                element: <PrivetRouter><Queries></Queries></PrivetRouter>
            },
            {
                path: "/my-Queries",
                loader: () => fetch('http://localhost:3000/queries'),
                Component: MyQueries
            },
            {
                path: "/add-queries",
                Component: AddQueries
            },
            {
                path: "/updateProduct/:id",
                loader: ({ params }) => fetch(`http://localhost:3000/queries/${params.id}`),
                Component: UpdateProduct
            },
            {
                path: "/queriesCardDetails/:id",
                loader: ({ params }) => fetch(`http://localhost:3000/queries/${params.id}`),
                Component: QueriesCardDetails
            },
            {
                path:"/recommend/:id",
                loader: ({ params }) => fetch(`http://localhost:3000/my-queries/${params.id}`),
                Component: Recommend,
            },
            {
                path:"/my-recommendations",
                Component: MyRecommendations,
            },
            {
                path:"/recommendations",
                Component: MyQueryRecommendations,
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
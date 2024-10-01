import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/AuthenPage/LoginPage";
import SignUpCustomerPage from "../pages/AuthenPage/SignUpCustomerPage";
import KoiDetailPage from "../pages/KoiPage/KoiDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <Error />,
  },
  {
    path: "/signup-customer",
    element: <SignUpCustomerPage />,
    errorElement: <Error />,
  }
  ,
  {
    path: "/koi-detail",
    element: <KoiDetailPage />,
    errorElement: <Error />,
  }
]);


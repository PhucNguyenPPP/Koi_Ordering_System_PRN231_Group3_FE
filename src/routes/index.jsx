import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/AuthenPage/LoginPage";
import SignUpCustomerPage from "../pages/AuthenPage/SignUpCustomerPage";
import KoiDetailPage from "../pages/KoiPage/KoiDetailPage";
import CartPage from "../pages/CartPage/CartPage";
import RoleBasedGuard from "../guards/RoleBasedGuard";
import RoleSignUpPage from "../pages/AuthenPage/RoleSignUpPage";
import SignUpKoiFarmPage from "../pages/AuthenPage/SignUpKoiFarmPage";
import KoiManagementPage from "../pages/KoiPage/KoiManagementPage";
import HomeKoiFarmManagerPage from "../pages/HomePage/HomeKoiFarmManagerPage";
import GuestAuth from "../guards/GuestAuth";
import KoiDetailManagementPage from "../pages/KoiPage/KoiDetailManagementPage";
import CheckOutPage from "../pages/CheckOutPage/CheckOutPage";
import FarmDetailPage from "../pages/FarmPage/FarmDetailPage";
import WaitingCheckoutPage from "../pages/PaymentPage/WaitingCheckoutPage";
import OrderListCustomerPage from "../pages/OrderCustomerPage/OrderListCustomerPage";
import OrderDetailCustomerPage from "../pages/OrderCustomerPage/OrderDetailCustomerPage";
import OrderListFarmPage from "../pages/OrderFarmPage/OrderListFarmPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <GuestAuth><LoginPage /></GuestAuth>,
    errorElement: <Error />,
  },
  {
    path: "/role-signup",
    element: <RoleSignUpPage />,
    errorElement: <Error />,
  }
  ,
  {
    path: "/signup-customer",
    element: <SignUpCustomerPage />,
    errorElement: <Error />,
  }
  ,
  {
    path: "/signup-koi-farm",
    element: <SignUpKoiFarmPage />,
    errorElement: <Error />,
  }
  ,
  {
    path: "/koi-detail",
    element: <KoiDetailPage />,
    errorElement: <Error />,
  },
  {
    path: "/cart",
    element: <RoleBasedGuard accessibleRoles={['Customer']} status="Active"><CartPage /></RoleBasedGuard>,
    errorElement: <Error />,
  },
  {
    path: "/home-koi-farm-manager",
    element: <RoleBasedGuard accessibleRoles={['KoiFarmManager']} status="Active"><HomeKoiFarmManagerPage /></RoleBasedGuard>,
    errorElement: <Error />,
  },
  {
    path: "/koi-management",
    element: <RoleBasedGuard accessibleRoles={['KoiFarmManager']} status="Active"><KoiManagementPage /></RoleBasedGuard>,
    errorElement: <Error />,
  },
  {
    path: "/koi-detail-management",
    element: <RoleBasedGuard accessibleRoles={['KoiFarmManager']} status="Active"><KoiDetailManagementPage /></RoleBasedGuard>,
    errorElement: <Error />,
  },
  {
    path: "/check-out",
    element: <RoleBasedGuard accessibleRoles={['Customer']} status="Active" ><CheckOutPage /></RoleBasedGuard>,
    errorElement: <Error />,
  },
  {
    path: "/farms/:farmId",
    element: <FarmDetailPage />,
    errorElement: <Error />,
  },
  { path: "/waiting-checkout", 
    element: <RoleBasedGuard accessibleRoles={['Customer']} status="Active" ><WaitingCheckoutPage /></RoleBasedGuard>,
    errorElement: <Error/> 
  },
  { path: "/order-history", 
    element: <RoleBasedGuard accessibleRoles={['Customer']} status="Active" ><OrderListCustomerPage /></RoleBasedGuard>,
    errorElement: <Error/> 
  },
  { path: "/order-detail", 
    element: <RoleBasedGuard accessibleRoles={['Customer']} status="Active" ><OrderDetailCustomerPage /></RoleBasedGuard>,
    errorElement: <Error/> 
  },
  { path: "/order-list-farm", 
    element: <RoleBasedGuard accessibleRoles={['KoiFarmManager']} status="Active" ><OrderListFarmPage /></RoleBasedGuard>,
    errorElement: <Error/> 
  }

]);


import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import AdminSideBar from "./Sidebar/AdminSidebar";

const LayoutAdmin = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideBar />
        <div className="flex-1">{children}</div>
      </div>
      <Footer />
    </>
  );
};

export default LayoutAdmin;

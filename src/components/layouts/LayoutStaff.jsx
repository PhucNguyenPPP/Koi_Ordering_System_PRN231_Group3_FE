import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import StaffSidebar from "./Sidebar/StaffSidebar";

const LayoutStaff = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex">
        <StaffSidebar />
        <div className="flex-1">{children}</div>
      </div>
      <Footer />
    </>
  );
};

export default LayoutStaff;

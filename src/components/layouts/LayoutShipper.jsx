import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import ShipperSideBar from "./Sidebar/ShipperSidebar";

const LayoutShipper = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex">
        <ShipperSideBar />
        <div className="flex-1">{children}</div>
      </div>
      <Footer />
    </>
  );
};

export default LayoutShipper;

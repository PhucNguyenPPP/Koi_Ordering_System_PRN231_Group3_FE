import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import KoiFarmManagerSideBar from "../../components/layouts/Sidebar/KoiFarmManagerSidebar";

const LayoutKoiManager = ({ children }) => {
    return (
        <>
            <Header />
            <div className="flex">
                <KoiFarmManagerSideBar />
                <div className="flex-1">
                    {children}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LayoutKoiManager;

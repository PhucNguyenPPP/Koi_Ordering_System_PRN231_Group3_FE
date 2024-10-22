import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import StorageManagerSideBar from "./Sidebar/StorageManagerSidebar";

const LayoutStorageManager = ({ children }) => {
    return (
        <>
            <Header />
            <div className="flex">
                <StorageManagerSideBar />
                <div className="flex-1">
                    {children}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LayoutStorageManager ;

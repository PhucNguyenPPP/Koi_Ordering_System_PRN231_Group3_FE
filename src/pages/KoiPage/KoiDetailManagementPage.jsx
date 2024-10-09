import Footer from "../../components/layouts/Footer/Footer";
import Header from "../../components/layouts/Header/Header";
import KoiFarmManagerSideBar from "../../components/layouts/Sidebar/KoiFarmManagerSidebar";
import KoiDetailManagement from "../../components/partial/KoiDetailManagementPage/KoiDetailManagement";

const KoiDetailManagementPage = () => {
    return (
        <>
            <Header />
            <div className="flex">
                <KoiFarmManagerSideBar />
                <KoiDetailManagement />
            </div>
            <Footer />
        </>
    );
};

export default KoiDetailManagementPage;

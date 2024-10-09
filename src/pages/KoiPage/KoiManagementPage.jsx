import Footer from "../../components/layouts/Footer/Footer";
import Header from "../../components/layouts/Header/Header";
import KoiFarmManagerSideBar from "../../components/layouts/Sidebar/KoiFarmManagerSidebar";
import KoiManagement from "../../components/partial/KoiManagementPage/KoiManagement";

const KoiManagementPage = () => {
    return (
        <>
            <Header />
            <div className="flex">
                <KoiFarmManagerSideBar />
                <KoiManagement />
            </div>
            <Footer />
        </>
    );
};

export default KoiManagementPage;

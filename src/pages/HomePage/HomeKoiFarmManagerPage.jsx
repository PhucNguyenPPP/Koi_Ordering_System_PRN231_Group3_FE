import Footer from "../../components/layouts/Footer/Footer";
import Header from "../../components/layouts/Header/Header";
import KoiFarmManagerSideBar from "../../components/layouts/Sidebar/KoiFarmManagerSidebar";
import HomeKoiFarmManager from "../../components/partial/HomeKoiFarmManagerPage/HomeKoiFarmManager";

const HomeKoiFarmManagerPage = () => {
    return (
        <>
            <Header />
            <div className="flex">
                <KoiFarmManagerSideBar />
                <HomeKoiFarmManager />
            </div>
            <Footer />
        </>
    );
};

export default HomeKoiFarmManagerPage;

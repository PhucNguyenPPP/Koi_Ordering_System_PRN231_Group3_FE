import LayoutStorageManager from "../../components/layouts/LayoutStorageManager";
import HomeStorageManager from "../../components/partial/HomeStoragaeManagerPage/HomeStorageManager";

const HomeStorageManagerPage = () => {
    return (
        <LayoutStorageManager>
            <HomeStorageManager />
        </LayoutStorageManager>
    );
};

export default HomeStorageManagerPage;
import LayoutStorageManager from "../../components/layouts/LayoutStorageManager";
import ShipperManagement from "../../components/partial/ShipperManagementPage/ShipperManagement";

const ShipperManagementPage = () => {
    return (
        <LayoutStorageManager>
            <ShipperManagement />
        </LayoutStorageManager>
    );
};

export default ShipperManagementPage;

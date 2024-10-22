import LayoutKoiManager from "../../components/layouts/LayoutKoiManager";
import OrderListFarm from "../../components/partial/OrderFarmPage/OrderListFarm";
import OrderListStorageManager from "../../components/partial/OrderStorageManagerPage/OrderListStorageManager";

const OrderListStorageManagerPage = () => {
    return (
        <LayoutKoiManager>
            <OrderListStorageManager />
        </LayoutKoiManager>
    );
};

export default  OrderListStorageManagerPage;

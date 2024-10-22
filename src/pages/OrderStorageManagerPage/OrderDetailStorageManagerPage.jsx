import LayoutKoiManager from "../../components/layouts/LayoutKoiManager";
import OrderDetailStorageManager from "../../components/partial/OrderStorageManagerPage/OrderDetailStorageManager";
import OrderListStorageManager from "../../components/partial/OrderStorageManagerPage/OrderListStorageManager";

const OrderDetailStorageManagerPage = () => {
    return (
        <LayoutKoiManager>
            <OrderDetailStorageManager />
        </LayoutKoiManager>
    );
};

export default  OrderDetailStorageManagerPage;

import LayoutStorageManager from "../../components/layouts/LayoutStorageManager";
import OrderListStorageManager from "../../components/partial/OrderStorageManagerPage/OrderListStorageManager";

const OrderListStorageManagerPage = () => {
    return (
        <LayoutStorageManager>
            <OrderListStorageManager />
        </LayoutStorageManager>
    );
};

export default OrderListStorageManagerPage;

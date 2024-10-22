import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import styles from './orderlist.module.scss';
import { GetAllCustomerHistoryOrder } from '../../../api/OrderApi';
import { useNavigate } from 'react-router-dom';

function OrderListCustomer() {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    const formatPriceVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const fetchGetAllCustomerHistoryOrder = async () => {
        const response = await GetAllCustomerHistoryOrder(user.userId)
        if(response.ok){
            const responseData = await response.json();
            setOrders(responseData);
        } else {
            console.log("Error when fetch get all customer history order")
        }

    };

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            fetchGetAllCustomerHistoryOrder();
            setIsLoading(false);
        }
        
    }, [user]);

    const handleCheckDetail = (orderId) => {
        navigate('/order-detail', { state: { orderId } });
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className={styles.backgroundContainer}>
            {orders && orders.map((order) => (
                <div key={order.orderId} className={styles.sectionItemContainer}>
                    {/* Header của item */}
                    <div className={styles.itemHeader}>
                        <div className={styles.shopName}>{order.farmName}</div>
                        <div className={styles.orderStatus}>{order.status}</div>
                    </div>

                    {/* Nội dung chính của item */}
                    <div className={styles.itemBody}>
                        {order.kois && order.kois.map((koi, index) => (
                            <div key={index} className={styles.fishList}>
                                <img
                                    className={styles.fishImage}
                                    src={koi.avatarLink}
                                    alt={koi.name}
                                />
                                <div className={styles.fishDetails}>
                                    <div className={styles.fishName}>{koi.name}</div>
                                    <div className={styles.fishPrice}>{formatPriceVND(koi.price)}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer của item */}
                    <div className={styles.itemFooter}>
                        <div className={styles.totalPrice}>
                            Order Total: <span style={{ color: '#C71125' }}>{formatPriceVND(order.totalPrice)}</span>
                        </div>
                    </div>
                    <button className={styles.checkDetailsBtn} onClick={() => handleCheckDetail(order.orderId)}>
                        Check Details
                    </button>
                </div>
            ))}
        </div>
    );
}

export default OrderListCustomer;

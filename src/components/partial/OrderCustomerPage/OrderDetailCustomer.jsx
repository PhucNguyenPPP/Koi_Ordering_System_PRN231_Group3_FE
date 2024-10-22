import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { GetOrderDetail } from '../../../api/OrderApi';
import styles from './order-detail.module.scss';
import dayjs from 'dayjs';

function OrderDetailCustomer() {
    const [isLoading, setIsLoading] = useState(false);
    const [orderDetail, setOrderDetail] = useState(null);
    const { user } = useAuth();
    const location = useLocation();
    const { orderId } = location.state || {};

    const formatPriceVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).format('DD-MM-YYYY HH:mm');
    };

    const fetchGetOrderDetail = async () => {
        const response = await GetOrderDetail(orderId)
        if (response.ok) {
            const responseData = await response.json();
            setOrderDetail(responseData.result);
        } else {
            console.log("Error when fetch get order detail")
        }

    };

    useEffect(() => {
        if (orderId) {
            setIsLoading(true);
            fetchGetOrderDetail();
            setIsLoading(false);
        }
    }, [orderId]);



    if (isLoading || !orderId) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className={styles.backgroundContainer}>
            {orderDetail && (
                <div key={orderDetail.orderId} className={styles.sectionItemContainer}>
                    {/* Header của item */}
                    <div className={styles.itemHeader}>
                        <div className={styles.shopName}>{orderDetail.farmName}</div>
                        <div className={styles.orderStatus}>{orderDetail.status}</div>
                    </div>

                    {/* Nội dung chính của item */}
                    <div className={styles.itemBody}>
                        {orderDetail.kois && orderDetail.kois.map((koi, index) => (
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
                    <div className={styles.footer}>
                    <div className={styles.footerItem}>
                            <span className={styles.label}>Order ID:</span>
                            <span className={styles.value}>{orderDetail.orderNumber}</span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Created Date:</span>
                            <span className={styles.value}>{formatDate(orderDetail.createdDate)}</span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Phone:</span>
                            <span className={styles.value}>{orderDetail.phone}</span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Address:</span>
                            <span className={styles.value}>{orderDetail.address}</span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Province:</span>
                            <span className={styles.value}>{orderDetail.customerProvince}</span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Shipping Fee:</span>
                            <span className={styles.value}>{formatPriceVND(orderDetail.shippingFee)}</span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Order Total:</span>
                            <span style={{color: '#C71125', fontWeight: 'bold', fontSize: '18px'}}>{formatPriceVND(orderDetail.totalPrice)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderDetailCustomer;

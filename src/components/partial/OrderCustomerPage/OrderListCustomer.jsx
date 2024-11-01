import React, { useEffect, useState } from 'react';
import { CircularProgress, Pagination } from '@mui/material';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import styles from './orderlist.module.scss';
import { GetAllCustomerHistoryOrder } from '../../../api/OrderApi';
import { useNavigate } from 'react-router-dom';

function OrderListCustomer() {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalPage, setTotalPage] = useState(0);
    const { user } = useAuth();
    const navigate = useNavigate();

    const formatPriceVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const fetchGetAllCustomerHistoryOrder = async () => {
        const response = await GetAllCustomerHistoryOrder(user.userId, currentPage, rowsPerPage)
        if (response.ok) {
            const responseData = await response.json();
            setOrders(responseData.value);
            setTotalPage(Math.ceil(responseData['@odata.count'] / rowsPerPage));
        } else {
            setCurrentPage(1);
            setTotalPage(0);
            console.log("Error when fetch get all customer history order")
        }

    };

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            fetchGetAllCustomerHistoryOrder();
            setIsLoading(false);
        }

    }, [user, currentPage]);

    const handleCheckDetail = (orderId) => {
        navigate('/order-detail', { state: { orderId } });
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
                <CircularProgress />
            </div>
        );
    }

    if (orders && orders.length == 0) {
        return (
            <div className={styles.backgroundContainer}>
                <div className={styles.sectionItemContainer}>
                    <p className="text-center text-red-700 text-3xl p-5 font-semibold">
                        No Order Found
                    </p>
                </div>
            </div>
        )

    }

    return (
        <div className={styles.backgroundContainer}>
            {orders && orders.map((order) => (
                <div key={order.OrderId} className={styles.sectionItemContainer}>
                    {/* Header của item */}
                    <div className={styles.itemHeader}>
                        <div className={styles.shopName}>{order.OrderNumber}</div>
                        <div className={styles.orderStatus}>{order.Status}</div>
                    </div>

                    {/* Nội dung chính của item */}
                    <div className={styles.itemBody}>
                        {order.Kois && order.Kois.map((koi, index) => (
                            <div key={index} className={styles.fishList}>
                                <img
                                    className={styles.fishImage}
                                    src={koi.AvatarLink}
                                    alt={koi.Name}
                                />
                                <div className={styles.fishDetails}>
                                    <div>
                                        <div className={styles.fishName}>{koi.Name}</div>
                                        <div className={styles.fishName}>Farm: <span className='font-normal'>{order.FarmName}</span></div>
                                        <div className={styles.fishName}>Breed: <span className='font-normal'>{koi.BreedName.join(', ')}</span></div>
                                        <div className={styles.fishName}>Age: <span className='font-normal'>{koi.Age}</span></div>
                                        <div className={styles.fishName}>Weight: <span className='font-normal'>{koi.Weight} kg</span></div>
                                    </div>
                                    <div className={styles.fishPrice}>{formatPriceVND(koi.Price)}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer của item */}
                    <div className={styles.itemFooter}>
                        <div className={styles.totalPrice}>
                            Order Total: <span style={{ color: '#C71125' }}>{formatPriceVND(order.TotalPrice)}</span>
                        </div>
                    </div>
                    <button className={styles.checkDetailsBtn} onClick={() => handleCheckDetail(order.OrderId)}>
                        Check Details
                    </button>
                </div>
            ))}
            <div className='flex justify-center mt-5'>
                <Pagination
                    page={currentPage}
                    onChange={handlePageChange}
                    count={totalPage}
                />
            </div>
        </div>
    );
}

export default OrderListCustomer;

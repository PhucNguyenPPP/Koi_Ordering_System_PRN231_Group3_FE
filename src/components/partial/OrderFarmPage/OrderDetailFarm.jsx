import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { GetOrderDetail, PackOrder } from '../../../api/OrderApi';
import styles from './order-detail-farm.module.scss';
import dayjs from 'dayjs';

function OrderDetailFarm() {
    const [isLoading, setIsLoading] = useState(false);
    const [orderDetail, setOrderDetail] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); // State để mở Dialog
    const { user } = useAuth();
    const location = useLocation();
    const { orderId } = location.state || {};

    const { control, handleSubmit, reset, formState: { errors } } = useForm();

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

    const handlePackOrder = async (data) => {
        setIsLoading(true);
        const dataJson = {
            length: data.length,
            width: data.width,
            height: data.height,
            weight: data.weight
        }
        const response = await PackOrder(dataJson, orderId)
        if (response.ok) {
            toast.success('Pack order successfully');
            fetchGetOrderDetail();
        } else {
            toast.error('Pack order failed');
        }
        setOpenDialog(false);
        reset();
        setIsLoading(false);
    };

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
                        <div className={styles.shopName}>{orderDetail.customerName}</div>
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
                            <span className={styles.label}>OrderId:</span>
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

                        {orderDetail.length && (
                            <>
                                <div className={styles.footerItem}>
                                    <span className={styles.label}>Length:</span>
                                    <span className={styles.value}>{orderDetail.length} cm</span>
                                </div>
                                <div className={styles.footerItem}>
                                    <span className={styles.label}>Width:</span>
                                    <span className={styles.value}>{orderDetail.width} cm</span>
                                </div>
                                <div className={styles.footerItem}>
                                    <span className={styles.label}>Height:</span>
                                    <span className={styles.value}>{orderDetail.height} cm</span>
                                </div>
                                <div className={styles.footerItem}>
                                    <span className={styles.label}>Weight:</span>
                                    <span className={styles.value}>{orderDetail.weight} kg</span>
                                </div>
                            </>
                        )}

                        <div className={styles.footerItem}>
                            <span className={styles.label}>Shipping Fee:</span>
                            <span className={styles.value}>{formatPriceVND(orderDetail.shippingFee)}</span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Order Total:</span>
                            <span style={{ color: '#C71125', fontWeight: 'bold', fontSize: '18px' }}>{formatPriceVND(orderDetail.totalPrice)}</span>
                        </div>
                        {orderDetail.status == "Processing" && (
                            <div>
                                <Button
                                    style={{ backgroundColor: '#C71125', color: 'white', marginTop: '10px' }}
                                    onClick={() => setOpenDialog(true)}
                                >
                                    Pack Order
                                </Button>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* Dialog để nhập kích thước */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Pack Order</DialogTitle>
                <DialogContent style={{ paddingTop: '10px' }}>
                    <form onSubmit={handleSubmit(handlePackOrder)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', gap: '10px' }}>
                            <Controller
                                name="length"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Please input length',
                                    min: {
                                        value: 1,
                                        message: 'Length must be at least 1'
                                    }
                                }}

                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Length (cm)"
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.length}
                                        helperText={errors.length?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="width"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Please input width',
                                    min: {
                                        value: 1,
                                        message: 'Width must be at least 1'
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Width (cm)"
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.width}
                                        helperText={errors.width?.message}
                                    />
                                )}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                            <Controller
                                name="height"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Please input height',
                                    min: {
                                        value: 1,
                                        message: 'Height must be at least 1'
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Height (cm)"
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.height}
                                        helperText={errors.height?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="weight"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Please input weight',
                                    min: {
                                        value: 1,
                                        message: 'Weight must be at least 1'
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Weight (kg)"
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.weight}
                                        helperText={errors.weight?.message}
                                    />
                                )}
                            />
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" style={{ backgroundColor: '#C71125', color: 'white' }} onClick={handleSubmit(handlePackOrder)}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default OrderDetailFarm;

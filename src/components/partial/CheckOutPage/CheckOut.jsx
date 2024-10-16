import { useState } from "react";
import { CircularProgress, Paper, Typography, Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import styles from './checkout.module.scss';
import { GetStorageProvinceVietNam } from "../../../api/StorageProvinceApi";
import { useEffect } from "react";
import { GetShippingFeebyStorageProvinceIds } from "../../../api/ShippingFeeApi";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { CreateOrder } from "../../../api/OrderApi";
import { CreatePaymentUrl } from "../../../api/PaymentApi";

function CheckOut() {
    const [isLoading, setIsLoading] = useState(false);
    const [storageProvinceVietNam, setStorageProvinceVietNam] = useState([]);
    const [shippingFee, setShippingFee] = useState(0);
    const location = useLocation();
    const { kois } = location.state || {};
    const { user } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm();


    const formatPriceVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Tính tổng giá cá
    const calculateTotalFishPrice = () => {
        return kois.reduce((total, koi) => total + Number(koi.price), 0);
    };

    // Tính tổng giá đơn hàng (bao gồm giá ship)
    const calculateTotalOrderPrice = () => {
        return calculateTotalFishPrice() + shippingFee;
    };

    const onSubmit = async (data) => {
        if (user) {
            const response = await CreateOrder(data, user.userId, kois)
            if (response.ok) {
                const responseData = await response.json();
                toast.success("Create order successfully");
                setTimeout(() => {
                }, 1000);

                const fetchCreatePaymentUrl = async () => {
                    const response = await CreatePaymentUrl(responseData.result);
                    const responseDataCreateUrl = await response.json();
                    if (response.ok) {
                        setIsLoading(false);
                        window.location.href = responseDataCreateUrl.result;
                    } else {
                        toast.error("Create payment link failed");
                    }
                };

                fetchCreatePaymentUrl();
            } else {
                toast.error("Create order failed");
            }
        }
    };

    const handleChooseStorageProvinceVietnam = async (event) => {
        const selectedId = event.target.value;
        const response = await GetShippingFeebyStorageProvinceIds(kois[0].storageProvinceJapanId, selectedId);
        const responseData = await response.json();
        if (response.ok) {
            setShippingFee(responseData.result);
        } else if (response.status === 404) {
            setShippingFee(0);
        } else {
            toast.error("Fetch shipping fee failed: " + responseData.message);
        }
    };

    useEffect(() => {
        const fetchProvinceStorageVietNam = async () => {
            const response = await GetStorageProvinceVietNam();
            const responseData = await response.json();
            if (response.ok) {
                setStorageProvinceVietNam(responseData.result);
            } else if (response.status === 404) {
                setStorageProvinceVietNam([]);
            } else {
                toast.error("Fetch province failed: " + responseData.message);
            }
        }

        fetchProvinceStorageVietNam();
    }, [kois])

    if (!kois || !user) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className={styles.checkOutPage}>
            {/* Section danh sách sản phẩm */}
            <Paper className={styles.section} elevation={3}>
                <Box display="flex" alignItems="center" padding={1}>
                    <Typography variant="h6" style={{ flex: 2, fontWeight: 'bold' }}>Product</Typography>
                    <Typography variant="h6" style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Farm</Typography>
                    <Typography variant="h6" style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Price</Typography>
                </Box>
            </Paper>

            {kois && kois.length > 0 && kois.map((koi) => (
                <Paper key={koi.cartId} className={styles.section} elevation={2}>
                    <Box display="flex" alignItems="center" padding={1}>
                        <Box display="flex" alignItems="center" flex={2}>
                            <img src={koi.koiAvatar} alt={koi.koiName}
                                style={{ width: '120px', height: '200px', marginRight: '10px' }} />
                            <Typography
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '20px',
                                    paddingLeft: '10px'
                                }} variant="body1">{koi.koiName}
                            </Typography>
                        </Box>
                        <Typography variant="body1" style={{ flex: 1, textAlign: 'right' }}>{koi.farmName}</Typography>
                        <Typography variant="body1" style={{ flex: 1, textAlign: 'right', color: '#C71125', fontWeight: 'bold' }}>{formatPriceVND(koi.price)}</Typography>
                    </Box>
                </Paper>
            ))}

            <Paper className={styles.section} elevation={3}>
                <Box padding={2}>
                    <Typography variant="body1" style={{ marginBottom: '10px', textAlign: 'right' }}>
                        Merchandise Subtotal: <span style={{ fontWeight: 'bold', color: '#C71125' }}>{formatPriceVND(calculateTotalFishPrice())}</span>
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: '10px', textAlign: 'right' }}>
                        Shipping Total: <span style={{ fontWeight: 'bold', color: '#C71125' }}>{formatPriceVND(shippingFee)}</span>
                    </Typography>
                    <Typography variant="h6" style={{ fontWeight: 'bold', color: '#C71125', textAlign: 'right' }}>
                        Total Payment: <span>{formatPriceVND(calculateTotalOrderPrice())}</span>
                    </Typography>
                </Box>
            </Paper>


            <Paper className={styles.section} elevation={3}>
                <Box padding={2}>
                    <Typography variant="h6" style={{ marginBottom: '20px', fontWeight: 'bold' }}>Shipping Information</Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: "Phone number is required",
                                pattern: {
                                    value: /^0\d{9}$/,
                                    message: 'Phone number is invalid',
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Phone Number"
                                    variant="outlined"
                                    error={!!errors.phone}
                                    helperText={errors.phone ? errors.phone.message : ''}
                                    style={{ marginBottom: '20px' }}
                                />
                            )}
                        />
                        <Controller
                            name="address"
                            control={control}
                            defaultValue=""
                            rules={{ required: "Address is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Address"
                                    variant="outlined"
                                    error={!!errors.address}
                                    helperText={errors.address ? errors.address.message : ''}
                                    style={{ marginBottom: '20px' }}
                                />
                            )}
                        />

                        {storageProvinceVietNam
                            && storageProvinceVietNam.length > 0
                            && (
                                <Controller
                                    name="province"
                                    control={control}
                                    rules={{
                                        required: 'Please select a province',
                                    }}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.province} margin="normal" variant="outlined">
                                            <InputLabel id="province">Province</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="province"
                                                label="Province"
                                                onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                    handleChooseStorageProvinceVietnam(e);
                                                }}
                                                value={field.value}
                                            >
                                                {storageProvinceVietNam.map((i) => (
                                                    <MenuItem key={i.storageProvinceId} value={i.storageProvinceId}>{i.provinceName} </MenuItem>
                                                ))}

                                            </Select>
                                            {errors.province && (
                                                <FormHelperText style={{ color: 'red' }}>{errors.province.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            )}

                        <Button
                            variant="contained"

                            type="submit"
                            fullWidth
                            style={{ backgroundColor: "#C71125"}}
                        >
                            {isLoading ? (
                                <>
                                    <CircularProgress size={24} sx={{ position: 'absolute' }} />
                                    <span style={{ visibility: 'hidden' }}>CHECK OUT</span>
                                </>
                            ) : (
                                'CHECK OUT'
                            )}
                        </Button>
                    </form>
                </Box>
            </Paper>
        </div>
    );
}

export default CheckOut;

import React, { useEffect, useState } from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import {
    CompleteRefund,
    GetDeliveryOfOrder,
    GetOrderDetail,
    ProcessRefund,
} from "../../../api/OrderApi";
import styles from "./refund-order-detail.module.scss";
import dayjs from "dayjs";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';


function RefundOrderDetail() {
    const [isLoading, setIsLoading] = useState(false);
    const [orderDetail, setOrderDetail] = useState(null);
    const [orderDeliveryList, setOrderDeliveryList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogRefundData, setOpenDialogRefundData] = useState(false);
    const [isAccept, setIsAccept] = useState("");
    const { user } = useAuth();
    const location = useLocation();
    const { orderId } = location.state || {};

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const formatPriceVND = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).format("DD-MM-YYYY HH:mm");
    };

    const fetchGetOrderDetail = async () => {
        const response = await GetOrderDetail(orderId);
        if (response.ok) {
            const responseData = await response.json();
            setOrderDetail(responseData.result);
        } else {
            console.log("Error when fetch get refund order detail");
        }
    };

    const fetchGetDeliveryOfOrder = async () => {
        const response = await GetDeliveryOfOrder(orderId);
        if (response.ok) {
            const responseData = await response.json();
            setOrderDeliveryList(responseData.result);
        } else {
            console.log("Error when fetch get delivery of order");
        }
    };

    useEffect(() => {
        if (orderId) {
            setIsLoading(true);
            fetchGetOrderDetail();
            fetchGetDeliveryOfOrder();
            setIsLoading(false);
        }
    }, [orderId]);

    const handleConfirm = async (data) => {
        if (isAccept === "") {
            toast.error("Please choose accept or deny")
            return;
        }
        const dataJson = {
            orderId: orderDetail.orderId,
            refundResponse: data.refundResponse,
            action: isAccept
        };
        setIsLoading(true);
        const response = await ProcessRefund(dataJson);
        const responseData = await response.json();
        if (response.ok) {
            toast.success("Confirm refund successfully");
            fetchGetOrderDetail();
            fetchGetDeliveryOfOrder();
        } else {
            toast.error("Confirm refund failed: " + responseData.message);
        }
        setOpenDialog(false);
        reset();
        setIsLoading(false);
    };

    const handleCompletedRefund = async () => {
        setIsLoading(true);
        const dataJson = {
            orderId: orderDetail.orderId
        }
        const response = await CompleteRefund(dataJson);
        const responseData = await response.json();
        if (response.ok) {
            toast.success("Confirm completed refund successfully");
            fetchGetOrderDetail();
            fetchGetDeliveryOfOrder();
        } else {
            toast.error("Confirm completed refund failed: " + responseData.message);
        }
        setIsLoading(false);
    }



    if (isLoading || !orderId) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.sectionItemContainer}>
                <div className={styles.itemHeader}>
                    <div className={styles.shopName}>Delivery</div>
                </div>
                <div className="flex overflow-auto">
                    {orderDeliveryList && orderDeliveryList.length > 0 ? (
                        orderDeliveryList.map((delivery, index) => (
                            <div key={index} className={styles.listItem}>
                                <div className={styles.descriptionContainer}>
                                    <p className={styles.description}>
                                        {delivery.status}
                                        {index < orderDeliveryList.length - 1 && (
                                            <ArrowRightAltIcon style={{ marginLeft: "50px" }} />
                                        )}
                                    </p>
                                    <p className={styles.time}>
                                        {dayjs(delivery.arrivalTime).format("DD-MM-YYYY HH:mm")}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="pb-5 text-center text-3xl">
                            The order is being prepared
                        </p>
                    )}
                </div>
            </div>

            {orderDetail && (
                <div key={orderDetail.orderId} className={styles.sectionItemContainer}>
                    {/* Header của item */}
                    <div className={styles.itemHeader}>
                        <div className={styles.shopName}>{orderDetail.customerName}</div>
                        <div className={styles.orderStatus}>{orderDetail.status}</div>
                    </div>

                    {/* Nội dung chính của item */}
                    <div className={styles.itemBody}>
                        {orderDetail.kois &&
                            orderDetail.kois.map((koi, index) => (
                                <div key={index} className={styles.fishList}>
                                    <div>
                                        <img
                                            className={styles.fishImage}
                                            src={koi.avatarLink}
                                            alt={koi.name}
                                        />
                                    </div>

                                    <div className={styles.fishDetails}>
                                        <div>
                                            <div className={styles.fishName}>{koi.Name}</div>
                                            <div className={styles.fishName}>Farm: <span className='font-normal'>{orderDetail.farmName}</span></div>
                                            <div className={styles.fishName}>Breed: <span className='font-normal'>{koi.breedName.join(', ')}</span></div>
                                            <div className={styles.fishName}>Age: <span className='font-normal'>{koi.age}</span></div>
                                            <div className={styles.fishName}>Weight: <span className='font-normal'>{koi.weight} kg</span></div>
                                        </div>
                                        <div className={styles.fishPrice}>
                                            {formatPriceVND(koi.price)}
                                        </div>
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
                            <span className={styles.value}>
                                {formatDate(orderDetail.createdDate)}
                            </span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Customer Phone:</span>
                            <span className={styles.value}>{orderDetail.phone}</span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Customer Address:</span>
                            <span className={styles.value}>{orderDetail.address}</span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Customer Province:</span>
                            <span className={styles.value}>
                                {orderDetail.customerProvince}
                            </span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Koi Farm:</span>
                            <span className={styles.value}>{orderDetail.farmName}</span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Koi Farm Phone:</span>
                            <span className={styles.value}>{orderDetail.farmPhone}</span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Koi Farm Address:</span>
                            <span className={styles.value}>{orderDetail.farmAddress}</span>
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
                            <span className={styles.label}>Japanese Shipper:</span>
                            <span className={styles.value}>
                                {orderDetail.japaneseShipper ?? "Not assign"}
                            </span>
                        </div>

                        <div className={styles.footerItem}>
                            <span className={styles.label}>Vietnamese Shipper:</span>
                            <span className={styles.value}>
                                {orderDetail.vietnameseShipper ?? "Not assign"}
                            </span>
                        </div>

                        <div className={styles.footerItem}>
                            <span className={styles.label}>Flight Code:</span>
                            <span className={styles.value}>
                                {orderDetail.flightCode ?? "Not assign"}
                            </span>
                        </div>

                        <div className={styles.footerItem}>
                            <span className={styles.label}>Airline:</span>
                            <span className={styles.value}>
                                {orderDetail.airline ?? "Not assign"}
                            </span>
                        </div>

                        <div className={styles.footerItem}>
                            <span className={styles.label}>Departure Date:</span>
                            <span className={styles.value}>
                                {orderDetail.departureDate == null ? "Not assign" : dayjs(orderDetail.departureDate).format('DD-MM-YYYY HH:mm')}
                            </span>
                        </div>

                        <div className={styles.footerItem}>
                            <span className={styles.label}>Arrival Date:</span>
                            <span className={styles.value}>
                                {orderDetail.arrivalDate == null ? "Not assign" : dayjs(orderDetail.arrivalDate).format('DD-MM-YYYY HH:mm')}
                            </span>
                        </div>

                        <div className={styles.footerItem}>
                            <span className={styles.label}>Departure Airport:</span>
                            <span className={styles.value}>
                                {orderDetail.departureAirport ?? "Not assign"}
                            </span>
                        </div>

                        <div className={styles.footerItem}>
                            <span className={styles.label}>Arrival  Airport:</span>
                            <span className={styles.value}>
                                {orderDetail.arrivalAirport ?? "Not assign"}
                            </span>
                        </div>

                        <div className={styles.footerItem}>
                            <span className={styles.label}>Shipping Fee:</span>
                            <span className={styles.value}>
                                {formatPriceVND(orderDetail.shippingFee)}
                            </span>
                        </div>
                        <div className={styles.footerItem}>
                            <span className={styles.label}>Order Total:</span>
                            <span
                                style={{
                                    color: "#C71125",
                                    fontWeight: "bold",
                                    fontSize: "18px",
                                }}
                            >
                                {formatPriceVND(orderDetail.totalPrice)}
                            </span>
                        </div>

                        {(orderDetail.status === "Processing Refund"
                            || orderDetail.status === "Accepted Refund"
                            || orderDetail.status === "Denied Refund"
                            || orderDetail.status === "Completed Refund"
                        ) && (
                                <Button
                                    style={{
                                        backgroundColor: "#DD7D01",
                                        color: "white",
                                        marginTop: "10px",
                                    }}
                                    onClick={() => setOpenDialogRefundData(true)}
                                >
                                    View Refund Request
                                </Button>
                            )}

                        {orderDetail.status == "Processing Refund" && (
                            <div>
                                <Button
                                    style={{
                                        backgroundColor: "#C71125",
                                        color: "white",
                                        marginTop: "10px",
                                    }}
                                    onClick={() => setOpenDialog(true)}
                                >
                                    Confirm Refund
                                </Button>
                            </div>
                        )}

                        {orderDetail.status == "Accepted Refund" && (
                            <div>
                                <Button
                                    style={{
                                        backgroundColor: "#C71125",
                                        color: "white",
                                        marginTop: "10px",
                                    }}
                                    onClick={() => handleCompletedRefund()}
                                >
                                    Confirm Completed Refund
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Dialog để nhập kích thước */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
                <DialogTitle>Confirm Refund</DialogTitle>
                <DialogContent style={{ paddingTop: "10px" }}>
                    <form onSubmit={handleSubmit(handleSubmit)}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "16px",
                                gap: "10px",
                            }}
                        >
                            <Controller
                                name="refundResponse"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: "Please input refund response",
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Refund Response"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={5}
                                        error={!!errors.refundResponse}
                                        helperText={errors.refundResponse?.message}
                                    />
                                )}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "10px",
                            }}
                        >
                            <RadioGroup
                                row
                                value={isAccept}
                                onChange={(e) => setIsAccept(e.target.value)}
                            >
                                <FormControlLabel
                                    value="accept"
                                    control={<Radio />}
                                    label="Accept"
                                />
                                <FormControlLabel
                                    value="deny"
                                    control={<Radio />}
                                    label="Deny"
                                />
                            </RadioGroup>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        style={{ backgroundColor: "#C71125", color: "white" }}
                        onClick={handleSubmit(handleConfirm)}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {orderDetail && (
                <Dialog open={openDialogRefundData} onClose={() => setOpenDialogRefundData(false)} fullWidth>
                    <DialogTitle>Refund Data</DialogTitle>
                    <DialogContent style={{ paddingTop: "10px" }}>
                        <Typography variant="body1"><span className="font-bold">Policy Name:</span> {orderDetail.refundPolicy.policyName}</Typography>
                        <Typography variant="body1"><span className="font-bold">Description:</span> {orderDetail.refundPolicy.description}</Typography>
                        <Typography variant="body1"><span className="font-bold">Percentage Refund:</span> {orderDetail.refundPolicy.percentageRefund}%</Typography>
                        <Typography variant="body1"><span className="font-bold">Refund Description:</span> {orderDetail.refundDescription}</Typography>
                        <Typography variant="body1"><span className="font-bold">Percentage Refund:</span> {orderDetail.bankAccount}</Typography>
                        <Box mt={2}>
                            {orderDetail.refundRequestMedia.map(media => (
                                <img key={media.refundRequestMediaId} src={media.link} alt="Refund Media" style={{ width: '100%', marginBottom: '10px' }} />
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialogRefundData(false)} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

        </div>
    );
}

export default RefundOrderDetail;

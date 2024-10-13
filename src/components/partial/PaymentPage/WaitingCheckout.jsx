import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { HandlePaymentResponse } from "../../../api/PaymentApi";

function WaitingCheckout() {
    const { user } = useAuth();
    const [paymentStatus, setPaymentStatus] = useState("pending");

    useEffect(() => {
        const queryParams = window.location.search;
        const cleanQuery = queryParams.replace("?", "");
        const urlParams = new URLSearchParams(cleanQuery);
        const vnp_OrderInfo = urlParams.get("vnp_OrderInfo");
        const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");
        const vnp_TransactionNo = urlParams.get("vnp_TransactionNo");
        const vnp_TxnRef = urlParams.get("vnp_TxnRef");

        const processPayment = async () => {
            const isSuccess = vnp_ResponseCode === "00";
            const status = isSuccess ? "success" : "fail";
            const data = {
                orderNumber: vnp_TxnRef,
                transactionInfo: vnp_OrderInfo,
                transactionNumber: vnp_TransactionNo,
                isSuccess: isSuccess
            };

            if (user?.userId) {
                try {
                    const postMethod = await HandlePaymentResponse(data);
                    if (postMethod.ok) {
                        const responseData = await postMethod.json();
                        if (responseData.statusCode === 201) {
                            if (isSuccess) {
                                toast.success("Pay order successfuly");
                                setTimeout({}, 2000)
                            } else {
                                toast.error("Pay order failed");
                            }
                        } else {
                            console.log(responseData.message);
                        }
                    } else {
                        console.log("There was an error processing");
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("An unexpected error occurred");
                }
            }

            setPaymentStatus(status);
        };

        processPayment();
    }, [user]);

    return (
        <Container style={{ width: '100%', textAlign: "center", marginTop: '100px', maxHeight:'max-content', minHeight:'100vh' }}>
            {paymentStatus === "success" && (
                <Box className="status-payment flex justify-center">
                    <Alert severity="success" style={{ fontSize: "35px", display: "flex", alignItems: "center" }}>
                        Payment successful
                    </Alert>
                </Box>
            )}

            {paymentStatus === "fail" && (
                <Box className="status-payment flex justify-center">
                    <Alert severity="error" style={{ fontSize: "35px", display: "flex", alignItems: "center" }}>
                        Payment failed
                    </Alert>
                </Box>
            )}

            <Box className="buttonLoading" marginTop={4}>
                <Box className="buttonItem" marginBottom={2}>
                    <Link to="/">
                        <Button variant="contained">Back Home</Button>
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}

export default WaitingCheckout;

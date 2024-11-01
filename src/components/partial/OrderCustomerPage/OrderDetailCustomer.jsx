import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { ConfirmOrderCustomer, GetDeliveryOfOrder, GetOrderDetail } from "../../../api/OrderApi";
import styles from "./order-detail.module.scss";
import dayjs from "dayjs";
import CircleIcon from "@mui/icons-material/Circle";
import { CreatePaymentUrl } from "../../../api/PaymentApi";

function OrderDetailCustomer() {
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderDeliveryList, setOrderDeliveryList] = useState([]);
  const { user } = useAuth();
  const location = useLocation();
  const { orderId } = location.state || {};

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
      console.log("Error when fetch get order detail");
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

  const handleConfirmOrderCustomer = async () => {
    setIsLoading(true);
    const response = await ConfirmOrderCustomer(orderId);
    if (response.ok) {
      toast.success("Confirm completed successfully");
    } else {
      toast.error("Confirm completed failed");
    }
    fetchGetOrderDetail();
    fetchGetDeliveryOfOrder();
    setIsLoading(false);
  };

  const handlePayment = async () => {
    const fetchCreatePaymentUrl = async () => {
      const response = await CreatePaymentUrl(orderId);
      const responseDataCreateUrl = await response.json();
      if (response.ok) {
        setIsLoading(false);
        window.location.href = responseDataCreateUrl.result;
      } else {
        toast.error("Create payment link failed");
      }
    };

    setIsLoading(true);
    fetchCreatePaymentUrl();
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
        {orderDeliveryList && orderDeliveryList.length > 0 ? (
          orderDeliveryList.map((delivery, index) => (
            <div key={index} className={styles.listItem}>
              <span className={styles.dotIcon}>
                <CircleIcon style={{ fontSize: "15px" }} />
              </span>
              <div className={styles.descriptionContainer}>
                <p className={styles.description}>{delivery.status}</p>
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

      {orderDetail && (
        <div key={orderDetail.orderId} className={styles.sectionItemContainer}>
          {/* Header của item */}
          <div className={styles.itemHeader}>
            <div className={styles.shopName}>{orderDetail.farmName}</div>
            <div className={styles.orderStatus}>{orderDetail.status}</div>
          </div>

          {/* Nội dung chính của item */}
          <div className={styles.itemBody}>
            {orderDetail.kois &&
              orderDetail.kois.map((koi, index) => (
                <div key={index} className={styles.fishList}>
                  <img
                    className={styles.fishImage}
                    src={koi.avatarLink}
                    alt={koi.name}
                  />
                  <div className={styles.fishDetails}>
                    <div className={styles.fishName}>{koi.name}</div>
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
              <span className={styles.label}>Phone:</span>
              <span className={styles.value}>{orderDetail.phone}</span>
            </div>
            <div className={styles.footerItem}>
              <span className={styles.label}>Address:</span>
              <span className={styles.value}>{orderDetail.address}</span>
            </div>
            <div className={styles.footerItem}>
              <span className={styles.label}>Province:</span>
              <span className={styles.value}>
                {orderDetail.customerProvince}
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

            {orderDetail.status === "Unpaid" && (
              <div>
                <Button
                  style={{
                    backgroundColor: "#C71125",
                    color: "white",
                    marginTop: "10px",
                    padding: "5px 20px",
                  }}
                  onClick={() => handlePayment()}
                >
                  Paid
                </Button>
              </div>
            )}

            {orderDetail.status === "To Receive" && (
              <div>
                <Button
                  style={{
                    backgroundColor: "#C71125",
                    color: "white",
                    marginTop: "10px",
                    padding: "10px 30px",
                  }}
                  onClick={() => handleConfirmOrderCustomer()}
                >
                  Confirm Order
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetailCustomer;

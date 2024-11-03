import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import {
  ConfirmArrived,
  GetDeliveryOfOrder,
  GetOrderDetail,
} from "../../../api/OrderApi";
import styles from "./order-detail-shipper.module.scss";
import dayjs from "dayjs";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';


function OrderDetailShipper() {
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

  const handleConfirmArrivingStorage = async () => {
    const data = {
      orderId: orderId,
      shipperId: user.userId,
    };
    setIsLoading(true);
    const response = await ConfirmArrived(data);
    const responseData = await response.json();
    if (response.ok) {
      toast.success("Confirm successfully");
    } else {
      toast.error(responseData.message);
    }
    fetchGetOrderDetail();
    fetchGetDeliveryOfOrder();
    setIsLoading(false);
  };

  const handleConfirmArrivingJapanAirport = async () => {
    const data = {
      orderId: orderId,
      shipperId: user.userId,
    };
    setIsLoading(true);
    const response = await ConfirmArrived(data);
    const responseData = await response.json();
    if (response.ok) {
      toast.success("Confirm successfully");
    } else {
      toast.error(responseData.message);
    }
    fetchGetOrderDetail();
    fetchGetDeliveryOfOrder();
    setIsLoading(false);
  };

  const handleConfirmArrivingVietnamAirport = async () => {
    const data = {
      orderId: orderId,
      shipperId: user.userId,
    };
    setIsLoading(true);
    const response = await ConfirmArrived(data);
    const responseData = await response.json();
    if (response.ok) {
      toast.success("Confirm successfully");
    } else {
      toast.error(responseData.message);
    }
    fetchGetOrderDetail();
    fetchGetDeliveryOfOrder();
    setIsLoading(false);
  };

  const handleConfirmArrivingVietnamStorage = async () => {
    const data = {
      orderId: orderId,
      shipperId: user.userId,
    };
    setIsLoading(true);
    const response = await ConfirmArrived(data);
    const responseData = await response.json();
    if (response.ok) {
      toast.success("Confirm successfully");
    } else {
      toast.error(responseData.message);
    }
    fetchGetOrderDetail();
    fetchGetDeliveryOfOrder();
    setIsLoading(false);
  };

  const handleConfirmArrivingCustomer = async () => {
    const data = {
      orderId: orderId,
      shipperId: user.userId,
    };
    setIsLoading(true);
    const response = await ConfirmArrived(data);
    const responseData = await response.json();
    if (response.ok) {
      toast.success("Confirm successfully");
    } else {
      toast.error(responseData.message);
    }
    fetchGetOrderDetail();
    fetchGetDeliveryOfOrder();
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
                {orderDetail.japaneseShipper ?? ""}
              </span>
            </div>

            <div className={styles.footerItem}>
              <span className={styles.label}>Vietnamese Shipper:</span>
              <span className={styles.value}>
                {orderDetail.vietnameseShipper ?? ""}
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

            {orderDetail.status === "To Ship" &&
              user.country ==
              "Japan" && (
                <div>
                  <Button
                    style={{
                      backgroundColor: "#C71125",
                      color: "white",
                      marginTop: "10px",
                      padding: "10px 30px",
                    }}
                    onClick={() => handleConfirmArrivingStorage()}
                  >
                    Confirm Arriving Storage
                  </Button>
                </div>
              )}

            {orderDetail.status === "Arrive Japan Storage" &&
              user.country == "Japan" && (
                <div>
                  <Button
                    style={{
                      backgroundColor: "#C71125",
                      color: "white",
                      marginTop: "10px",
                      padding: "10px 30px",
                    }}
                    onClick={() => handleConfirmArrivingJapanAirport()}
                  >
                    Confirm Arriving Airport
                  </Button>
                </div>
              )}


            {orderDetail.status === "Arrive Japan Airport" &&
              user.country == "Vietnam" && (
                <div>
                  <Button
                    style={{
                      backgroundColor: "#C71125",
                      color: "white",
                      marginTop: "10px",
                      padding: "10px 30px",
                    }}
                    onClick={() => handleConfirmArrivingVietnamAirport()}
                  >
                    Confirm Arriving Vietnamese Airport
                  </Button>
                </div>
              )}

            {orderDetail.status === "Arrive Vietnam Airport" &&
              user.country == "Vietnam" && (
                <div>
                  <Button
                    style={{
                      backgroundColor: "#C71125",
                      color: "white",
                      marginTop: "10px",
                      padding: "10px 30px",
                    }}
                    onClick={() => handleConfirmArrivingVietnamStorage()}
                  >
                    Confirm Arriving Vietnamese Storage
                  </Button>
                </div>
              )}

            {orderDetail.status === "Arrive Vietnam Storage" &&
              user.country == "Vietnam" && (
                <div>
                  <Button
                    style={{
                      backgroundColor: "#C71125",
                      color: "white",
                      marginTop: "10px",
                      padding: "10px 30px",
                    }}
                    onClick={() => handleConfirmArrivingCustomer()}
                  >
                    Confirm Arriving Customer
                  </Button>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetailShipper;

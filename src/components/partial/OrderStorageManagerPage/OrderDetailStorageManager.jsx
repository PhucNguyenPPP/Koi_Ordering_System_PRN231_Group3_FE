import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import {
  AssignJapaneseShipper,
  GetDeliveryOfOrder,
  GetOrderDetail,
} from "../../../api/OrderApi";
import styles from "./order-detail-storage-manager.module.scss";
import dayjs from "dayjs";
import { GetAllShipperOfStorage } from "../../../api/ShipperApi";
import CircleIcon from "@mui/icons-material/Circle";

function OrderDetailStorageManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderDeliveryList, setOrderDeliveryList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [shippers, setShippers] = useState([]);
  const [selectedShipper, setSelectedShipper] = useState("");

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

  const fetchShippers = async () => {
    const response = await GetAllShipperOfStorage(
      user.storageProvinceId,
      "",
      1,
      100
    );
    if (response.ok) {
      const responseData = await response.json();
      setShippers(responseData.value);
    } else if (response.status === 404) {
      setShippers([]);
    } else {
      console.log("Error when fetch get all shipper of storage");
    }
  };

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      fetchGetOrderDetail();
      fetchGetDeliveryOfOrder();
      fetchShippers();
      setIsLoading(false);
    }
  }, [orderId]);

  const handleAssignShipper = async () => {
    if (selectedShipper) {
      const data = {
        orderId: orderId,
        shipperId: selectedShipper,
      };
      setIsLoading(true);
      const response = await AssignJapaneseShipper(data);
      const responseData = await response.json();
      if (response.ok) {
        toast.success("Assign shiper successfully");
        fetchGetOrderDetail();
        fetchGetDeliveryOfOrder();
        fetchShippers();
        setOpenDialog(false);
      } else {
        toast.error(responseData.message);
      }
      setIsLoading(false);
    } else {
      toast.error("Please select a shipper");
    }
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

            {orderDetail.status === "To Ship" && (
              <div>
                <Button
                  style={{
                    backgroundColor: "#C71125",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={() => setOpenDialog(true)} // Mở dialog
                >
                  Assign Shipper
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dialog cho việc chọn shipper */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Assign Shipper</DialogTitle>
        <DialogContent style={{ width: "300px" }}>
          <div>
            <Controller
              name="shipper"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={selectedShipper}
                  onChange={(e) => setSelectedShipper(e.target.value)}
                  fullWidth
                >
                  {shippers &&
                    shippers.map((shipper) => (
                      <MenuItem key={shipper.UserId} value={shipper.UserId}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={shipper.AvatarLink} // Link hình ảnh của shipper
                            alt={shipper.FullName}
                            style={{
                              marginRight: "10px",
                              width: "80px",
                              height: "60px",
                            }}
                          />
                          {shipper.FullName}
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAssignShipper}
            style={{ backgroundColor: "#C71125", color: "white" }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default OrderDetailStorageManager;

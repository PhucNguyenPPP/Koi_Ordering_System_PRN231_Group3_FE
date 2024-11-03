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
  AssignVietnameseShipper,
  GetDeliveryOfOrder,
  GetOrderDetail,
} from "../../../api/OrderApi";
import styles from "./order-detail-storage-manager.module.scss";
import dayjs from "dayjs";
import { GetAllShipperOfStorage } from "../../../api/ShipperApi";
import CircleIcon from "@mui/icons-material/Circle";
import { AssignFlight, GetFlightByStorageProvinceId } from "../../../api/FlightApi";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

function OrderDetailStorageManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderDeliveryList, setOrderDeliveryList] = useState([]);
  const [openDialogShipper, setOpenDialogShipper] = useState(false);
  const [openDialogFlight, setOpenDialogFlight] = useState(false);
  const [shippers, setShippers] = useState([]);
  const [flightList, setFlightList] = useState([]);
  const [selectedShipper, setSelectedShipper] = useState("");
  const [selectedFlight, setSelectedFlight] = useState("");
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

  const fetchGetAllFlightByStorageProvinceId = async () => {
    const response = await GetFlightByStorageProvinceId(user.storageProvinceId, orderDetail.customerProvinceId)
    if (response.ok) {
      const responseData = await response.json();
      setFlightList(responseData.result);
    } else {
      console.log("Error when fetch get flight");
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
      if (user.country === "Japan") {
        const response = await AssignJapaneseShipper(data);
        const responseData = await response.json();
        if (response.ok) {
          toast.success("Assign shipper successfully");
          fetchGetOrderDetail();
          fetchGetDeliveryOfOrder();
          fetchShippers();
          setOpenDialogShipper(false);
        } else {
          toast.error(responseData.message);
        }
      } else if (user.country === "Vietnam") {
        const response = await AssignVietnameseShipper(data);
        const responseData = await response.json();
        if (response.ok) {
          toast.success("Assign shipper successfully");
          fetchGetOrderDetail();
          fetchGetDeliveryOfOrder();
          fetchShippers();
          setOpenDialogShipper(false);
        } else {
          toast.error(responseData.message);
        }
      }

      setIsLoading(false);
    } else {
      toast.error("Please select a shipper");
    }
  };

  const handleOpenDialogFlight = async () => {
    fetchGetAllFlightByStorageProvinceId();
    setOpenDialogFlight(true);
  }

  const handleAssignFlight = async () => {
    if (selectedFlight) {
      const data = {
        orderId: orderId,
        flightId: selectedFlight,
      };
      setIsLoading(true);
      const response = await AssignFlight(data);
      const responseData = await response.json();
      if (response.ok) {
        toast.success("Assign flight successfully");
        fetchGetOrderDetail();
        fetchGetDeliveryOfOrder();
        fetchShippers();
        setOpenDialogFlight(false);
      } else {
        toast.error(responseData.message);
      }
      setIsLoading(false);
    } else {
      toast.error("Please select a flight");
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

            {orderDetail.status === "Packaged" && orderDetail.flightId !== null && user.country == "Japan" && (
              <div>
                <Button
                  style={{
                    backgroundColor: "#C71125",
                    color: "white",
                    marginTop: "10px",
                    padding: "10px 30px",
                  }}
                  onClick={() => setOpenDialogShipper(true)}
                >
                  Assign Shipper
                </Button>
              </div>
            )}

            {orderDetail.status === "Packaged" && user.country == "Japan" && (
              <div>
                <Button
                  style={{
                    backgroundColor: "#C71125",
                    color: "white",
                    marginTop: "10px",
                    padding: "10px 30px",
                  }}
                  onClick={() => handleOpenDialogFlight()}
                >
                  Assign Flight
                </Button>
              </div>
            )}

            {orderDetail.status === "Arrive Japan Airport" && user.country == "Vietnam" && (
              <div>
                <Button
                  style={{
                    backgroundColor: "#C71125",
                    color: "white",
                    marginTop: "10px",
                    padding: "10px 30px",
                  }}
                  onClick={() => setOpenDialogShipper(true)}
                >
                  Assign Shipper
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dialog cho việc chọn shipper */}
      <Dialog open={openDialogShipper} onClose={() => setOpenDialogShipper(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Assign Shipper</DialogTitle>
        <DialogContent style={{ width: "100%" }}>
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
                            src={shipper.AvatarLink}
                            alt={shipper.FullName}
                            style={{
                              marginRight: "10px",
                              width: "70px",
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
          <Button onClick={() => setOpenDialogShipper(false)} color="secondary">
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

      {/* Dialog cho việc chọn flight */}
      <Dialog open={openDialogFlight} onClose={() => setOpenDialogFlight(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Assign Flight</DialogTitle>
        <DialogContent style={{ width: "100%" }}>
          <div>
            <Controller
              name="flight"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={selectedFlight}
                  onChange={(e) => setSelectedFlight(e.target.value)}
                  fullWidth
                >
                  {flightList &&
                    flightList.map((flight) => (
                      <MenuItem key={flight.flightId} value={flight.flightId}>
                        <div style={{ display: "flex", gap: '10px' }}>
                          <strong>Flight Code:</strong> {flight.flightCode}
                          <strong>Airline:</strong> {flight.airline}
                          <strong>Departure Date:</strong> {dayjs(flight.departureDate).format('DD-MM-YYYY HH:mm')}
                          <strong>Arrival Date:</strong> {dayjs(flight.arrivalDate).format('DD-MM-YYYY HH:mm')}
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogFlight(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAssignFlight}
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

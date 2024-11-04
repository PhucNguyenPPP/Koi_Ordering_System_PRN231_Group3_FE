import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, TextField, Typography } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { ConfirmOrderCustomer, CreateRefundRequest, GetDeliveryOfOrder, GetOrderDetail } from "../../../api/OrderApi";
import styles from "./order-detail.module.scss";
import dayjs from "dayjs";
import CircleIcon from "@mui/icons-material/Circle";
import { CreatePaymentUrl } from "../../../api/PaymentApi";
import { Controller, useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { GetAllPolicyOfFarmByCustomer } from "../../../api/PolicyApi";

function OrderDetailCustomer() {
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderDeliveryList, setOrderDeliveryList] = useState([]);
  const { user } = useAuth();
  const location = useLocation();
  const { orderId } = location.state || {};
  const [openDialogCreateRefund, setOpenDialogCreateRefund] = useState(false);
  const [openDialogRefundData, setOpenDialogRefundData] = useState(false);
  const [files, setFiles] = useState([]);
  const [policyList, setPolicyList] = useState([]);

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

  const handleOpenCreateRefund = async () => {
    const response = await GetAllPolicyOfFarmByCustomer(orderDetail.farmId);
    const responseData = await response.json();
    if (response.ok) {
      setPolicyList(responseData.value)
      setOpenDialogCreateRefund(true);
    } else {
      console.log("Fail to fetch get policy farm");
    }
  }

  const handleCreateRefundRequest = async (data) => {

    if (files.length === 0) {
      toast.error("Please input at least 1 image about your Koi condition")
      return;
    }

    setIsLoading(true);
    const response = await CreateRefundRequest(orderId, data, files);
    const responseData = await response.json();
    if (response.ok) {
      toast.success("Create refund successfully");
      fetchGetOrderDetail();
      fetchGetDeliveryOfOrder();
    } else {
      toast.error("Create refund failed: " +  + responseData.message);
    }
    setFiles([])
    setOpenDialogCreateRefund(false);
    reset();
    setIsLoading(false);
  };

  const onDrop = (acceptedFiles) => {
    // Thêm các file mới vào danh sách file hiện có mà không ghi đè
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file) // Tạo URL cho hình ảnh
        })
      )
    ]);
  };


  // Khai báo useDropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [] // Chấp nhận mọi loại hình ảnh
    },
    maxFiles: 5,
    maxSize: 1048576
  });



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
                    backgroundColor: "#DD7D01",
                    color: "white",
                    marginTop: "10px",
                    padding: "10px 30px",
                    marginRight: '10px'
                  }}
                  onClick={() => handleConfirmOrderCustomer()}
                >
                  Confirm Order
                </Button>
                <Button
                  style={{
                    backgroundColor: "#C71125",
                    color: "white",
                    marginTop: "10px",
                    padding: "10px 30px",
                  }}
                  onClick={() => handleOpenCreateRefund()}
                >
                  Create Refund Request
                </Button>
              </div>
            )}

            {(orderDetail.status === "Processing Refund"
              || orderDetail.status === "Accepted Refund"
              || orderDetail.status === "Denied Refund"
              || orderDetail.status === "Completed Refund"
            ) && (
                <div>
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
                </div>
              )}

            <Dialog open={openDialogCreateRefund} onClose={() => setOpenDialogCreateRefund(false)}>
              <DialogTitle>Create Refund Request</DialogTitle>
              <DialogContent style={{ paddingTop: '10px' }}>
                <Controller
                  name="policyId"
                  control={control}
                  rules={{ required: "Please select policy" }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      error={!!error}
                    >
                      <InputLabel>Policy</InputLabel>
                      <Select {...field} label="Policy">
                        {policyList &&
                          policyList.map((policy) => (
                            <MenuItem
                              key={policy.PolicyId}
                              value={policy.PolicyId}
                            >
                              {policy.PolicyName}
                            </MenuItem>
                          ))}
                      </Select>
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}{" "}
                    </FormControl>
                  )}
                />
                <Controller
                  name="refundDescription"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input refund request",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Refund Description"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={5}
                      error={!!errors.refundDescription}
                      helperText={errors.refundDescription?.message}
                    />
                  )}
                />

                <Controller
                  name="bankAccount"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input bank account",
                  }}
                  render={({ field }) => (
                    <TextField
                      style={{ marginTop: '15px' }}
                      {...field}
                      label="Bank Account"
                      variant="outlined"
                      type="number"
                      fullWidth
                      error={!!errors.bankAccount}
                      helperText={errors.bankAccount?.message}
                    />
                  )}
                />

                {/* Dropzone */}
                <Box {...getRootProps({ className: 'dropzone' })} sx={{ mt: 2, p: 2, border: '2px dashed #cccccc', borderRadius: '4px', textAlign: 'center' }}>
                  <input {...getInputProps()} />
                  <Typography>
                    Drag & drop some files here, or click to select files
                  </Typography>
                </Box>

                {/* Hiển thị danh sách file đã chọn */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                  {files.map((file, index) => (
                    <Box key={index} sx={{ width: 100, height: 100, position: 'relative' }}>
                      <img
                        src={file.preview}
                        alt={`preview ${index}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </Box>
                  ))}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialogCreateRefund(false)}>Cancel</Button>
                <Button onClick={handleSubmit(handleCreateRefundRequest)}>Create</Button>
              </DialogActions>
            </Dialog>

            {orderDetail.refundPolicy && orderDetail.refundRequestMedia && (
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
        </div>
      )}
    </div>
  );
}

export default OrderDetailCustomer;

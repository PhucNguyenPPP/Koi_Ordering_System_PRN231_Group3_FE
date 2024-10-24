import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import styles from "./Cart.module.scss";
import useAuth from "../../../hooks/useAuth";
import { DeleteCartUser, GetCartUser } from "../../../api/CartApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartList, setCartList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]); // Store checked IDs
  const [selectedKois, setSelectedKois] = useState([]); // Store selected Koi objects
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCartUser = async () => {
    setIsLoading(true);
    const response = await GetCartUser(user.userId);
    const responseData = await response.json();
    if (response.ok) {
      setCartList(responseData.result);
    } else if (response.status === 404) {
      setCartList([]);
    } else {
      toast.error(responseData.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchCartUser();
    }
  }, [user]);

  const formatPriceVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  //change github2

  const handleCheckboxToggle = (cartId) => {
    setCheckedItems((prevCheckedItems) => {
      if (prevCheckedItems.includes(cartId)) {
        return prevCheckedItems.filter((id) => id !== cartId); // Uncheck
      } else {
        return [...prevCheckedItems, cartId]; // Check
      }
    });

    const selectedKoi = cartList.find((cart) => cart.cartId === cartId);
    if (selectedKois.some((koi) => koi.cartId === cartId)) {
      setSelectedKois((prevSelectedKois) =>
        prevSelectedKois.filter((koi) => koi.cartId !== cartId)
      );
    } else {
      setSelectedKois((prevSelectedKois) => [...prevSelectedKois, selectedKoi]);
    }
  };

  const calculateTotalPrice = () => {
    return cartList
      .filter((cart) => checkedItems.includes(cart.cartId))
      .reduce((total, cart) => total + Number(cart.price), 0);
  };

  const handleDelete = (cartId) => {
    const fetchDeleteCartUser = async () => {
      setIsLoading(true);
      const response = await DeleteCartUser(cartId);
      const responseData = await response.json();

      if (response.ok) {
        toast.success("Delete from cart successfully");
        setCheckedItems((prevCheckedItems) =>
          prevCheckedItems.filter((id) => id !== cartId)
        );
        fetchCartUser();
      } else {
        toast.error(responseData.message);
      }
      setIsLoading(false);
    };

    fetchDeleteCartUser();
  };

  const handleCheckOut = () => {
    if (selectedKois.length > 0) {
      const farmIds = selectedKois.map((koi) => koi.farmId);
      const isSameFarm = farmIds.every((farmId) => farmId === farmIds[0]);

      if (!isSameFarm) {
        toast.error("Please select koi from the same farm to check out.");
        return;
      }

      navigate("/check-out", { state: { kois: selectedKois } });
    } else {
      toast.error("Please select at least one koi to check out.");
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
        <CircularProgress />
      </div>
    );
  }

  if (!cartList.length > 0) {
    return (
      <div className={styles.cartPage}>
        <Paper className={styles.section} elevation={3}>
          <p className="text-center text-red-700 text-3xl font-semibold">
            No Koi Found
          </p>
        </Paper>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <Paper className={styles.section} elevation={3}>
        <Box display="flex" alignItems="center" padding={1}>
          <Checkbox
            checked={checkedItems.length === cartList.length}
            onChange={(e) => {
              if (e.target.checked) {
                setCheckedItems(cartList.map((cart) => cart.cartId));
                setSelectedKois(cartList);
              } else {
                setCheckedItems([]);
                setSelectedKois([]);
              }
            }}
          />
          <Typography variant="h6" style={{ flex: 2, fontWeight: "bold" }}>
            Product
          </Typography>
          <Typography
            variant="h6"
            style={{ flex: 1, textAlign: "right", fontWeight: "bold" }}
          >
            Farm
          </Typography>
          <Typography
            variant="h6"
            style={{ flex: 1, textAlign: "right", fontWeight: "bold" }}
          >
            Price
          </Typography>
          <Typography
            variant="h6"
            style={{ flex: 0.5, textAlign: "center", fontWeight: "bold" }}
          >
            Action
          </Typography>
        </Box>
      </Paper>

      {cartList.map((cart) => (
        <Paper key={cart.cartId} className={styles.section} elevation={2}>
          <Box display="flex" alignItems="center" padding={1}>
            <Checkbox
              checked={checkedItems.includes(cart.cartId)}
              onChange={() => handleCheckboxToggle(cart.cartId)}
            />
            <Box display="flex" alignItems="center" flex={2}>
              <img
                src={cart.koiAvatar}
                alt={cart.koiName}
                style={{ width: "120px", height: "200px", marginRight: "10px" }}
              />
              <Typography
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  paddingLeft: "10px",
                }}
                variant="body1"
              >
                {cart.koiName}
              </Typography>
            </Box>
            <Typography variant="body1" style={{ flex: 1, textAlign: "right" }}>
              {cart.farmName}
            </Typography>
            <Typography
              variant="body1"
              style={{
                flex: 1,
                textAlign: "right",
                color: "#C71125",
                fontWeight: "bold",
              }}
            >
              {formatPriceVND(cart.price)}
            </Typography>
            <Box style={{ flex: 0.5, textAlign: "center" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(cart.cartId)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}

      <Paper
        className={`${styles.section} ${styles.stickyBottom}`}
        elevation={3}
      >
        <div className="flex justify-end items-center">
          <p className="text-xl mr-5">
            Total Price:
            <span className="font-semibold text-red-700 text-2xl ml-5">
              {formatPriceVND(calculateTotalPrice())}
            </span>
          </p>
          <button
            style={{
              backgroundColor: "#C71125",
              padding: "10px 50px",
              borderRadius: "5px",
              color: "white",
            }}
            onClick={handleCheckOut}
          >
            Check Out
          </button>
        </div>
      </Paper>
    </div>
  );
};

export default CartPage;

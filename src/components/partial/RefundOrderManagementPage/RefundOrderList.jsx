import React, { useEffect, useState } from "react";
import styles from "./refund-order.module.scss";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useAuth from "../../../hooks/useAuth";
import {
  CircularProgress,
  Pagination,
  TextField,
  debounce,
} from "@mui/material";
import { MoreHorizontalIcon } from "lucide-react";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { GetAllRefundOrder } from "../../../api/RefundApi";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#C71125",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const RefundOrderList = () => {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();

  const fetchAllRefundOrder = async () => {
    const response = await GetAllRefundOrder(
      user.farmId,
      searchQuery,
      currentPage,
      rowsPerPage
    );
    const responseData = await response.json();
    if (response.ok) {
      setOrderList(responseData.value);
      setTotalPage(Math.ceil(responseData["@odata.count"] / rowsPerPage));
    } else if (response.status === 404) {
      setCurrentPage(1);
      setTotalPage(0);
      setOrderList([]);
    } else {
      setCurrentPage(1);
      setTotalPage(0);
      console.log("Error when fetch get all refund order");
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchAllRefundOrder();
      setIsLoading(false);
    }
  }, [user, searchQuery, currentPage]);

  const formatPriceVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD-MM-YYYY HH:mm");
  };

  const handleMenuClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = debounce((e) => {
    setCurrentPage(1);
    setSearchQuery(e.target.value);
  }, 500);

  const handleDetail = () => {
    const orderId = selectedOrder.OrderId;
    navigate("/refund-order-detail", { state: { orderId } });
    handleMenuClose();
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.koiContentContainer}>
        <div className="flex justify-between items-center mb-4">
          <TextField
            label="Search customer"
            variant="outlined"
            defaultValue={searchQuery}
            onChange={handleSearchChange}
            style={{ width: "300px" }}
          />
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Order ID
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Customer
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Farm Name
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Created Date
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                  align="center"
                >
                  Status
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                  align="right"
                >
                  Action
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderList.length > 0 ? (
                orderList.map((order) => (
                  <StyledTableRow key={order.OrderId}>
                    <StyledTableCell component="th" scope="row">
                      <p className="font-semibold">{order.OrderNumber}</p>
                    </StyledTableCell>
                    <StyledTableCell>{order.CustomerName}</StyledTableCell>
                    <StyledTableCell>
                      {order.FarmName}
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatDate(order.CreatedDate)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {order.Status}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        onClick={(event) => handleMenuClick(event, order)}
                      >
                        <MoreHorizontalIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={10} align="center">
                    No Order Found.
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex justify-center mt-5">
          <Pagination
            page={currentPage}
            onChange={handlePageChange}
            count={totalPage}
          />
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem style={{ color: "blue" }} onClick={handleDetail}>
          <InfoIcon className="mr-1" /> Detail
        </MenuItem>
      </Menu>
    </div>
  );
};

export default RefundOrderList;

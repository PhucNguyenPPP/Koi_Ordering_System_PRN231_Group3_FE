import React, { useEffect, useState } from "react";
import styles from "./shipper-management.module.scss";
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
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  Modal,
  Pagination,
  Radio,
  RadioGroup,
  TextField,
  debounce,
} from "@mui/material";
import { MoreHorizontalIcon } from "lucide-react";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { GetAllShipperOfStorage } from "../../../api/ShipperApi";
import { Controller, useForm } from "react-hook-form";
import { RegisterShipper } from "../../../api/AuthenApi";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";

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

const maxDate = dayjs().subtract(18, 'year').format("YYYY-MM-DD");

const ShipperManagement = () => {
  const [shipperList, setShipperList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModalCreateShipper, setOpenModalCreateShipper] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const fetchAllShipperOfStorage = async () => {
    const response = await GetAllShipperOfStorage(
      user.storageProvinceId,
      searchQuery,
      currentPage,
      rowsPerPage
    );
    if (response.ok) {
      const responseData = await response.json();
      setShipperList(responseData.value);
      setTotalPage(Math.ceil(responseData["@odata.count"] / rowsPerPage));
    } else if (response.status === 404) {
      setShipperList([]);
      setCurrentPage(1);
      setTotalPage(0);
    } else {
      console.log("Error when fetch get all shipper of storage");
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchAllShipperOfStorage();
      setIsLoading(false);
    }
  }, [user, searchQuery, currentPage]);

  const handleMenuClick = (event, shipper) => {
    setAnchorEl(event.currentTarget);
    setSelectedShipper(shipper);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedShipper(null);
  };

  const handleSearchChange = debounce((e) => {
    setCurrentPage(1);
    setSearchQuery(e.target.value);
  }, 500);

  const handleDelete = () => {
    const shipperId = selectedShipper.userId;
    handleMenuClose();
  };

  const handleCreate = () => {
    setOpenModalCreateShipper(true);
  };

  const handleCloseModalCreateShipper = () => {
    setOpenModalCreateShipper(false);
    reset();
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const response = await RegisterShipper(data, user.storageProvinceId);
    if (response.ok) {
      toast.success("Create shipper successfully");
      handleCloseModalCreateShipper();
    } else {
      const responseData = await response.json();
      toast.error(responseData.message);
    }
    fetchAllShipperOfStorage();
    setIsLoading(false);
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
          <Button
            variant="contained"
            style={{ backgroundColor: "#C71125", fontWeight: "bold" }}
            onClick={handleCreate}
          >
            Create New Shipper
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Shippper Name
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Phone
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Email
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Address
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Gender
                </StyledTableCell>
                {/* <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                  align="right"
                >
                  Action
                </StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {shipperList.length > 0 ? (
                shipperList.map((shipper) => (
                  <StyledTableRow key={shipper.UserId}>
                    <StyledTableCell component="th" scope="row">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={shipper.AvatarLink}
                          alt={shipper.FullName}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            marginRight: "10px",
                          }}
                        />
                        <p className="font-semibold">{shipper.FullName}</p>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>{shipper.Phone}</StyledTableCell>
                    <StyledTableCell>{shipper.Email}</StyledTableCell>
                    <StyledTableCell>{shipper.Address}</StyledTableCell>
                    <StyledTableCell>{shipper.Gender}</StyledTableCell>
                    {/* <StyledTableCell align="right">
                      <IconButton
                        onClick={(event) => handleMenuClick(event, shipper)}
                      >
                        <MoreHorizontalIcon />
                      </IconButton>
                    </StyledTableCell> */}
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={10} align="center">
                    No Shipper Found.
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
        <MenuItem style={{ color: "red" }} onClick={handleDelete}>
          <DeleteIcon className="mr-1" /> Delete
        </MenuItem>
      </Menu>

      <Modal
        open={openModalCreateShipper}
        onClose={handleCloseModalCreateShipper}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-5 rounded shadow-md w-1/2">
            <h2 id="modal-title">Create New Shipper</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <FormControl fullWidth margin="normal">
                  <InputLabel shrink>Avatar</InputLabel>
                  <Controller
                    name="avatar"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...register("avatar", {
                          required: "Please input avatar",
                        })}
                        type="file"
                        id="avatar"
                      />
                    )}
                  />
                </FormControl>
                <Controller
                  name="username"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input username",
                    minLength: {
                      value: 5,
                      message: "Username must have at least 5 characters",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.username}
                      helperText={errors.username?.message}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input password",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
                      message:
                        "Password must have at least 1 special character",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      type="password"
                      {...field}
                      label="Password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
                <Controller
                  name="fullName"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input fullname",
                    minLength: {
                      value: 8,
                      message: "Fullname must have at least 8 characters",
                    },
                    pattern: {
                      value: /^[\p{L}]+([\s\p{L}]+)*$/u,
                      message: "Fullname is invalid",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Fullname"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                    />
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input phone number",
                    pattern: {
                      value: /^0\d{9}$/,
                      message: "Phone number is invalid",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
                <Controller
                  name="address"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input address",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input email",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Email is invalid",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="dateOfBirth"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input date of birth",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Date of birth"
                      type="date"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth?.message}
                      inputProps={{
                        max: maxDate,
                      }}
                    />
                  )}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel shrink>Gender</InputLabel>
                  <Controller
                    name="Gender"
                    control={control}
                    defaultValue="Male"
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value="Male"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="Female"
                          control={<Radio />}
                          label="Female"
                        />
                        <FormControlLabel
                          value="Other"
                          control={<Radio />}
                          label="Other"
                        />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  onClick={handleCloseModalCreateShipper}
                  color="primary"
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress
                        size={24}
                        sx={{ position: "absolute" }}
                      />
                      <span style={{ visibility: "hidden" }}>
                        CREATE SHIPPER
                      </span>{" "}
                      {/* Hide the text while loading */}
                    </>
                  ) : (
                    "CREATE SHIPPER"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShipperManagement;

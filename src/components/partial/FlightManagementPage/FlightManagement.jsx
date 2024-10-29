import React, { useEffect, useState } from "react";
import styles from "./flight-management.module.scss";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useAuth from "../../../hooks/useAuth";
import {
  CreateKoi,
  DeleteKoi,
  GetAllKoiOfFarm,
  UpdateKoi,
} from "../../../api/KoiApi";
import {
  CircularProgress,
  Button,
  TextField,
  debounce,
  Modal,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormControl,
  InputLabel,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Pagination,
  Select,
  FormHelperText,
} from "@mui/material";
import { MoreHorizontalIcon } from "lucide-react";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import { useForm, Controller, set } from "react-hook-form";
import { GetAllBreed } from "../../../api/BreedApi";
import { useNavigate } from "react-router-dom";
import {
  CreateFlight,
  DeleteFlight,
  GetAllFlight,
  UpdateFlight,
} from "../../../api/FlightApi";
import { GetAllAirport } from "../../../api/AirportApi";
import dayjs from "dayjs";

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

const FlightManagement = () => {
  const [flightList, setFlightList] = useState([]);
  const [airportList, setAirportList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModalCreateFlight, setOpenModalCreateFlight] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(0);
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const fetchAllFlight = async () => {
    const response = await GetAllFlight(searchQuery, currentPage, rowsPerPage);
    const responseData = await response.json();
    if (response.ok) {
      setFlightList(responseData.value);
      setTotalPage(Math.ceil(responseData["@odata.count"] / rowsPerPage));
    } else {
      setFlightList([]);
      setCurrentPage(1);
      setTotalPage(0);
    }
  };

  const fetchAllAirports = async () => {
    const response = await GetAllAirport();
    const responseData = await response.json();
    if (response.ok) {
      setAirportList(responseData.value);
    } else {
      setAirportList([]);
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchAllFlight();
      fetchAllAirports();
      setIsLoading(false);
    }
  }, [user, searchQuery, currentPage]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const maxDate = getTodayDate();

  const formatPriceVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleMenuClick = (event, flight) => {
    setAnchorEl(event.currentTarget);
    setSelectedFlight(flight);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = debounce((e) => {
    setCurrentPage(1);
    setSearchQuery(e.target.value);
  }, 500);

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      flightId: selectedFlight.FlightId,
      flightCode: selectedFlight.FlightCode,
      airline: selectedFlight.Airline,
      departureDate: dayjs(selectedFlight.DepartureDate).format(
        "YYYY-MM-DDTHH:mm"
      ),
      arrivalDate: dayjs(selectedFlight.ArrivalDate).format("YYYY-MM-DDTHH:mm"),
      departureAirportId: selectedFlight.DepartureAirportId,
      arrivalAirportId: selectedFlight.ArrivalAirportId,
    });
    setOpenModalCreateFlight(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
    handleMenuClose();
  };

  const handleCreate = () => {
    setOpenModalCreateFlight(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setOpenDeleteModal(false);
    setSelectedFlight(null);
  };

  const handleFetchDelete = async () => {
    setIsLoading(true);
    const response = await DeleteFlight(selectedFlight.FlightId);
    if (response.ok) {
      fetchAllFlight();
      handleCloseDeleteConfirmation();
      toast.success("Delete Flight successfully");
    } else {
      const responseData = await response.json();
      toast.error("Delete Flight failed: " + responseData.message);
    }
    setIsLoading(false);
  };

  const handleCloseModalCreateFlight = () => {
    setOpenModalCreateFlight(false);
    setIsEditing(false);
    setSelectedFlight(null);
    reset({
      flightId: "",
      flightCode: "",
      airline: "",
      departureDate: "",
      arrivalDate: "",
      departureAirportId: "",
      arrivalAirportId: "",
    });
  };

  const onSubmit = (data) => {
    console.log(data);
    if (isEditing) {
      const dataJson = {
        flightId: selectedFlight.FlightId,
        flightCode: data.flightCode,
        airline: data.airline,
        departureDate: data.departureDate,
        arrivalDate: data.arrivalDate,
        departureAirportId: data.departureAirportId,
        arrivalAirportId: data.arrivalAirportId,
      };

      const fetchUpdateKoi = async () => {
        setIsLoading(true);
        const response = await UpdateFlight(dataJson);
        if (response.ok) {
          reset();
          fetchAllAirports();
          fetchAllFlight();
          handleCloseModalCreateFlight();
          toast.success("Update flight successfully");
        } else {
          const responseData = await response.json();
          toast.error(responseData.message);
        }
        setIsLoading(false);
      };
      fetchUpdateKoi();
    } else {
      const dataJson = {
        flightCode: data.flightCode,
        airline: data.airline,
        departureDate: data.departureDate,
        arrivalDate: data.arrivalDate,
        departureAirportId: data.departureAirportId,
        arrivalAirportId: data.arrivalAirportId,
      };
      const fetchCreateFlight = async () => {
        setIsLoading(true);
        const response = await CreateFlight(dataJson);
        if (response.ok) {
          reset();
          toast.success("Create flight successfully");
          fetchAllAirports();
          fetchAllFlight();
          handleCloseModalCreateFlight();
        } else {
          const responseData = await response.json();
          toast.error(responseData.message);
        }
        setIsLoading(false);
      };
      fetchCreateFlight();
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // const filteredKoiList = koiList.filter(koi => koi.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
            label="Search by flight codes"
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
            Create New Flight
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Flight Code
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                  align="right"
                >
                  Airline
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                  align="right"
                >
                  Departure Time
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                  align="right"
                >
                  Arrival Time
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                  align="right"
                >
                  Departure Airport
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                  align="right"
                >
                  Arrival Aiport
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
              {flightList.length > 0 ? (
                flightList.map((flight) => (
                  <StyledTableRow key={flight.FlightId}>
                    <StyledTableCell component="th" scope="row">
                      <p className="font-semibold">{flight.FlightCode}</p>
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ fontWeight: "bold" }}
                      align="right"
                    >
                      {flight.Airline}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {dayjs(flight.DepartureDate).format("DD-MM-YYYY HH:mm")}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {dayjs(flight.ArrivalDate).format("DD-MM-YYYY HH:mm")}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {flight.DepartureAirportName}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {flight.ArrivalAirportName}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        onClick={(event) => handleMenuClick(event, flight)}
                      >
                        <MoreHorizontalIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={10} align="center">
                    No flight found.
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
        <MenuItem style={{ color: "orange" }} onClick={handleEdit}>
          <EditIcon className="mr-1" /> Edit
        </MenuItem>
        <MenuItem style={{ color: "red" }} onClick={handleDelete}>
          <DeleteIcon className="mr-1" /> Delete
        </MenuItem>
      </Menu>

      {/* Modal for Creating New Koi */}
      <Modal
        open={openModalCreateFlight}
        onClose={handleCloseModalCreateFlight}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-5 rounded shadow-md w-1/2">
            <h2 id="modal-title">
              {isEditing ? "Edit Flight" : "Create New Flight"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="flightCode"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input flight ID",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Flight Code"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.flightCode}
                      helperText={errors.flightCode?.message}
                    />
                  )}
                />
                <Controller
                  name="airline"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input airline",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Airline"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.airline}
                      helperText={errors.airline?.message}
                    />
                  )}
                />
                <Controller
                  name="departureDate"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input departure date",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Departure Date"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="datetime-local"
                      error={!!errors.departureDate}
                      helperText={errors.departureDate?.message}
                    />
                  )}
                />
                <Controller
                  name="arrivalDate"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input arrival date",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Arrival Date"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="datetime-local"
                      error={!!errors.arrivalDate}
                      helperText={errors.arrivalDate?.message}
                    />
                  )}
                />
                <Controller
                  name="departureAirportId"
                  control={control}
                  rules={{ required: "Please input departure airport" }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      error={!!error}
                    >
                      <InputLabel>Departure Airport</InputLabel>
                      <Select {...field} label="Departure Airport">
                        {airportList &&
                          airportList.map((airport) => (
                            <MenuItem
                              key={airport.AirportId}
                              value={airport.AirportId}
                            >
                              {airport.AirportName}
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
                  name="arrivalAirportId"
                  control={control}
                  rules={{ required: "Please input arrival airport" }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      error={!!error}
                    >
                      <InputLabel>Arrival Airport</InputLabel>
                      <Select {...field} label="Arrival Airport">
                        {airportList &&
                          airportList.map((airport) => (
                            <MenuItem
                              key={airport.AirportId}
                              value={airport.AirportId}
                            >
                              {airport.AirportName}
                            </MenuItem>
                          ))}
                      </Select>
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}{" "}
                      {/* Show error message */}
                    </FormControl>
                  )}
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  onClick={handleCloseModalCreateFlight}
                  color="primary"
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: "#C71125", color: "white" }}
                >
                  {isEditing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <Dialog open={openDeleteModal} onClose={handleCloseDeleteConfirmation}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this flight?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleFetchDelete}
            style={{ backgroundColor: "#C71125", color: "white" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FlightManagement;

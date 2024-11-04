import React, { useEffect, useState } from "react";
import styles from "./policy-management.module.scss";
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
} from "@mui/material";
import { MoreHorizontalIcon } from "lucide-react";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import { useForm, Controller, set } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CreatePolicy, DeletePolicy, GetAllPolicyOfFarm, UpdatePolicy } from "../../../api/PolicyApi";

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

const PolicyManagement = () => {
  const [policyList, setPolicyList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModalCreatePolicy, setOpenModalCreatePolicy] = useState(false);
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

  const fetchAllPolicyOfFarm = async () => {
    const response = await GetAllPolicyOfFarm(searchQuery, currentPage, rowsPerPage, user.farmId);
    const responseData = await response.json();
    if (response.ok) {
      setPolicyList(responseData.value);
      setTotalPage(Math.ceil(responseData["@odata.count"] / rowsPerPage));
    } else if (response.status === 404) {
      setPolicyList([]);
      setCurrentPage(0);
      setTotalPage(0);
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchAllPolicyOfFarm();
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

  const handleMenuClick = (event, policy) => {
    setAnchorEl(event.currentTarget);
    setSelectedPolicy(policy);
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
      policyId: selectedPolicy.PolicyId,
      policyName: selectedPolicy.PolicyName,
      description: selectedPolicy.Description,
      percentageRefund: selectedPolicy.PercentageRefund,
      isBackFarm: true
    });
    setOpenModalCreatePolicy(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
    handleMenuClose();
  };

  const handleCreate = () => {
    setOpenModalCreatePolicy(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setOpenDeleteModal(false);
    setSelectedPolicy(null);
  };

  const handleFetchDelete = async () => {
    setIsLoading(true);
    const response = await DeletePolicy(selectedPolicy.PolicyId);
    if (response.ok) {
      fetchAllPolicyOfFarm();
      handleCloseDeleteConfirmation();
      toast.success("Disable policy successfully");
    } else {
      const responseData = await response.json();
      toast.error("Disable policy failed: " + responseData.message);
    }
    setIsLoading(false);
  };

  const handleCloseModalCreatePolicy = () => {
    setOpenModalCreatePolicy(false);
    setIsEditing(false);
    setSelectedPolicy(null);
    reset({
      policyId: "",
      policyName: "",
      description: "",
      percentageRefund: "",
      isBackFarm: true
    });
  };

  const onSubmit = (data) => {
    const dataJsonCreate = {
      policyName: data.policyName,
      percentageRefund: data.percentageRefund,
      description: data.description,
      isBackToFarm: true,
      farmId: user.farmId,
      status: true
    }
    if (isEditing) {
      const dataJsonUpdate = {
        policyId: selectedPolicy.PolicyId,
        policyName: data.policyName,
        percentageRefund: data.percentageRefund,
        description: data.description,
        isBackToFarm: true,
        farmId: user.farmId,
        status: true
      }
      const fetchUpdatePolicy = async () => {
        setIsLoading(true);
        const response = await UpdatePolicy(dataJsonUpdate);
        if (response.ok) {
          reset();
          fetchAllPolicyOfFarm();
          handleCloseModalCreatePolicy();
          toast.success("Update policy successfully");
        } else {
          const responseData = await response.json();
          toast.error("Update policy failed: " + responseData.message);
        }
        setIsLoading(false);
      };
      fetchUpdatePolicy();
    } else {
      const fetchCreatePolicy = async () => {
        setIsLoading(true);
        const response = await CreatePolicy(dataJsonCreate);
        if (response.ok) {
          reset();
          toast.success("Create policy successfully");
          fetchAllPolicyOfFarm();
          handleCloseModalCreatePolicy();
        } else {
          const responseData = await response.json();
          toast.error("Create policy failed: " + responseData.message);
        }
        setIsLoading(false);
      };
      fetchCreatePolicy();
    }
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
            label="Search policy name"
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
            Create New Policy
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Policy Name
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Policy Description
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Status
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                  align="right"
                >
                  Refund Percentage
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
              {policyList && policyList.length > 0 ? (
                policyList.map((policy) => (
                  <StyledTableRow key={policy.PolicyId}>
                    <StyledTableCell component="th" scope="row">
                      <p className="font-semibold">{policy.PolicyName}</p>
                    </StyledTableCell>
                    <StyledTableCell>
                      {policy.Description}
                    </StyledTableCell>
                    <StyledTableCell>
                      {policy.Status ? 'Active' : 'Disable'}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {policy.PercentageRefund + "%"}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        onClick={(event) => handleMenuClick(event, policy)}
                      >
                        <MoreHorizontalIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={4} align="center">
                    No policy found.
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

      <Modal
        open={openModalCreatePolicy}
        onClose={handleCloseModalCreatePolicy}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-5 rounded shadow-md w-1/2">
            <h2 id="modal-title">
              {isEditing ? "Edit Policy" : "Create New Policy"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="policyName"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input policy name",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Policy Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.policyName}
                      helperText={errors.policyName?.message}
                    />
                  )}
                />
                <Controller
                  name="percentageRefund"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input percentage refund",
                    min: {
                      value: 10,
                      message: "The percentage refund must be at least 10%"
                    },
                    max: {
                      value: 100,
                      message: "The percentage refund must be at most 100%"
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Percentage refund"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="number"
                      error={!!errors.percentageRefund}
                      helperText={errors.percentageRefund?.message}
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please input policy description",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Policy Description"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  onClick={handleCloseModalCreatePolicy}
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
            Are you sure you want to delete this policy?
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

export default PolicyManagement;

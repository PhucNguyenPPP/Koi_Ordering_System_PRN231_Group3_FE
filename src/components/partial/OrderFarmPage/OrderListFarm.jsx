import React, { useEffect, useState } from 'react';
import styles from './order-list-farm.module.scss';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useAuth from '../../../hooks/useAuth';
import { CreateKoi, DeleteKoi, GetAllKoiOfFarm, UpdateKoi } from '../../../api/KoiApi';
import { CircularProgress, Button, TextField, debounce, Modal, RadioGroup, FormControlLabel, Radio, Checkbox, FormControl, InputLabel, Input, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { MoreHorizontalIcon } from 'lucide-react';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import { useForm, Controller, set } from 'react-hook-form';
import { GetAllBreed } from '../../../api/BreedApi';
import { useNavigate } from 'react-router-dom';
import { GetAllFarmHistoryOrder } from '../../../api/OrderApi';
import dayjs from 'dayjs';

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
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const OrderListFarm = () => {
    const [orderList, setOrderList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const fetchAllOrderOfFarm = async () => {
        const response = await GetAllFarmHistoryOrder(user.farmId, searchQuery);
        const responseData = await response.json();
        if (response.ok) {
            setOrderList(responseData);
        } else if (response.status === 404) {
            setOrderList([]);
        } else {
            console.log("Error when fetch get all farm history order")
        }
    };


    useEffect(() => {
        if (user) {
            setIsLoading(true);
            fetchAllOrderOfFarm();
            setIsLoading(false);
        }
    }, [user, searchQuery]);

    const formatPriceVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).format('DD-MM-YYYY HH:mm');
    };

    const handleMenuClick = (event, koi) => {
        setAnchorEl(event.currentTarget);
        setSelectedKoi(koi);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSearchChange = debounce((e) => {
        setSearchQuery(e.target.value);
    }, 500);

    const handleDetail = () => {
        const orderId = selectedOrder.orderId
        navigate('/koi-detail-management', { state: { orderId } });
        handleMenuClose();
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
                        style={{ width: '300px' }}
                    />
                </div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '20px' }}>OrderId</StyledTableCell>
                                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '20px' }}>Customer</StyledTableCell>
                                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '20px' }}>Created Date</StyledTableCell>
                                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '20px' }}>Total Price</StyledTableCell>
                                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '20px' }} align="center">Status</StyledTableCell>
                                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '20px' }} align="right">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderList.length > 0 ? orderList.map((order) => (
                                <StyledTableRow key={order.orderId}>
                                    <StyledTableCell component="th" scope="row">
                                        <p className='font-semibold'>{order.orderNumber}</p>
                                    </StyledTableCell>
                                    <StyledTableCell>{order.customerName}</StyledTableCell>
                                    <StyledTableCell>{formatDate(order.createdDate)}</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold'}}>{formatPriceVND(order.totalPrice)}</StyledTableCell>
                                    <StyledTableCell align="center">{order.status}</StyledTableCell>
                                    <StyledTableCell align="right">
                                        <IconButton onClick={(event) => handleMenuClick(event, order)}>
                                            <MoreHorizontalIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={4} align="center">
                                        No Order Found.
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem style={{ color: 'blue' }} onClick={handleDetail}><InfoIcon className='mr-1' /> Detail</MenuItem>
            </Menu>
        </div>
    );
};

export default OrderListFarm;

import React, { useEffect, useState } from 'react';
import styles from './koimanagement.module.scss';
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

const KoiManagement = () => {
    const [koiList, setKoiList] = useState([]);
    const [breedList, setBreedList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedKoi, setSelectedKoi] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBreedIds, setSelectedBreedIds] = useState([]);
    const [openModalCreateKoi, setOpenModalCreateKoi] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const { handleSubmit: handleSubmitCreateKoi, control: controlCreateKoi, register: registerCreateKoi, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const fetchAllKoiListOfFarm = async () => {
        const response = await GetAllKoiOfFarm(user.farmId, searchQuery);
        const responseData = await response.json();
        if (response.ok) {
            setKoiList(responseData);
        } else if (response.status === 404) {
            setKoiList([]);
        }
    };

    const fetchGetAllBreed = async () => {
        const response = await GetAllBreed();
        const responseData = await response.json();
        if (response.ok) {
            setBreedList(responseData.result);
        } else if (response.status === 404) {
            setBreedList([]);
        }
    };

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            fetchAllKoiListOfFarm();
            fetchGetAllBreed();
            setIsLoading(false);
        }
    }, [user, searchQuery]);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const maxDate = getTodayDate();

    const formatPriceVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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
        const koiId = selectedKoi.koiId
        navigate('/koi-detail-management', { state: { koiId } });
        handleMenuClose();
    };

    const handleEdit = () => {
        setIsEditing(true);
        reset({
            koiName: selectedKoi.name,
            koiPrice: selectedKoi.price,
            koiDescription: selectedKoi.description,
            koiDateOfBirth: selectedKoi.dob.split('T')[0],
        });
        setSelectedBreedIds(selectedKoi.breedId);
        setOpenModalCreateKoi(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleCreate = () => {
        setOpenModalCreateKoi(true);
    };

    const handleCloseDeleteConfirmation = () => {
        setOpenDeleteModal(false);
        setSelectedKoi(null);
    }

    const handleFetchDelete = async () => {
        setIsLoading(true);
        const response = await DeleteKoi(selectedKoi.koiId)
        if (response.ok) {
            fetchAllKoiListOfFarm();
            handleCloseDeleteConfirmation();
            toast.success('Delete Koi successfully')
        } else {
            const responseData = await response.json();
            toast.error("Delete Koi failed: " + responseData.message)
        }
        setIsLoading(false);
    }

    const handleCloseModalCreateKoi = () => {
        setOpenModalCreateKoi(false);
        setIsEditing(false);
        setSelectedKoi(null);
        setSelectedBreedIds([]);
        reset({
            koiAvatar: '',
            koiCertification: '',
            koiName: '',
            koiPrice: '',
            koiDescription: '',
            koiDateOfBirth: '',
        });
    };

    const handleBreedSelection = (breedId) => {
        setSelectedBreedIds((prev) =>
            prev.includes(breedId) ? prev.filter((id) => id !== breedId) : [...prev, breedId]
        );
    };

    const onSubmitCreateKoi = (data) => {
        if (selectedBreedIds.length <= 0) {
            toast.error("Please choose at least 1 breed");
            return;
        }

        const koiData = {
            ...data,
            breedList: selectedBreedIds
        };

        if (isEditing) {
            const fetchUpdateKoi = async () => {
                setIsLoading(true);
                const response = await UpdateKoi(selectedKoi.koiId, koiData)
                if (response.ok) {
                    reset();
                    fetchAllKoiListOfFarm();
                    handleCloseModalCreateKoi();
                    toast.success('Update Koi successfully')
                } else {
                    const responseData = await response.json();
                    toast.error("Update Koi failed: " + responseData.message)
                }
                setIsLoading(false);
            }

            fetchUpdateKoi();
        } else {
            const fetchCreateKoi = async () => {
                setIsLoading(true);
                const response = await CreateKoi(koiData, user.farmId);
                if (response.ok) {
                    reset();
                    setSelectedBreedIds([]);
                    toast.success('Create Koi successfully')
                    fetchAllKoiListOfFarm();
                    handleCloseModalCreateKoi();
                } else {
                    const responseData = await response.json();
                    toast.error("Create Koi failed: " + responseData.message)
                }
                setIsLoading(false);
            }

            fetchCreateKoi();
        }

    };

    const filteredKoiList = koiList.filter(koi => koi.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
                        label="Search Koi"
                        variant="outlined"
                        defaultValue={searchQuery}
                        onChange={handleSearchChange}
                        style={{ width: '300px' }}
                    />
                    <Button
                        variant="contained"
                        style={{ backgroundColor: '#C71125', fontWeight: 'bold' }}
                        onClick={handleCreate}
                    >
                        Create New Koi
                    </Button>
                </div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '20px' }}>Koi</StyledTableCell>
                                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '20px' }} align="right">Price</StyledTableCell>
                                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '20px' }} align="right">Status</StyledTableCell>
                                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '20px' }} align="right">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredKoiList.length > 0 ? filteredKoiList.map((koi) => (
                                <StyledTableRow key={koi.koiId}>
                                    <StyledTableCell component="th" scope="row">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={koi.avatarLink}
                                                alt={koi.name}
                                                style={{ width: '80px', height: '180px', objectFit: 'cover', marginRight: '10px' }}
                                            />
                                            <p className='font-semibold'>{koi.name}</p>
                                        </div>
                                    </StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} align="right">{formatPriceVND(koi.price)}</StyledTableCell>
                                    <StyledTableCell align="right">{!koi.orderId ? "In Stock" : "Is Bought"}</StyledTableCell>
                                    <StyledTableCell align="right">
                                        <IconButton onClick={(event) => handleMenuClick(event, koi)}>
                                            <MoreHorizontalIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={4} align="center">
                                        No koi found.
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
                {selectedKoi && selectedKoi.status && (
                    <>
                        <MenuItem style={{ color: 'orange' }} onClick={handleEdit}><EditIcon className='mr-1' /> Edit</MenuItem>
                        <MenuItem style={{ color: 'red' }} onClick={handleDelete}><DeleteIcon className='mr-1' /> Delete</MenuItem>
                    </>
                )}
            </Menu>

            {/* Modal for Creating New Koi */}
            <Modal
                open={openModalCreateKoi}
                onClose={handleCloseModalCreateKoi}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div className="flex items-center justify-center h-full">
                    <div className="bg-white p-5 rounded shadow-md w-1/2">
                        <h2 id="modal-title">{isEditing ? 'Edit Koi' : 'Create New Koi'}</h2>
                        <form onSubmit={handleSubmitCreateKoi(onSubmitCreateKoi)}>
                            <div className="grid grid-cols-2 gap-4">
                                <FormControl fullWidth margin="normal">
                                    <InputLabel shrink>
                                        Koi Avatar
                                    </InputLabel>
                                    <Controller
                                        name="koiAvatar"
                                        control={controlCreateKoi}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <Input
                                                type="file"
                                                id="koiAvatar"
                                                {
                                                ...registerCreateKoi("koiAvatar", {
                                                    required: !isEditing ? "Please input Koi avatar" : false,
                                                })}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel shrink>
                                        Koi Certification
                                    </InputLabel>
                                    <Controller
                                        name="koiCertification"
                                        control={controlCreateKoi}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <Input

                                                {
                                                ...registerCreateKoi("koiCertification", {
                                                    required: !isEditing ? "Please input Koi certification" : false,
                                                })}

                                                type="file"
                                                id="koiCertification"
                                            />
                                        )}
                                    />
                                </FormControl>
                                <Controller
                                    name="koiName"
                                    control={controlCreateKoi}
                                    defaultValue=""
                                    rules={{
                                        required: 'Please input Koi Name'
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Koi Name"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.koiName}
                                            helperText={errors.koiName?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name="koiPrice"
                                    control={controlCreateKoi}
                                    defaultValue=""
                                    rules={{
                                        required: 'Please input Koi Price',
                                        min: {
                                            value: 1,
                                            message: "Koi Price must be at least 1 VND"
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Koi Price (VND)"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            type="number"
                                            error={!!errors.koiPrice}
                                            helperText={errors.koiPrice?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name="koiDescription"
                                    control={controlCreateKoi}
                                    defaultValue=""
                                    rules={{
                                        required: 'Please input Koi Description'
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Koi Description"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={4}
                                            error={!!errors.koiDescription}
                                            helperText={errors.koiDescription?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name="koiDateOfBirth"
                                    control={controlCreateKoi}
                                    defaultValue=""
                                    rules={{
                                        required: 'Please input date of birth'
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Date of Birth"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            type="date"
                                            maxDate={maxDate}
                                            error={!!errors.koiDateOfBirth}
                                            helperText={errors.koiDateOfBirth?.message}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                max: maxDate,
                                            }}
                                        />
                                    )}
                                />
                                <Controller
                                    name="gender"
                                    control={controlCreateKoi}
                                    defaultValue="Male"
                                    render={({ field }) => (
                                        <RadioGroup row {...field}>
                                            <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                            <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                        </RadioGroup>
                                    )}
                                />
                                <div className="col-span-2">
                                    <label className="font-medium">Breed List</label>
                                    <Controller
                                        name="breedList"
                                        control={controlCreateKoi}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <div>
                                                {breedList
                                                    && breedList.length > 0
                                                    && breedList.map((breed) => (
                                                        <FormControlLabel
                                                            key={breed.breedId}
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedBreedIds.includes(breed.breedId)}
                                                                    onChange={() => handleBreedSelection(breed.breedId)}
                                                                />
                                                            }
                                                            label={breed.name}
                                                        />
                                                    ))}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button type="button" onClick={handleCloseModalCreateKoi} color="primary" className="mr-2">
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" style={{ backgroundColor: '#C71125', color: 'white' }}>
                                    {isEditing ? 'Update' : 'Create'}
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
                        Are you sure you want to delete this Koi?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirmation} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleFetchDelete} style={{ backgroundColor: '#C71125', color: 'white' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default KoiManagement;

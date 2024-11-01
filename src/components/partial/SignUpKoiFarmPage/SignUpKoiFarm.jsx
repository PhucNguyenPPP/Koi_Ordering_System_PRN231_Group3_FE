import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Typography, Box, InputLabel, FormControl, Input, MenuItem, Select, FormControlLabel, Radio, RadioGroup, TextareaAutosize, CircularProgress, FormHelperText, colors } from '@mui/material';
import { RegisterCustomer, RegisterKoiFarm } from '../../../api/AuthenApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GetStorageProvinceJapan } from '../../../api/StorageProvinceApi';
import dayjs, { Dayjs } from 'dayjs';

const SignUpKoiFarm = () => {
    const { handleSubmit, control, register, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [storageProvinceJapan, setStorageProvinceJapan] = useState([]);
    const navigate = useNavigate();

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const maxDate = dayjs().subtract(18, 'year').format("YYYY-MM-DD");
    const onSubmit = async (data) => {
        const response = await RegisterKoiFarm(data);
        if (response.ok) {
            const responseData = await response.json();
            setErrorMessage('')
            toast.success('Sign up successfully')
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            const responseData = await response.json();
            setErrorMessage(responseData.message)
            toast.error("Sign up failed: " + responseData.message)
        }
    };

    useEffect(() => {
        const fetchProvinceStorageJapan = async () => {
            setIsLoading(true);
            const response = await GetStorageProvinceJapan();
            const responseData = await response.json();
            if (response.ok) {
                setStorageProvinceJapan(responseData.result);
            } else if (response.status === 404) {
                setStorageProvinceJapan([]);
            } else {
                toast.error("Fetch province failed: " + responseData.message);
            }
            setIsLoading(false);
        }

        fetchProvinceStorageJapan();
    }, [])

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div
            style={{
                height: 'max-content',
                backgroundImage: "url('/image/KoiBackground.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >

            <Box
                sx={{
                    maxWidth: '50%',
                    mx: 'auto',
                    mt: 5,
                    mb: 5,
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <img className='w-40' src='image/logo.png' alt='Logo' />
                <Typography variant="h5" align="center" gutterBottom fontWeight='bold'>
                    SIGN UP KOI FARM
                </Typography>
                {errorMessage && (
                    <Typography color='red' gutterBottom>
                        * {errorMessage}
                    </Typography>)}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel shrink>
                            Avatar
                        </InputLabel>
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
                            required: 'Please input username',
                            minLength: {
                                value: 5,
                                message: 'Username must have at least 5 characters'
                            }
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
                            required: 'Please input password',
                            minLength: {
                                value: 8,
                                message: 'Password must have at least 8 characters'
                            },
                            pattern: {
                                value: /^(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
                                message: 'Password must have at least 1 special character',
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                type='password'
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
                            required: 'Please input fullname',
                            minLength: {
                                value: 8,
                                message: 'Fullname must have at least 8 characters'
                            },
                            pattern: {
                                value: /^[\p{L}]+([\s\p{L}]+)*$/u,
                                message: 'Fullname is invalid',
                            }
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
                            required: 'Please input phone number',
                            pattern: {
                                value: /^0\d{9}$/,
                                message: 'Phone number is invalid',
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
                            required: 'Please input address'
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
                            required: 'Please input email',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Email is invalid',
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
                            required: 'Please input date of birth',
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
                        <InputLabel shrink>
                            Gender
                        </InputLabel>
                        <Controller
                            name="Gender"
                            control={control}
                            defaultValue="Male"
                            render={({ field }) => (
                                <RadioGroup {...field} row>
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                </RadioGroup>
                            )}
                        />
                    </FormControl>
                    <Controller
                        name="farmName"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Please input farm name'
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Farm Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                error={!!errors.farmName}
                                helperText={errors.farmName?.message}
                            />
                        )}
                    />
                    <Controller
                        name="farmDescription"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Please input farm description',
                        }}
                        render={({ field }) => (
                            <div>
                                <label>Farm Description</label>
                                <TextareaAutosize
                                    {...field}
                                    minRows={3}
                                    style={{
                                        width: '100%', padding: '8px',
                                        borderColor: errors.farmDescription ? 'red' : 'black',
                                        border: '1px solid'
                                    }}
                                />
                                {errors.farmDescription && (
                                    <FormHelperText style={{ color: 'red' }}>{errors.farmDescription.message}</FormHelperText>
                                )}
                            </div>
                        )}
                    />
                    <Controller
                        name="farmAddress"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Please input farm address'
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Farm Address"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                error={!!errors.farmAddress}
                                helperText={errors.farmAddress?.message}
                            />
                        )}
                    />

                    {storageProvinceJapan
                        && storageProvinceJapan.length > 0
                        && (
                            <Controller
                                name="province"
                                control={control}
                                rules={{
                                    required: 'Please select a farm province',
                                }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.farmType} margin="normal" variant="outlined">
                                        <InputLabel id="farm-province-label">Farm Province</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="farm-province-label"
                                            label="Farm Province"
                                        >
                                            {storageProvinceJapan.map((i) => (
                                                <MenuItem key={i.storageProvinceId} value={i.storageProvinceId}>{i.provinceName} </MenuItem>
                                            ))}

                                        </Select>
                                        {errors.province && (
                                            <FormHelperText style={{ color: 'red' }}>{errors.province.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2, position: 'relative' }} // Ensure relative positioning for the circular progress
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? (
                            <>
                                <CircularProgress size={24} sx={{ position: 'absolute' }} />
                                <span style={{ visibility: 'hidden' }}>SIGN UP KOI FARM</span> {/* Hide the text while loading */}
                            </>
                        ) : (
                            'SIGN UP KOI FARM'
                        )}
                    </Button>
                </form>
            </Box>
        </div>
    );
};

export default SignUpKoiFarm;

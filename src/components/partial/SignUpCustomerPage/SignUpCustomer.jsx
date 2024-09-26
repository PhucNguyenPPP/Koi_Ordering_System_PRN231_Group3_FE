import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Typography, Box, InputLabel, FormControl, Input, MenuItem, Select, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { RegisterCustomer } from '../../../api/AuthenApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignUpCustomer = () => {
    const { handleSubmit, control, register, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const maxDate = getTodayDate();
    const onSubmit = async (data) => {
        const response = await RegisterCustomer(data);
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
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                minHeight: '100vh' // Ensure it takes full viewport height
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
                    alignItems: 'center', // Center content horizontally
                }}
            >
                <img className='w-40' src='image/logo.png' alt='Logo' />
                <Typography variant="h5" align="center" gutterBottom fontWeight='bold'>
                    SIGN UP
                </Typography>
                {errorMessage && (
                    <Typography color='red' gutterBottom>
                        * {errorMessage}
                    </Typography>)}
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        SIGN UP
                    </Button>
                </form>
            </Box>
        </div>
    );
};

export default SignUpCustomer;

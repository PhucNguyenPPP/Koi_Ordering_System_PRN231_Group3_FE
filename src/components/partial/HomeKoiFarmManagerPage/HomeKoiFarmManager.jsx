import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, TextField } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ReaderIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Line } from 'react-chartjs-2';
import { CategoryScale, LinearScale } from 'chart.js';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MoneyIcon from '@mui/icons-material/Money';
import { GetProfitOfCurrentYearByKoiFarm, GetRevenueByFarmManager } from '../../../api/DashboardApi';

// Register necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2 digits for month
    const day = date.getDate().toString().padStart(2, '0'); // Ensure 2 digits for day
    return `${year}-${month}-${day}`;
};

const currentDate = new Date();

const currentYear = currentDate.getFullYear();

const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

function HomeKoiFarmManager() {
    const [profit, setProfit] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [profitData, setProfitData] = useState([]);
    const [startDate, setStartDate] = useState(formatDate(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDate(lastDayOfMonth));
    const { user } = useAuth();

    const formatPriceVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const fetchRevenueByTimeRange = async () => {
        const response = await GetRevenueByFarmManager(startDate, endDate, user.farmId)
        if (response.ok) {
            const responseData = await response.json();
            setRevenue(responseData.result);
        } else {
            console.log("Error when get revenue")
        }
    }

    // const fetchProfitByTimeRange = async () => {
    //     const response = await GetProfitByAdmin(startDate, endDate)
    //     if (response.ok) {
    //         const responseData = await response.json();
    //         setProfit(responseData.result);
    //     } else {
    //         console.log("Error when get profit")
    //     }
    // }

    const fetchProfitOfCurrentYear = async () => {
        const response = await GetProfitOfCurrentYearByKoiFarm(currentYear, user.farmId);
        if (response.ok) {
            const responseData = await response.json();

            const profits = new Array(12).fill(0);

            responseData.result.forEach((item) => {
                const monthIndex = item.month - 1;
                profits[monthIndex] = item.profit;
            });

            setProfitData(profits);
            console.log("Error when get profit of current year")
        }
    }


    useEffect(() => {
        if (user) {
            fetchProfitOfCurrentYear();
            fetchRevenueByTimeRange();
            // fetchProfitByTimeRange();
        }
    }, [startDate, endDate, user])

    const handleStartDateChange = (event) => {
        var startDateValue = event.target.value;
        if (endDate != '') {
            if (startDateValue >= endDate) {
                toast.error("Ngày bắt đầu không thể lớn hơn hoặc bằng ngày kết thúc");
                return;
            }
        }
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        var endDateValue = event.target.value;
        if (startDate != '') {
            if (endDateValue <= startDate) {
                toast.error("Ngày kết thúc không thể nhỏ hơn hoặc bằng ngày bắt đầu");
                return;
            }
        }
        setEndDate(event.target.value);
    };

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Profit (VND)',
                data: profitData,
                fill: false,
                borderColor: '#5900E5',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Profit By Month',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 500000,
                    callback: function (value) {
                        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                    },
                },
            },
        },
    };

    return (
        <div className='p-8'
            style={{
                marginTop: '80px'
            }}
        >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Choose Time Range
                            </Typography>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <TextField
                                    style={{ width: '40%' }}
                                    label="Start Date"
                                    type="date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    style={{ width: '40%' }}
                                    label="End Date"
                                    type="date"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    fullWidth
                                    margin="normal"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <MoneyIcon /> Profit (70% Revenue)
                            </Typography>
                            <Typography variant="h4">{formatPriceVND(profit)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <TrendingUpIcon /> Revenue
                            </Typography>
                            <Typography variant="h4">{formatPriceVND(revenue)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Profit of 12 months
                            </Typography>
                            <Box display="flex" justifyContent="center">
                                <Line data={data} options={options} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default HomeKoiFarmManager;

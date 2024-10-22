import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-toastify';

function OrderDetailCustomer() {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div>
            aa
        </div>
    );
}

export default OrderDetailCustomer;

import React, { useEffect } from 'react';
import styles from './koidetailmanagement.module.scss';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GetAllKoi, GetKoiByKoiId } from '../../../api/KoiApi';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

function KoiDetailManagement() {
    const [koiDetail, setKoiDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const { koiId } = location.state || {};


    useEffect(() => {
        if (koiId) {
            setIsLoading(true);
            const fetchKoiDetail = async () => {
                const response = await GetKoiByKoiId(koiId);
                const responseData = await response.json();
                if (response.ok) {
                    setKoiDetail(responseData.result);
                } else {
                    toast.error("Fetch koi detail failed: " + responseData.message);
                }
            };

            fetchKoiDetail();

            setIsLoading(false);
        }
    }, [koiId])

    const formatPriceVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (isLoading || koiDetail === null) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.koiDetailContainer}>
                <div className={styles.koiDetailLeft}>
                    <img
                        src={koiDetail.avatarLink}
                        alt="Koi Fish"
                        className={styles.koiImage}
                    />
                </div>

                <div className={styles.koiDetailRight}>
                    <h2>{koiDetail.name}</h2>
                    <p><strong>Price:</strong> <span className='text-red-700 text-3xl font-semibold'>{formatPriceVND(koiDetail.price)}</span></p>
                    <p><strong>Breed:</strong> {koiDetail.breedName.join(', ')}</p>
                    <p><strong>Gender:</strong> {koiDetail.gender}</p>
                    <p><strong>Age:</strong> {koiDetail.age}</p>
                    <p><strong>Weight:</strong> {koiDetail.weight} kg</p>
                    <p><strong>Certification: </strong>
                        <a
                            href={koiDetail.certificationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-500"
                        >
                            Certification Link
                        </a>
                    </p>

                    <p><strong>Description:</strong> {koiDetail.description}</p>
                </div>
            </div>
        </div>

    );
}

export default KoiDetailManagement;

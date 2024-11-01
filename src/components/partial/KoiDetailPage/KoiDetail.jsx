import React, { useEffect } from 'react';
import styles from './KoiDetail.module.scss';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetAllKoi, GetKoiByKoiId } from '../../../api/KoiApi';
import { CircularProgress } from '@mui/material';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { AddToCart } from '../../../api/CartApi';

function KoiDetail() {
    const [koiDetail, setKoiDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [koiList, setKoiList] = useState([]);
    const location = useLocation();
    const { koiId } = location.state || {};
    const { user } = useAuth();
    const navigate = useNavigate();


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

            const fetchAllKoiList = async () => {
                const response = await GetAllKoi();
                const responseData = await response.json();
                if (response.ok) {
                    const filteredKoiList = responseData.value.filter(koi => koi.KoiId !== koiId);
                    setKoiList(filteredKoiList);
                } else if (response.status === 404) {
                    setKoiList([]);
                } else {
                    toast.error("Fetch koi failed: " + responseData.message);
                }
            };

            fetchAllKoiList();
            setIsLoading(false);
        }
    }, [koiId])

    const formatPriceVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add to cart");
            return;
        } else if (user.roleName !== "Customer") {
            toast.error("Only customer can add to cart");
            return;
        }

        const fetchAddToCart = async () => {
            const data = {
                userId: user.userId,
                koiId: koiDetail.koiId
            }
            const response = await AddToCart(data);
            const responseData = await response.json();
            if (response.status === 201) {
                toast.success("Add to cart successfully")
            } else {
                toast.error(responseData.message);
            }
        };

        fetchAddToCart();
    }

    const handleKoiDetail = (koiId) => {
        navigate('/koi-detail', { state: { koiId } });
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
                            href={koiDetail.CertificationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-500"
                        >
                            Certification Link
                        </a>
                    </p>

                    <p><strong>Description:</strong> {koiDetail.Description}</p>

                    <div className={styles.buttonGroup}>
                        <button className={styles.addToCartButton} onClick={handleAddToCart}>
                            <AddShoppingCartIcon /> Add to Cart
                        </button>
                        {/* <button className={styles.buyNowButton}>Buy Now</button> */}
                    </div>
                </div>
            </div>

            <div className={styles.farmInfoContainer}>
                <div className={styles.farmAvatar}>
                    <img
                        src={koiDetail.farmAvatar}
                        alt="Farm Avatar"
                        className={styles.avatarImage}
                    />
                </div>
                <div className={styles.farmDetails}>
                    <h3>{koiDetail.farmName}</h3>
                    <p className='text-red-700'>Rating: ★★★★☆ (4.5/5)</p>
                </div>
                <button
                    className={styles.viewFarmButton}
                    onClick={() => navigate(`/farms/${koiDetail.farmId}`)}  // Assuming you have a route for farm-detail
                >
                    <StoreIcon /> View Farm
                </button>
            </div>

            <div className={styles.recommendedKoiContainer}>
                <h2 className={styles.recommendedKoiTitle}>Recommended Koi</h2>
                <div className="grid grid-cols-5 gap-4">
                    {koiList && koiList.length > 0 && koiList.map((koi, index) => (
                        <div
                            key={koi.KoiId}
                            className="border p-3 rounded shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-100"
                            onClick={() => handleKoiDetail(koi.KoiId)}
                        >
                            <img
                                src={koi.AvatarLink}
                                alt={koi.Name}
                                className="mb-3 w-full h-fit object-cover"
                            />
                            <h3 className="text-lg font-bold">{koi.Name}</h3>
                            <p><strong>Price:</strong> {formatPriceVND(koi.Price)}</p>
                            <p><strong>Gender:</strong> {koi.Gender}</p>
                            <p><strong>Breed:</strong> {koi.BreedName.join(', ')}</p>
                            <p><strong>Farm:</strong> {koi.FarmName}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default KoiDetail;

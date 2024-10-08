import { useEffect, useState } from "react";
import HomeSlider from "./HomeSlider";
import { GetAllKoi } from "../../../api/KoiApi";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home() {
    const [koiList, setKoiList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllKoiList = async () => {
            setIsLoading(true);
            const response = await GetAllKoi();
            const responseData = await response.json();
            if (response.ok) {
                setKoiList(responseData.result);
            } else if (response.status === 404) {
                setKoiList([]);
            } else {
                toast.error("Fetch koi failed: " + responseData.message);
            }
            setIsLoading(false);
        };

        fetchAllKoiList();
    }, []);

    const formatPriceVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleKoiDetail = (koiId) => {
        navigate('/koi-detail', { state: { koiId } });
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="pt-10 pb-10">
                <div className="flex justify-center mb-10">
                    <div className="w-3/4">
                        <HomeSlider />
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="w-3/4">
                        <div className="grid grid-cols-5 gap-4">
                            {koiList && koiList.length > 0 && koiList.map((koi, index) => (
                                <div
                                    key={koi.koiId}
                                    className="border p-3 rounded shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-100"
                                    onClick={() => handleKoiDetail(koi.koiId)}
                                >
                                    <img
                                        src={koi.avatarLink}
                                        alt={koi.name}
                                        className="mb-3 w-full h-fit object-cover"
                                    />
                                    <h3 className="text-lg font-bold">{koi.name}</h3>
                                    <p><strong>Price:</strong> {formatPriceVND(koi.price)}</p>
                                    <p><strong>Gender:</strong> {koi.gender}</p>
                                    <p><strong>Breed:</strong> {koi.breedName.join(', ')}</p>
                                    <p><strong>Farm:</strong> {koi.farmName}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {koiList.length === 0 && (
                    <p className="text-red-500 text-3xl font-semibold text-center">No Koi Found</p>
                )}
            </div>
        </div>
    );
}

export default Home;

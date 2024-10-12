import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { GetFarmDetail } from "../../api/FarmApi";

const FarmDetailPage = () => {
  const { farmId } = useParams();
  const [farmData, setFarmData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFarmDetail = async () => {
      setIsLoading(true);
      try {
        const response = await GetFarmDetail(farmId);
        const responseData = await response.json();

        if (responseData && responseData.isSuccess) {
          setFarmData(responseData.result);
        }
      } catch (error) {
        toast.error("An error occurred while fetching farm details");
      }
      setIsLoading(false);
    };

    fetchFarmDetail();
  }, [farmId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  if (!farmData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>No farm data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Farm Image Section */}
          <div className="relative">
            <img
              src={farmData.farmAvatar}
              alt={`${farmData.farmName} Avatar`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Farm Details Section */}
          <div className="p-8 flex flex-col justify-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              {farmData.farmName}
            </h1>
            <p className="text-lg text-gray-700 mb-6">{farmData.farmDescription}</p>
            <div className="flex flex-col space-y-2">
              <p className="text-base text-gray-500">
                <span className="font-semibold">Address:</span> {farmData.farmAddress}
              </p>
              {/* Example of adding more info if available */}
              <p className="text-base text-gray-500">
                <span className="font-semibold">Specializes in:</span> {farmData.specialization || "Koi breeding"}
              </p>
              <p className="text-base text-gray-500">
                <span className="font-semibold">Contact:</span> info@sunrisekoifarm.com
              </p>
            </div>
            <button className="mt-8 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all">
              Contact Farm
            </button>
          </div>
        </div>

        {/* Additional Section: About the Farm */}
        <div className="p-8 bg-gray-50 border-t border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">About {farmData.farmName}</h2>
          <p className="text-gray-600 leading-relaxed">
            Sunrise Koi Farm has been in operation for over 20 years, specializing in producing
            top-quality Kohaku koi fish. We pride ourselves on our sustainable farming methods and
            the health and longevity of our koi. Located in Tokyo, our farm has become a go-to
            destination for koi enthusiasts worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmDetailPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { GetFarmDetail } from "../../api/FarmApi";
import LayoutCustomer from "../../components/layouts/LayoutCustomer";

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
    <LayoutCustomer>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutCustomer>

  );
};

export default FarmDetailPage;

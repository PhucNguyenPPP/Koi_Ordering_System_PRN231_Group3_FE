import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HomeAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-10 w-full">
      Home Admin Manager
    </div>
  );
}

export default HomeAdmin;

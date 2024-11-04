const baseUrl = import.meta.env.VITE_API_HOST;

export const GetRevenueByAdmin = async (startDate, endDate) => {
    try {
        var url = `${baseUrl}/api/Dashboard/revenue-admin?startdate=${startDate}&enddate=${endDate}`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const GetProfitByAdmin = async (startDate, endDate) => {
    try {
        var url = `${baseUrl}/api/Dashboard/profit?startdate=${startDate}&enddate=${endDate}`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};


export const GetRevenueByFarmManager = async (startDate, endDate, farmId) => {
    try {
        var url = `${baseUrl}/api/Dashboard/revenue-farm?startdate=${startDate}&enddate=${endDate}&farmId=${farmId}`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const GetProfitByFarmManager = async (startDate, endDate, farmId) => {
    try {
        var url = `${baseUrl}/api/Dashboard/profit-of-farm-by-time-range?startdate=${startDate}&enddate=${endDate}&farmId=${farmId}`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const GetProfitOfCurrentYearByAdmin = async (currentYear) => {
    try {
        var url = `${baseUrl}/api/Dashboard/profit-of-admin?year=${currentYear}`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const GetProfitOfCurrentYearByKoiFarm = async (currentYear, farmId) => {
    try {
        var url = `${baseUrl}/api/Dashboard/profit-of-farm?year=${currentYear}&farmId=${farmId}`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

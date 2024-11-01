const baseUrl = import.meta.env.VITE_API_HOST;

export const GetStorageProvinceJapan = async () => {
    try {
        const url = `${baseUrl}/api/StorageProvince?country=Japan`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const GetStorageProvinceVietNam = async () => {
    try {
        const url = `${baseUrl}/api/StorageProvince?country=Vietnam`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};


const baseUrl = import.meta.env.VITE_API_HOST;

export const GetShippingFeebyStorageProvinceIds= async (storageProvinceJapanId, storageProvinceVietNamId) => {
    try {
        const url = `${baseUrl}/odata/shipping-fee-province-ids?storageProvinceJapanId=${storageProvinceJapanId}&storageProvinceVietNamId=${storageProvinceVietNamId}`;
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
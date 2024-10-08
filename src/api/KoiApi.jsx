const baseUrl = import.meta.env.VITE_API_HOST;

export const GetAllKoi = async () => {
    try {
        const url = `${baseUrl}/api/Koi/all-koi`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const GetKoiByKoiId = async (koiId) => {
    try {
        const url = `${baseUrl}/api/Koi/koi?koiId=${koiId}`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};
const baseUrl = import.meta.env.VITE_API_HOST;

export const GetKoiFarmDetail = async (farmId) => {
    try {
        const url = `${baseUrl}/api/KoiFarm/farm?farmId=${farmId}`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};
const baseUrl = import.meta.env.VITE_API_HOST;

export const GetAllBreed = async () => {
    try {
        const url = `${baseUrl}/api/Breed/all-breeds`;
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
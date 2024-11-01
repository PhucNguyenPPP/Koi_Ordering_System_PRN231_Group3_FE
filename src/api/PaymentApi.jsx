const baseUrl = import.meta.env.VITE_API_HOST;

export const CreatePaymentUrl = async (orderId) => {
    try {
        const url = `${baseUrl}/api/Payment/vnpay-payment?orderId=${orderId}`;
        const request = {
            method: "POST",
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

export const HandlePaymentResponse = async (data) => {
    try {
        const url = `${baseUrl}/api/Payment/response-payment`;
        const request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};
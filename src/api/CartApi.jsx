const baseUrl = import.meta.env.VITE_API_HOST;

export const AddToCart = async (data) => {
    try {
        const url = `${baseUrl}/api/Cart/cart-user`;
        const request = {
            method: "POST",
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

export const GetCartUser = async (userId) => {
    try {
        const url = `${baseUrl}/api/Cart/cart-user?userId=${userId}`;
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

export const DeleteCartUser = async (cartId) => {
    try {
        const url = `${baseUrl}/api/Cart/cart-user?cartId=${cartId}`;
        const request = {
            method: "DELETE",
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
const baseUrl = import.meta.env.VITE_API_HOST;

export const CreateOrder = async (data, customerId, kois) => {
    try {
        const formData = new FormData();
        formData.append('Phone', data.phone);
        formData.append('Address', data.address);
        formData.append('StorageVietNamId', data.province);
        formData.append('CustomerId', customerId);
        kois.forEach((koi, index) => {
            formData.append('CartId', koi.cartId);
        });

        const url = `${baseUrl}/api/Order/koi`;
        const request = {
            method: "POST",
            body: formData
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};
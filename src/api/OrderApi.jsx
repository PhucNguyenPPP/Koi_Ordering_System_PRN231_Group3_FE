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

        const url = `${baseUrl}/odata/order`;
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

export const GetAllCustomerHistoryOrder = async (customerId) => {
    try {
        const url = `${baseUrl}/odata/all-customer-history-order?customerId=${customerId}&$orderby=createdDate desc`;
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

export const GetAllFarmHistoryOrder = async (farmId, searchQuery) => {
    try {
        var url = `${baseUrl}/odata/all-farm-history-order?farmId=${farmId}&$orderby=createdDate desc`;
        if(searchQuery != ''){
            url += `&$filter=contains(customerName,'${searchQuery}')`
        }
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

export const GetAllOrderOfStorage = async (storageProvinceId, searchQuery) => {
    try {
        var url = `${baseUrl}/odata/all-storage-history-order?storageProvinceId=${storageProvinceId}&$orderby=createdDate desc`;
        if(searchQuery != ''){
            url += `&$filter=contains(customerName,'${searchQuery}')`
        }
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

export const GetOrderDetail = async (orderId) => {
    try {
        const url = `${baseUrl}/odata/order-detail?orderId=${orderId}`;
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

export const PackOrder = async (data, orderId) => {
    try {
        const url = `${baseUrl}/odata/packaging/${orderId}`;
        const request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, request);
        
        return response;
    } catch (err) {
        console.log(err);
    }
};
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
            body: formData,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const GetAllCustomerHistoryOrder = async (customerId, currentPage, rowsPerPage) => {
    try {
        const skip = (currentPage - 1) * rowsPerPage;
        var url = `${baseUrl}/odata/all-customer-history-order?customerId=${customerId}&$top=${rowsPerPage}&$skip=${skip}&$count=true&$orderby=createdDate desc`;
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

export const GetAllFarmHistoryOrder = async (farmId, searchQuery, currentPage, rowsPerPage) => {
    try {
        const skip = (currentPage - 1) * rowsPerPage;
        var url = `${baseUrl}/odata/all-farm-history-order?farmId=${farmId}&$top=${rowsPerPage}&$skip=${skip}&$count=true&$orderby=createdDate desc`;
        if(searchQuery != ''){
            url += `&$filter=contains(customerName,'${searchQuery}')`
        }
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

export const GetAllOrderOfStorage = async (storageProvinceId, searchQuery, currentPage, rowsPerPage) => {
    try {
        const skip = (currentPage - 1) * rowsPerPage;
        var url = `${baseUrl}/odata/all-storage-history-order?storageProvinceId=${storageProvinceId}&$top=${rowsPerPage}&$skip=${skip}&$count=true&$orderby=createdDate desc`;
        if(searchQuery != ''){
            url += `&$filter=contains(customerName,'${searchQuery}')`
        }
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

export const GetAllOrderOfShipper = async (shipperId, searchQuery, currentPage, rowsPerPage) => {
    try {
        const skip = (currentPage - 1) * rowsPerPage;
        var url = `${baseUrl}/odata/shipper?shipperId=${shipperId}&$top=${rowsPerPage}&$skip=${skip}&$count=true&$orderby=createdDate desc`;
        if(searchQuery != ''){
            url += `&$filter=contains(customerName,'${searchQuery}')`
        }
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

export const GetOrderDetail = async (orderId) => {
    try {
        const url = `${baseUrl}/odata/order-detail?orderId=${orderId}`;
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

export const PackOrder = async (data, orderId) => {
    try {
        const url = `${baseUrl}/odata/packaging/${orderId}`;
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

export const GetDeliveryOfOrder = async (orderId) => {
    try {
        const url = `${baseUrl}/odata/delivery-of-order?orderId=${orderId}`;
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

export const AssignJapaneseShipper = async (data) => {
    try {
        const url = `${baseUrl}/odata/Japanese-shipper`;
        const request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(data),
        };
        const response = await fetch(url, request);
        
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const AssignVietnameseShipper = async (data) => {
    try {
        const url = `${baseUrl}/odata/Vietnamese-shipper`;
        const request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(data),
        };
        const response = await fetch(url, request);
        
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const ConfirmArrived = async (data) => {
    try {
        const url = `${baseUrl}/odata/delivery`;
        const request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(data),
        };
        const response = await fetch(url, request);
        
        return response;
    } catch (err) {
        console.log(err);
    }
};


export const ConfirmOrderCustomer = async (orderId) => {
    try {
        const url = `${baseUrl}/odata/completed/${orderId}`;
        const request = {
            method: "PUT",
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

export const CreateRefundRequest = async (orderId, data, imageFiles) => {
    try {
        const formData = new FormData();
        console.log(imageFiles)
        formData.append('OrderId', orderId);
        formData.append('RefundDescription', data.refundDescription);
        formData.append('BankAccount', data.bankAccount);
        formData.append('PolicyId', data.policyId);
        imageFiles.forEach((file, index) => {
            formData.append('Images', file);
        });

        const url = `${baseUrl}/odata/create-refund`;
        const request = {
            method: "POST",
            headers: {
                'accept': '*/*',
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: formData,
        };
        const response = await fetch(url, request);
        
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const ProcessRefund = async (data) => {
    try {
        const url = `${baseUrl}/odata/process-refund`;
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

export const CompleteRefund = async (data) => {
    try {
        const url = `${baseUrl}/odata/complete-refund`;
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
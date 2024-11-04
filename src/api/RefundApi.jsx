const baseUrl = import.meta.env.VITE_API_HOST;

export const GetAllRefundOrder = async (shipperId, searchQuery, currentPage, rowsPerPage) => {
    try {
        const skip = (currentPage - 1) * rowsPerPage;
        var url = `${baseUrl}/odata/order-refund?$top=${rowsPerPage}&$skip=${skip}&$count=true&$orderby=createdDate desc`;
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
const baseUrl = import.meta.env.VITE_API_HOST;

export const GetAllShipperOfStorage = async (storageProvinceId, searchQuery, currentPage, rowsPerPage) => {
    try {
        const skip = (currentPage - 1) * rowsPerPage;
        var url = `${baseUrl}/odata/shippers?storageProvinceId=${storageProvinceId}`;
        if(searchQuery != ''){
            url += `&$filter=contains(fullName,'${searchQuery}')`
        }
        url += `&$top=${rowsPerPage}&$skip=${skip}&$count=true`

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
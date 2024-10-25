const baseUrl = import.meta.env.VITE_API_HOST;

export const GetAllFlight = async (searchQuery, currentPage, rowsPerPage) => {
  try {
    const skip = (currentPage - 1) * rowsPerPage;
    var url = `${baseUrl}/odata/flights?`;
    if (searchQuery != "") {
      url += `&$filter=contains(flightId,'${searchQuery}')`;
    }
    url += `&$top=${rowsPerPage}&$skip=${skip}&$count=true`;

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

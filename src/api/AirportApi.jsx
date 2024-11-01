const baseUrl = import.meta.env.VITE_API_HOST;

export const GetAllAirport = async () => {
  try {
    var url = `${baseUrl}/odata/all-airports`;
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

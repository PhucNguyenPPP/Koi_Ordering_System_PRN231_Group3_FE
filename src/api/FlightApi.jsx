const baseUrl = import.meta.env.VITE_API_HOST;

export const GetAllFlight = async (searchQuery, currentPage, rowsPerPage) => {
  try {
    const skip = (currentPage - 1) * rowsPerPage;
    var url = `${baseUrl}/odata/flights?`;
    if (searchQuery != "") {
      url += `&$filter=contains(flightCode,'${searchQuery}')`;
    }
    url += `&$top=${rowsPerPage}&$skip=${skip}&$count=true`;

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

export const CreateFlight = async (data) => {
  const url = `${baseUrl}/odata/new-flight`;
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(data),
  };

  return fetch(url, request)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const UpdateFlight = async (data) => {
  const url = `${baseUrl}/odata/flight`;
  const request = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(data),
  };

  return fetch(url, request)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const DeleteFlight = async (flightId) => {
  const url = `${baseUrl}/odata/${flightId}`;
  const request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
  };

  return fetch(url, request)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const GetFlightByStorageProvinceId = async (departureStorageProvinceId, arrivalStorageProvinceId) => {
  const url = `${baseUrl}/odata/flights-by-provinceId?departureStorageProvinceId=${departureStorageProvinceId}&arrivalStorageProvinceId=${arrivalStorageProvinceId}`;
  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
  };

  return fetch(url, request)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const AssignFlight = async (data) => {
  const url = `${baseUrl}/odata/flight-of-order`;
  const request = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(data)
  };

  return fetch(url, request)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};
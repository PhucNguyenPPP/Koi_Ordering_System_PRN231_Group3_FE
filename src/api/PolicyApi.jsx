const baseUrl = import.meta.env.VITE_API_HOST;

export const GetAllPolicyOfFarm = async (searchQuery, currentPage, rowsPerPage, farmId) => {
    try {
      const skip = (currentPage - 1) * rowsPerPage;
      var url = `${baseUrl}/odata/policies-of-farm?farmId=${farmId}`;
      if (searchQuery != "") {
        url += `&$filter=contains(policyName,'${searchQuery}')`;
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

  export const CreatePolicy = async (data) => {
    const url = `${baseUrl}/odata/policy`;
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
  
  export const UpdatePolicy = async (data) => {
    const url = `${baseUrl}/odata/policy`;
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

  export const DeletePolicy = async (policyId) => {
    const url = `${baseUrl}/odata/delete/${policyId}`;
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


  export const GetAllPolicyOfFarmByCustomer = async (farmId) => {
    try {
      var url = `${baseUrl}/odata/policies-of-farm?farmId=${farmId}`;
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
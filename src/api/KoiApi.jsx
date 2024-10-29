const baseUrl = import.meta.env.VITE_API_HOST;

export const GetAllKoi = async () => {
    try {
        const url = `${baseUrl}/odata/all-koi`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const GetKoiByKoiId = async (koiId) => {
    try {
        const url = `${baseUrl}/odata/koi?koiId=${koiId}`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const GetAllKoiOfFarm = async (farmId, searchQuery, currentPage, rowsPerPage) => {
    try {
        const skip = (currentPage - 1) * rowsPerPage;
        var url = `${baseUrl}/odata/all-koi-koifarm?farmId=${farmId}&$top=${rowsPerPage}&$skip=${skip}&$count=true`;
        if(searchQuery != ''){
            url += `&$filter=contains(Name,'${searchQuery}')`
        }
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const CreateKoi = async (data, farmId) => {
    const formData = new FormData();
    formData.append('Name', data.koiName);
    formData.append('AvatarLink', data.koiAvatar[0]);
    formData.append('CertificationLink', data.koiCertification[0]);
    formData.append('Price', data.koiPrice);
    formData.append('Description', data.koiDescription);
    formData.append('Dob', data.koiDateOfBirth);
    formData.append('Gender', data.gender);
    formData.append('Weight', data.weight);
    data.breedList.forEach(breedId => {
        formData.append('BreedId', breedId);
    });
    formData.append('FarmId', farmId);

    const url = `${baseUrl}/odata/koi`;
    const request = {
        method: 'POST',
        body: formData,
        headers: {
            'accept': '*/*',
        },
    };

    return fetch(url, request)
        .then(response => {
            return response;
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};

export const UpdateKoi = async (koiId, data) => {
    const formData = new FormData();
    formData.append('KoiId', koiId);
    formData.append('Name', data.koiName);

    if(data.koiAvatar && data.koiAvatar.length > 0){
        formData.append('AvatarLink', data.koiAvatar[0]);
    }

    if(data.koiCertification && data.koiCertification.length > 0){
        formData.append('CertificationLink', data.koiCertification[0]);
    }
    formData.append('Price', data.koiPrice);
    formData.append('Description', data.koiDescription);
    formData.append('Dob', data.koiDateOfBirth);
    formData.append('Gender', data.gender);
    formData.append('Weight', data.weight);
    data.breedList.forEach(breedId => {
        formData.append('BreedId', breedId);
    });

    const url = `${baseUrl}/odata/koi`;
    const request = {
        method: 'PUT',
        body: formData,
        headers: {
            'accept': '*/*',
        },
    };

    return fetch(url, request)
        .then(response => {
            return response;
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};

export const DeleteKoi = async (koiId) => {
    try {
        const url = `${baseUrl}/odata/koi?koiId=${koiId}`;
        const request = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};
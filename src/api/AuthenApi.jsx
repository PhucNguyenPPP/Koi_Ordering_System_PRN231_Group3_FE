const baseUrl = import.meta.env.VITE_API_HOST;

export const SignIn = async (value) => {
    try {
        const url = `${baseUrl}/api/Auth/sign-in`;
        const request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(value)
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const RefreshToken = (accessToken, refreshToken) => {
    const url = `${baseUrl}/api/Auth/refresh-token`;
    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ accessToken, refreshToken })
    };

    return fetch(url, request)
        .then(response => {
            if (!response.ok) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                throw new Error('Failed to refresh token');
            }
            return response.json();
        })
        .catch(err => {
            console.error(err);
            return;
        });
};

export const GetUserByToken = (refreshToken) => {
    const url = `${baseUrl}/user/access-token/${refreshToken}`;
    const request = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
    };

    return fetch(url, request)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed');
            }
            return response.json();
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};

export const RegisterCustomer = (data) => {
    const formData = new FormData();
    formData.append('UserName', data.username);
    formData.append('Password', data.password);
    formData.append('FullName', data.fullName);
    formData.append('Phone', data.phone);
    formData.append('Address', data.address);
    formData.append('Email', data.email);
    formData.append('DateOfBirth', data.dateOfBirth);
    formData.append('Gender', data.Gender);
    formData.append('AvatarLink', data.avatar[0]);

    const url = `${baseUrl}/api/Auth/new-customer`;
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

export const RegisterKoiFarm = (data) => {
    const formData = new FormData();
    formData.append('UserName', data.username);
    formData.append('Password', data.password);
    formData.append('FullName', data.fullName);
    formData.append('Phone', data.phone);
    formData.append('Address', data.address);
    formData.append('Email', data.email);
    formData.append('DateOfBirth', data.dateOfBirth);
    formData.append('Gender', data.Gender);
    formData.append('AvatarLink', data.avatar[0]);
    formData.append('FarmName', data.farmName);
    formData.append('FarmDescription', data.farmDescription);
    formData.append('FarmAddress', data.farmAddress);
    formData.append('StorageProvinceId', data.province);

    const url = `${baseUrl}/api/Auth/new-farm`;
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
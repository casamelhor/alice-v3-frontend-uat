import { clearLocalStorage } from "@/utils/browserStorage";
import axios from "axios";
export const getToken = () => {
  // return localStorage.getItem('applicantToken') || localStorage.getItem('authToken');  // Adjust as per your implementation
  return localStorage.getItem('token');
};


export const instance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL?process.env.NEXT_PUBLIC_API_URL:"https://alicedevapi.casamelhor.in/",
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000,
});


instance.interceptors.response.use(undefined, (error) => {
    if (error.message === "Network Error" && !error.response) {
        console.log("Network error - make sure API is running!");
    }
    if (error.response) {
        const { status } = error.response;
        if (status === 404) {
            console.log("Not Found");
        }
        if (status === 401) {
            if (typeof (window) !== "undefined") {
                window.location.href = "/";
                clearLocalStorage()
                console.log("Your session has expired, please login again");
            }
        }
        return error.response;
    } else {
        // throw transformError(error);
        console.log(error)
        return error
    }
})

export const baseHeadersForRequest = () => {
  const token = getToken();
  return {
    "content-type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};
export const baseHeadersWithoutToken = () => {
  return {
    "content-type": "application/json",
  };
};

export const baseHeadersForToken = () => {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const putForUpload = async (url, params) => {

  return instance({

    url,

    method: "PUT",

    data: params,

    headers: baseHeadersForUploads(),

  });

};

const baseHeadersForUploads = () => {
  const token = getToken();
  return {
    // Accept: "application/json",
    "content-type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
    // Authorization: token ? `Bearer ${token}` : null,
  };
};

export const get = async (url, params) => {
  return instance({
    url,
    method: "GET",
    data: params,
    headers: baseHeadersForRequest(),
  }).then((res) => res.data);
}
export const getWithToken = async (url, params) => {
  return instance({
    url,
    method: "GET",
    data: params,
    headers: baseHeadersForToken(),
  })
};



export const getwithoutToken = async (url, params) => {
  return instance({
    url,
    method: "GET",
    data: params,
  }).then((res) => res.data);
};

export const post = async (url, params) => {
  return instance({
    url,
    method: "POST",
    data: params,
    headers: baseHeadersForRequest(),
  });
};
export const postWithToken = async (url, params) => {
  return instance({
    url,
    method: "POST",
    data: params,
    headers: baseHeadersForToken(),
  })
};

export const postWithoutToken = async (url, params) => {
  return instance({
    url,
    method: "POST",
    data: params,
  });
};
export const putWithoutToken = async (url, params) => {
  return instance({
    url,
    method: "PUT",
    data: params,
  });
};
export const postWithUpload = async (url, params) => {
  return instance({
    url,
    method: "POST",
    data: params,
    headers: baseHeadersForUploads(),
  });
};
export const put = async (url,params) => {
  return instance({
    url,
    method: "PUT",
    body: {},
    data: params,
    headers: baseHeadersForRequest(),
  });
};

export const deleteReq = async (url, params) => {
  return instance({
    url,
    method: "DELETE",
    data: params,
    headers: baseHeadersForRequest(),
  });
};

export const deleteWithUpload = async (url, params) => {
  return instance({
    url,
    method: "DELETE",
    data: params,
    headers: baseHeadersForUploads(),
  });
};

export const putWithUpload = async (url, params) => {
  return instance({
    url,
    method: "PUT",
    data: params,
    headers: baseHeadersForUploads(),
  });
};

export const patchWithUpload = async (url, params) => {
  return instance({
    url,
    method: "PATCH",
    data: params,
    headers: baseHeadersForUploads(),
  });
};

export const patch = async (url, params) => {
  return instance({
    url,
    method: "PATCH",
    data: params,
    headers: baseHeadersForRequest(),
  });
};



const client = {
  get,
  post,
  put,
  patch,
  deleteReq,
  deleteWithUpload,
  postWithoutToken,
  postWithUpload,
  getwithoutToken,
  putWithoutToken,
  putWithUpload,
  getWithToken,
  postWithToken,
  putForUpload,
  patchWithUpload
};

export default client;

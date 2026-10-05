import axios from "axios";

export const getCaretakerToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem('caretaker_token');
  }
  return null;
};

export const caretakerInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000,
});

caretakerInstance.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    console.log("Network error - make sure API is running!");
  }
  if (error.response) {
    const { status } = error.response;
    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem('caretaker_token');
        localStorage.removeItem('caretaker_type');
        localStorage.removeItem('caretaker_role');
        localStorage.removeItem('caretaker_properties');
        localStorage.removeItem('caretaker_selected_property');
        window.location.href = "/caretaker/login";
      }
    }
    return error.response;
  } else {
    console.log(error);
    return error;
  }
});

const caretakerHeaders = () => {
  const token = getCaretakerToken();
  return {
    "content-type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const caretakerUploadHeaders = () => {
  const token = getCaretakerToken();
  return {
    "content-type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };
};

const caretakerNoAuthHeaders = () => {
  return {
    "content-type": "application/json",
  };
};

export const caretakerGet = async (url) => {
  return caretakerInstance({
    url,
    method: "GET",
    headers: caretakerHeaders(),
  });
};

export const caretakerPost = async (url, data) => {
  return caretakerInstance({
    url,
    method: "POST",
    data,
    headers: caretakerHeaders(),
  });
};

export const caretakerPostNoAuth = async (url, data) => {
  return caretakerInstance({
    url,
    method: "POST",
    data,
    headers: caretakerNoAuthHeaders(),
  });
};

export const caretakerPostUpload = async (url, data) => {
  return caretakerInstance({
    url,
    method: "POST",
    data,
    headers: caretakerUploadHeaders(),
  });
};

const caretakerClient = {
  get: caretakerGet,
  post: caretakerPost,
  postNoAuth: caretakerPostNoAuth,
  postUpload: caretakerPostUpload,
};

export default caretakerClient;

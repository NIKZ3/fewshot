import axios from "axios";

const baseURL = "http://192.168.31.202:8000/api/";

export const Api = axios.create({
  baseURL,
});

Api.interceptors.request.use(
  function (config) {
    if (config.method === "post") {
      const formData = new FormData();
      Object.entries(config.data).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      config.data = formData;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

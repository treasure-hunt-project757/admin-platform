import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import router from "../../view/router/Route";

// const URL = "http://localhost:8080";

// original
// const URL = "https://sheba-service-gcp-tm3zus3bzq-uc.a.run.app";

//clone
const URL = "https://backend-gcp-clone-791214719127.us-central1.run.app";

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        if (
          error.response.data &&
          error.response.data.error === "Token has expired"
        ) {
          alert("תוקף ההתחברות פג. מעביר לדף התחברות...");
          localStorage.clear();
          router.navigate("/");
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance();
const loginInstance = createAxiosInstance();

// const loginInstance = axios.create({
//   baseURL: URL,
//   withCredentials: true,
// });

class GenericAPI {
  setAuthToken(token: string | null) {
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  }

  get = async <T>(
    url: string,
    params?: AxiosRequestConfig["params"],
    headers?: AxiosRequestConfig["headers"],
    options: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.get<T>(url, { ...options, headers, params });
  };

  post = async <T>(
    url: string,
    data: unknown,
    headers?: AxiosRequestConfig["headers"],
    options: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, data, { ...options, headers });
  };

  postFormData = async <T>(
    url: string,
    formData: FormData,
    headers?: AxiosRequestConfig["headers"],
    options: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    const config = {
      ...options,
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    };
    return axiosInstance.post<T>(url, formData, config);
  };

  put = async <T>(
    url: string,
    data: unknown,
    headers?: AxiosRequestConfig["headers"],
    options: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.put<T>(url, data, { ...options, headers });
  };

  putFormData = async <T>(
    url: string,
    formData: FormData,
    headers?: AxiosRequestConfig["headers"],
    options: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.put<T>(url, formData, { ...options, headers });
  };

  delete = async <T>(
    url: string,
    headers?: AxiosRequestConfig["headers"],
    options: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.delete<T>(url, { ...options, headers });
  };

  login = async <T>(
    username: string,
    password: string
  ): Promise<AxiosResponse<T>> => {
    return loginInstance.post<T>("/login", { username, password });
  };
}

export const genericAPI = new GenericAPI();

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import axios from "axios";
import { API_URL, IS_PROD } from "../constants/defines";
import { showToast } from "./toast";

// defining the axios client for the headless CMS service
const apiInstance = axios.create({
  baseURL: `${API_URL}/`,
});

apiInstance.interceptors.response.use(undefined, (error: any) => {
  return errorHandler(error);
});

const showConsoleError = (from: string, error: any) => {
  if (!IS_PROD) {
    console.error(`${from}`, error);
  }
};

const errorHandler = (error: any) => {
  //   console.log('errorHandler', error);
  if (error.message === "Network Error" && !error.response) {
    showConsoleError("Network Error", error.message);
    showToast("Network Error", "error");
    // errorToast(error.message);
    // throw new Error(error.message);
    return Promise.reject(error.message);
  } else if (error.response) {
    showConsoleError("errorHandler[response]", error.response.data);

    if (
      error.response.status === 401 &&
      error.response.data.message !== "Incorrect username or password" &&
      error.response.data.message !==
        "Your account is currently suspended. Please contact the system administrator for further assistance"
    ) {
      showToast(`${error.response.data.message}`, "error");
      setTimeout(() => {
        // showToast("session expired", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("persist:root");
        window.location.href = "/";
        return;
      }, 500);
    } else {
      showToast(
        error.response.data.message ||
          error.response.data.msg ||
          "Server Error",
        "error"
      );

      return Promise.reject(error.response.data);
    }
  } else if (error.request) {
    showConsoleError("errorHandler[request]", error.request);
    return Promise.reject(error.message);
  }
  return Promise.reject(error);
};

export default apiInstance;

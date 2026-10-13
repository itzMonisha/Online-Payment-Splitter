import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
});

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(

    (response) => {
        return response;
    },

    (error) => {

        console.error("API ERROR:", error);

        const status = error?.response?.status;
        const data = error?.response?.data;

        let message =
            "Something went wrong. Please try again.";

        /*
        Backend completely OFF
        */
        if (!error?.response) {

            message =
                "Unable to connect to the server. Please make sure the backend is running and try again.";
        }

        /*
        HTML response such as:
        <!DOCTYPE html>
        Cannot POST /api/auth/login
        */
        else if (
            typeof data === "string" &&
            (
                data.toLowerCase().includes("<!doctype") ||
                data.toLowerCase().includes("<html") ||
                data.toLowerCase().includes("cannot post") ||
                data.toLowerCase().includes("cannot get") ||
                data.toLowerCase().includes("cannot put") ||
                data.toLowerCase().includes("cannot delete")
            )
        ) {

            message =
                "Unable to connect to the backend server. Please make sure the backend is running and try again.";
        }

        /*
        JSON error from Spring Boot
        */
        else if (
            data &&
            typeof data === "object"
        ) {

            message =
                data.message ||
                data.error ||
                data.detail ||
                message;
        }

        /*
        Status handling
        */
        if (status === 400) {

            message =
                data?.message ||
                data?.error ||
                "Invalid request. Please check your details.";
        }

        else if (status === 401) {

            message =
                data?.message ||
                data?.error ||
                "Invalid email or password.";
        }

        else if (status === 403) {

            message =
                data?.message ||
                data?.error ||
                "You do not have permission to perform this action.";
        }

        else if (status === 404) {

            message =
                data?.message ||
                data?.error ||
                "The requested resource was not found.";
        }

        else if (status >= 500) {

            message =
                data?.message ||
                data?.error ||
                "Server error. Please try again later.";
        }

        error.userMessage = message;

        return Promise.reject(error);
    }
);

export default api;
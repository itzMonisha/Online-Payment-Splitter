import api from "./api";

/*
 * =========================================================
 * AUTH SERVICE
 * =========================================================
 */

/*
 * Save login response into localStorage
 */
const saveSession = (data) => {
    if (!data || typeof data !== "object") {
        return data;
    }

    const responseData =
        data?.data &&
        typeof data.data === "object"
            ? data.data
            : data;

    const token =
        responseData?.token ||
        responseData?.accessToken ||
        responseData?.jwt ||
        responseData?.jwtToken;

    const user =
        responseData?.user ||
        responseData?.currentUser ||
        responseData?.account ||
        null;

    const role =
        responseData?.role ||
        user?.role ||
        "";

    if (token) {
        localStorage.setItem(
            "token",
            String(token)
        );
    }

    if (user) {
        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        if (user.id) {
            localStorage.setItem(
                "userId",
                String(user.id)
            );
        }
    }

    if (role) {
        localStorage.setItem(
            "role",
            String(role)
                .toUpperCase()
                .trim()
        );
    }

    return responseData;
};


/*
 * =========================================================
 * REGISTER
 * POST /api/auth/register
 * =========================================================
 */

export const registerUser = async (userData) => {

    if (!userData || typeof userData !== "object") {
        throw new Error(
            "Registration data is required."
        );
    }

    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;
};


/*
 * Alias
 */
export const register = registerUser;


/*
 * =========================================================
 * LOGIN
 * POST /api/auth/login
 * =========================================================
 */

export const loginUser = async (credentials) => {

    if (
        !credentials ||
        typeof credentials !== "object"
    ) {
        throw new Error(
            "Login credentials are required."
        );
    }

    if (
        !credentials.email ||
        !credentials.password
    ) {
        throw new Error(
            "Email and password are required."
        );
    }

    const response = await api.post(
        "/auth/login",
        {
            email: credentials.email,
            password: credentials.password
        }
    );

    return saveSession(response.data);
};


/*
 * Alias
 */
export const login = loginUser;


/*
 * =========================================================
 * VALIDATE TOKEN
 * GET /api/auth/validate
 * =========================================================
 */

export const validateToken = async () => {

    const response = await api.get(
        "/auth/validate"
    );

    return response.data;
};


/*
 * =========================================================
 * LOGOUT
 * POST /api/auth/logout
 * =========================================================
 */

export const logoutUser = async () => {

    try {

        const response = await api.post(
            "/auth/logout"
        );

        return response.data;

    } finally {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
    }
};


/*
 * Alias
 */
export const logout = logoutUser;


/*
 * =========================================================
 * GET STORED USER
 * =========================================================
 */

export const getStoredUser = () => {

    try {

        const storedUser =
            localStorage.getItem("user");

        return storedUser
            ? JSON.parse(storedUser)
            : null;

    } catch (error) {

        console.error(
            "Unable to parse stored user:",
            error
        );

        return null;
    }
};


/*
 * =========================================================
 * GET TOKEN
 * =========================================================
 */

export const getToken = () => {

    return localStorage.getItem("token");
};


/*
 * =========================================================
 * CHECK AUTHENTICATION
 * =========================================================
 */

export const isAuthenticated = () => {

    return Boolean(
        localStorage.getItem("token")
    );
};


/*
 * =========================================================
 * CHECK ADMIN
 * =========================================================
 */

export const isAdmin = () => {

    const user = getStoredUser();

    const role =
        user?.role ||
        user?.userRole ||
        localStorage.getItem("role") ||
        "";

    return (
        String(role)
            .toUpperCase()
            .trim() === "ADMIN"
    );
};
/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

export const requestPasswordReset = async (email) => {

    if (!email || !email.trim()) {
        throw new Error(
            "Email is required."
        );
    }

    const response = await api.post(
        "/auth/forgot-password",
        {
            email: email.trim()
        }
    );

    return response.data;
};


/* =========================================================
   RESET PASSWORD
   ========================================================= */

export const resetPassword = async ({
    email,
    otp,
    newPassword
}) => {

    if (!email || !otp || !newPassword) {
        throw new Error(
            "Email, OTP and new password are required."
        );
    }

    const response = await api.post(
        "/auth/reset-password",
        {
            email: email.trim(),
            otp: otp.trim(),
            newPassword
        }
    );

    return response.data;
};


/*
 * =========================================================
 * CLEAR SESSION
 * =========================================================
 */

export const clearSession = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
};


/*
 * =========================================================
 * DEFAULT EXPORT
 * =========================================================
 */

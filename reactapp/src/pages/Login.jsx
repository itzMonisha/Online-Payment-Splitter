import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [rememberMe, setRememberMe] =
        useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        // =====================================================
        // FRONTEND VALIDATION
        // =====================================================

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            // =====================================================
            // LOGIN API
            // =====================================================

            const data = await loginUser({
                email: email.trim(),
                password
            });

            console.log(
                "LOGIN RESPONSE:",
                data
            );

            // =====================================================
            // GET TOKEN
            // =====================================================

            const token =
                data?.token ||
                data?.accessToken ||
                data?.jwt ||
                data?.jwtToken;

            if (!token) {
                setError(
                    "Login failed because no authentication token was received."
                );
                return;
            }

            localStorage.setItem(
                "token",
                token
            );

            // =====================================================
            // GET LOGGED-IN USER
            // =====================================================

            const loggedInUser =
                data?.user ||
                data?.currentUser ||
                data?.account ||
                null;

            if (loggedInUser) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(loggedInUser)
                );

                if (loggedInUser.id) {
                    localStorage.setItem(
                        "userId",
                        String(loggedInUser.id)
                    );
                }
            }

            // =====================================================
            // GET ROLE
            // =====================================================

            const role = String(
                data?.role ||
                loggedInUser?.role ||
                ""
            )
                .toUpperCase()
                .trim();

            if (!role) {
                setError(
                    "Login successful, but user role was not received."
                );
                return;
            }

            localStorage.setItem(
                "role",
                role
            );

            // =====================================================
            // REMEMBER ME
            // =====================================================

            localStorage.setItem(
                "rememberMe",
                rememberMe
                    ? "true"
                    : "false"
            );

            // =====================================================
            // ROLE-BASED NAVIGATION
            // =====================================================

            if (role === "ADMIN") {
                navigate(
                    "/admin-dashboard",
                    {
                        replace: true
                    }
                );
            } else {
                navigate(
                    "/user-dashboard",
                    {
                        replace: true
                    }
                );
            }

        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            // =====================================================
            // API ERROR HANDLING
            // =====================================================

            /*
             * api.js creates userMessage for connection/server
             * errors.
             *
             * IMPORTANT:
             * Check userMessage FIRST.
             *
             * This prevents the frontend from displaying
             * "Invalid email or password" when the backend
             * is actually OFF.
             */

            const message =
                error?.userMessage ||
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                (
                    typeof error?.response?.data ===
                    "string"
                        ? error.response.data
                        : null
                ) ||
                "Invalid email or password.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">

            <section className="auth-card">

                {/* =====================================================
                    BRAND
                ===================================================== */}

                <div className="auth-brand">

                    <div className="auth-brand-icon">
                        ₹
                    </div>

                    <span className="auth-brand-text">
                        SplitPay
                    </span>

                </div>

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <p className="auth-eyebrow">
                    ONLINE PAYMENT SPLITTER
                </p>

                <h1>
                    Welcome Back
                </h1>

                <p className="auth-subtitle">
                    Login to manage your shared
                    expenses and groups.
                </p>

                {/* =====================================================
                    ERROR MESSAGE
                ===================================================== */}

                {error && (
                    <div
                        className="error-box"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {/* =====================================================
                    LOGIN FORM
                ===================================================== */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* EMAIL */}

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your email"
                            autoComplete="email"
                            disabled={loading}
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={loading}
                        />

                    </div>

                    {/* OPTIONS */}

                    <div className="auth-options">

                        <label className="remember-option">

                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) =>
                                    setRememberMe(
                                        event.target.checked
                                    )
                                }
                                disabled={loading}
                            />

                            <span>
                                Remember me
                            </span>

                        </label>

                        <Link
                            to="/forgot-password"
                            className="forgot-link"
                        >
                            Forgot password?
                        </Link>

                    </div>

                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                {/* =====================================================
                    REGISTER LINK
                ===================================================== */}

                <p className="auth-footer">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Register
                    </Link>

                </p>

            </section>

        </main>
    );
}

export default Login;
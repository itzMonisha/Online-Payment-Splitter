import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "./Auth.css";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
    };


    const handlePhoneChange = (e) => {

        const value = e.target.value
            .replace(/\D/g, "")
            .slice(0, 10);

        setForm((previous) => ({
            ...previous,
            phone: value
        }));

        setError("");
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        // =========================
        // VALIDATION
        // =========================

        if (!form.name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (form.name.trim().length < 3) {
            setError("Name must contain at least 3 characters.");
            return;
        }

        if (!form.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!/^[0-9]{10}$/.test(form.phone)) {
            setError("Phone number must contain exactly 10 digits.");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (!form.role) {
            setError("Please select a role.");
            return;
        }


        try {

            setLoading(true);

            // =========================
            // SEND TO BACKEND
            // =========================

            const response = await registerUser({
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone,
                password: form.password,
                role: form.role
            });

            console.log(
                "REGISTRATION SUCCESS:",
                response
            );

            alert("Account created successfully!");

            navigate("/login", {
                replace: true
            });

        } catch (error) {

            console.error(
                "REGISTRATION ERROR:",
                error
            );

            const backendData =
                error?.response?.data;

            let message =
                backendData?.message ||
                backendData?.error ||
                error?.message ||
                "Unable to create your account.";

            setError(String(message));

        } finally {

            setLoading(false);

        }
    };


    return (

        <main className="auth-page">

            <section className="auth-card">

                {/* =========================
                    BRAND
                ========================= */}

                <div className="auth-brand">

                    <div className="auth-brand-icon">
                        ₹
                    </div>

                    <span className="auth-brand-text">
                        SplitPay
                    </span>

                </div>


                {/* =========================
                    HEADER
                ========================= */}

                <p className="auth-eyebrow">
                    CREATE ACCOUNT
                </p>

                <h1>
                    Join SplitPay
                </h1>

                <p className="auth-subtitle">
                    Create an account to start
                    managing shared expenses.
                </p>


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div
                        className="error-box"
                        role="alert"
                    >
                        {error}
                    </div>

                )}


                {/* =========================
                    FORM
                ========================= */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* FULL NAME */}

                    <div className="form-group">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            disabled={loading}
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            disabled={loading}
                            required
                        />

                    </div>


                    {/* PHONE */}

                    <div className="form-group">

                        <label htmlFor="phone">
                            Phone Number
                        </label>

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handlePhoneChange}
                            placeholder="Enter 10-digit phone number"
                            inputMode="numeric"
                            maxLength={10}
                            autoComplete="tel"
                            disabled={loading}
                            required
                        />

                        <small className="field-help">
                            Enter exactly 10 digits.
                        </small>

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            autoComplete="new-password"
                            disabled={loading}
                            required
                        />

                    </div>


                    {/* ROLE */}

                    <div className="form-group">

                        <label htmlFor="role">
                            Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        >

                            <option value="">
                                Select your role
                            </option>

                            <option value="USER">
                                User
                            </option>

                            <option value="ADMIN">
                                Admin
                            </option>

                        </select>

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"}

                    </button>

                </form>


                {/* FOOTER */}

                <p className="auth-footer">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </section>

        </main>
    );
}

export default Register;
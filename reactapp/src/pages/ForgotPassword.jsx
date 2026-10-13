import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
    requestPasswordReset,
    resetPassword
} from "../services/authService";

import "./Auth.css";

function ForgotPassword() {

    const [step, setStep] = useState(1);

    const [email, setEmail] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [devOtp, setDevOtp] =
        useState("");

    const handleRequestOtp = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError(
                "Please enter your registered email."
            );
            return;
        }

        try {

            setLoading(true);

            const data =
                await requestPasswordReset(
                    email.trim()
                );

            /*
             * Development OTP.
             *
             * Your current project does not have
             * an email service configured yet.
             */
            if (data?.devOtp) {
                setDevOtp(
                    String(data.devOtp)
                );
            }

            setSuccess(
                data?.message ||
                "A password reset code has been generated."
            );

            setStep(2);

        } catch (error) {

            console.error(
                "FORGOT PASSWORD ERROR:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                (
                    typeof error?.response?.data ===
                    "string"
                        ? error.response.data
                        : null
                ) ||
                "Unable to process your request.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!otp.trim()) {
            setError(
                "Please enter the OTP."
            );
            return;
        }

        if (newPassword.length < 6) {
            setError(
                "New password must contain at least 6 characters."
            );
            return;
        }

        if (
            newPassword !==
            confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        try {

            setLoading(true);

            await resetPassword({
                email: email.trim(),
                otp: otp.trim(),
                newPassword
            });

            setSuccess(
                "Password reset successfully. You can now login."
            );

            setTimeout(() => {
                window.location.href =
                    "/login";
            }, 1500);

        } catch (error) {

            console.error(
                "RESET PASSWORD ERROR:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                (
                    typeof error?.response?.data ===
                    "string"
                        ? error.response.data
                        : null
                ) ||
                "Unable to reset password.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">

            <section className="auth-card">

                <div className="auth-brand">

                    <div className="auth-brand-icon">
                        ₹
                    </div>

                    <span className="auth-brand-text">
                        SplitPay
                    </span>

                </div>

                <p className="auth-eyebrow">
                    ACCOUNT RECOVERY
                </p>

                <h1>
                    Forgot Password?
                </h1>

                <p className="auth-subtitle">
                    {step === 1
                        ? "Enter your registered email to receive a password reset code."
                        : "Enter the reset code and choose a new password."}
                </p>

                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-box">
                        {success}
                    </div>
                )}

                {step === 1 ? (

                    <form
                        className="auth-form"
                        onSubmit={handleRequestOtp}
                    >

                        <div className="form-group">

                            <label htmlFor="email">
                                Registered Email
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
                                placeholder="Enter your registered email"
                                autoComplete="email"
                                disabled={loading}
                            />

                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Generating Code..."
                                : "Send Reset Code"}
                        </button>

                    </form>

                ) : (

                    <form
                        className="auth-form"
                        onSubmit={handleResetPassword}
                    >

                        {devOtp && (
                            <div className="auth-info-box">

                                <strong>
                                    Development Reset Code
                                </strong>

                                <p>
                                    Your backend currently
                                    has no email service
                                    configured, so use this
                                    code for local testing.
                                </p>

                                <div className="otp-box">
                                    {devOtp}
                                </div>

                            </div>
                        )}

                        <div className="form-group">

                            <label htmlFor="otp">
                                Reset Code
                            </label>

                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(event) =>
                                    setOtp(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                disabled={loading}
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="newPassword">
                                New Password
                            </label>

                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Minimum 6 characters"
                                autoComplete="new-password"
                                disabled={loading}
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="confirmPassword">
                                Confirm New Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={
                                    confirmPassword
                                }
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Confirm your new password"
                                autoComplete="new-password"
                                disabled={loading}
                            />

                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Resetting Password..."
                                : "Reset Password"}
                        </button>

                        <button
                            type="button"
                            className="auth-secondary-button"
                            onClick={() => {
                                setStep(1);
                                setOtp("");
                                setError("");
                                setSuccess("");
                                setDevOtp("");
                            }}
                            disabled={loading}
                        >
                            Use Different Email
                        </button>

                    </form>
                )}

                <p className="auth-footer">

                    Remember your password?{" "}

                    <Link to="/login">
                        Back to Login
                    </Link>

                </p>

            </section>

        </main>
    );
}

export default ForgotPassword;
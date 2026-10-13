import React, {
    useEffect,
    useState
} from "react";

import {
    Bell,
    Sun,
    Moon,
    Shield,
    Lock,
    UserCircle,
    LogOut,
    Save,
    CheckCircle
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import Sidebar from "../components/Sidebar";

import "./Settings.css";


function Settings() {

    const navigate = useNavigate();


    // =====================================================
    // SETTINGS STATE
    // =====================================================

    const [pushNotifications, setPushNotifications] =
        useState(() => {

            const value =
                localStorage.getItem(
                    "pushNotifications"
                );

            return value === null
                ? true
                : value === "true";
        });


    const [emailNotifications, setEmailNotifications] =
        useState(() => {

            const value =
                localStorage.getItem(
                    "emailNotifications"
                );

            return value === null
                ? true
                : value === "true";
        });


    const [darkMode, setDarkMode] =
        useState(() => {

            return (
                localStorage.getItem(
                    "darkMode"
                ) === "true"
            );
        });


    const [saved, setSaved] =
        useState(false);


    // =====================================================
    // APPLY DARK MODE
    // =====================================================
useEffect(() => {

    const html = document.documentElement;
    const body = document.body;

    if (darkMode) {

        // Enable BOTH class names because
        // the project currently contains CSS
        // for both dark-mode systems.

        html.classList.add("dark-mode");
        body.classList.add("dark-mode");

        body.classList.add("splitpay-dark-mode");

        localStorage.setItem(
            "darkMode",
            "true"
        );

    } else {

        html.classList.remove("dark-mode");
        body.classList.remove("dark-mode");

        body.classList.remove(
            "splitpay-dark-mode"
        );

        localStorage.setItem(
            "darkMode",
            "false"
        );
    }

}, [darkMode]);


    // =====================================================
    // APPLY SAVED THEME ON PAGE LOAD
    // =====================================================

    useEffect(() => {

        const savedDarkMode =
            localStorage.getItem(
                "darkMode"
            ) === "true";


        setDarkMode(
            savedDarkMode
        );


    }, []);


    // =====================================================
    // SAVE SETTINGS
    // =====================================================

    const handleSave = () => {

        localStorage.setItem(
            "pushNotifications",
            String(pushNotifications)
        );


        localStorage.setItem(
            "emailNotifications",
            String(emailNotifications)
        );


        localStorage.setItem(
            "darkMode",
            String(darkMode)
        );


        setSaved(true);


        setTimeout(() => {

            setSaved(false);

        }, 2500);

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        // Remove authentication data
        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "role"
        );

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "authToken"
        );

        localStorage.removeItem(
            "currentUser"
        );


        // Remove dark mode from current page
        document.documentElement.classList.remove(
            "dark-mode"
        );

        document.body.classList.remove(
            "dark-mode"
        );


        // Remove saved dark mode
        localStorage.removeItem(
            "darkMode"
        );


        // Go to login
        window.location.replace(
            "/login"
        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="app-layout">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="main-content">


                <div className="settings-page">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="settings-header">

                        <div>

                            <span className="settings-eyebrow">
                                ACCOUNT
                            </span>


                            <h1>
                                Settings
                            </h1>


                            <p className="settings-subtitle">
                                Manage your account preferences
                                and application settings.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="settings-save-button"
                            onClick={handleSave}
                        >

                            <Save size={17} />

                            Save Settings

                        </button>

                    </div>


                    {/* =================================================
                        SUCCESS MESSAGE
                    ================================================= */}

                    {saved && (

                        <div className="settings-success">

                            <CheckCircle size={18} />

                            <span>
                                Settings saved successfully.
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        NOTIFICATIONS
                    ================================================= */}

                    <section className="settings-card">


                        <div className="settings-card-header">

                            <div className="settings-card-icon purple">

                                <Bell size={21} />

                            </div>


                            <div>

                                <h2>
                                    Notifications
                                </h2>

                                <p>
                                    Control how SplitPay keeps
                                    you updated.
                                </p>

                            </div>

                        </div>


                        {/* PUSH NOTIFICATIONS */}

                        <div className="settings-option">

                            <div className="option-icon">

                                <Bell size={18} />

                            </div>


                            <div className="option-content">

                                <strong>
                                    Push Notifications
                                </strong>

                                <span>
                                    Receive notifications about
                                    groups, expenses and settlements.
                                </span>

                            </div>


                            <label className="toggle">

                                <input
                                    type="checkbox"
                                    checked={
                                        pushNotifications
                                    }
                                    onChange={(e) =>
                                        setPushNotifications(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span className="toggle-slider"></span>

                            </label>

                        </div>


                        {/* EMAIL NOTIFICATIONS */}

                        <div className="settings-option">

                            <div className="option-icon">

                                <Bell size={18} />

                            </div>


                            <div className="option-content">

                                <strong>
                                    Email Notifications
                                </strong>

                                <span>
                                    Receive important account
                                    updates through email.
                                </span>

                            </div>


                            <label className="toggle">

                                <input
                                    type="checkbox"
                                    checked={
                                        emailNotifications
                                    }
                                    onChange={(e) =>
                                        setEmailNotifications(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span className="toggle-slider"></span>

                            </label>

                        </div>


                    </section>


                    {/* =================================================
                        APPEARANCE
                    ================================================= */}

                    <section className="settings-card">


                        <div className="settings-card-header">

                            <div className="settings-card-icon yellow">

                                {darkMode ? (

                                    <Moon size={21} />

                                ) : (

                                    <Sun size={21} />

                                )}

                            </div>


                            <div>

                                <h2>
                                    Appearance
                                </h2>

                                <p>
                                    Customize how SplitPay
                                    looks for you.
                                </p>

                            </div>

                        </div>


                        {/* DARK MODE */}

                        <div className="settings-option">

                            <div className="option-icon">

                                {darkMode ? (

                                    <Moon size={18} />

                                ) : (

                                    <Sun size={18} />

                                )}

                            </div>


                            <div className="option-content">

                                <strong>
                                    Dark Mode
                                </strong>

                                <span>
                                    Use a darker appearance
                                    throughout the application.
                                </span>

                            </div>


                            <label className="toggle">

                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={(e) => {

                                        setDarkMode(
                                            e.target.checked
                                        );

                                    }}
                                />

                                <span className="toggle-slider"></span>

                            </label>

                        </div>


                    </section>


                    {/* =================================================
                        SECURITY
                    ================================================= */}

                    <section className="settings-card">


                        <div className="settings-card-header">

                            <div className="settings-card-icon blue">

                                <Shield size={21} />

                            </div>


                            <div>

                                <h2>
                                    Security
                                </h2>

                                <p>
                                    Manage your account security.
                                </p>

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="settings-security-row">

                            <div className="option-icon">

                                <Lock size={18} />

                            </div>


                            <div className="option-content">

                                <strong>
                                    Password
                                </strong>

                                <span>
                                    Keep your account secure
                                    with a strong password.
                                </span>

                            </div>


                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    navigate(
                                        "/forgot-password"
                                    )
                                }
                            >

                                Change

                            </button>

                        </div>


                        {/* ACCOUNT */}

                        <div className="settings-security-row">

                            <div className="option-icon">

                                <UserCircle size={18} />

                            </div>


                            <div className="option-content">

                                <strong>
                                    Account
                                </strong>

                                <span>
                                    Manage your SplitPay
                                    profile information.
                                </span>

                            </div>


                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    navigate(
                                        "/profile"
                                    )
                                }
                            >

                                View Profile

                            </button>

                        </div>


                    </section>


                    {/* =================================================
                        ACCOUNT ACTIONS
                    ================================================= */}

                    <section className="settings-card logout-card">


                        <div className="settings-card-header">

                            <div className="settings-card-icon red">

                                <LogOut size={21} />

                            </div>


                            <div>

                                <h2>
                                    Account Actions
                                </h2>

                                <p>
                                    Actions related to your
                                    current session.
                                </p>

                            </div>

                        </div>


                        <div className="logout-content">


                            <div>

                                <strong>
                                    Logout from SplitPay
                                </strong>

                                <p>
                                    This will end your current
                                    session on this device.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="logout-button"
                                onClick={handleLogout}
                            >

                                <LogOut size={17} />

                                <span>
                                    Logout
                                </span>

                            </button>


                        </div>


                    </section>


                </div>


            </main>


        </div>

    );

}


export default Settings;
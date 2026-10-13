import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    Wallet,
    ArrowRightLeft,
    Bell,
    UserCircle,
    Settings,
    LogOut,
    ShieldCheck
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {

    const navigate = useNavigate();

    // =========================================================
    // GET LOGGED-IN USER
    // =========================================================

    let user = null;

    try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (error) {
        console.error("Error reading user from localStorage:", error);
    }

    // =========================================================
    // USER DETAILS
    // =========================================================

    const userName =
        user?.name ||
        user?.username ||
        user?.fullName ||
        "User";

    const userEmail =
        user?.email ||
        "";

    const role = String(
        user?.role ||
        localStorage.getItem("role") ||
        "USER"
    )
        .trim()
        .toUpperCase();

    // =========================================================
    // CHECK ADMIN
    // =========================================================

    const isAdmin = role === "ADMIN";

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        // Clear all authentication information
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        // Clear alternative keys if they exist
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");

        // Go to login page
        navigate("/login", {
            replace: true
        });

        // Make sure browser history doesn't keep dashboard
        window.history.replaceState(
            null,
            "",
            "/login"
        );
    };

    // =========================================================
    // NAVIGATION CLASS
    // =========================================================

    const getNavLinkClass = ({ isActive }) => {
        return `sidebar-link ${isActive ? "active" : ""}`;
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <aside className="sidebar">

            {/* =================================================
                LOGO
            ================================================= */}

            <div className="sidebar-logo">

                <div className="sidebar-logo-icon">
                    <Wallet size={24} />
                </div>

                <div className="sidebar-logo-text">
                    <h2>SplitPay</h2>
                    <span>Payment Splitter</span>
                </div>

            </div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className="sidebar-nav">

                {/* ================= MAIN MENU ================= */}

                <p className="sidebar-section-title">
                    MAIN MENU
                </p>

                <NavLink
                    to="/dashboard"
                    className={getNavLinkClass}
                >
                    <LayoutDashboard size={19} />
                    <span>Dashboard</span>
                </NavLink>


                <NavLink
                    to="/groups"
                    className={getNavLinkClass}
                >
                    <Users size={19} />
                    <span>Groups</span>
                </NavLink>


                <NavLink
                    to="/expenses"
                    className={getNavLinkClass}
                >
                    <Wallet size={19} />
                    <span>Expenses</span>
                </NavLink>


                <NavLink
                    to="/settlements"
                    className={getNavLinkClass}
                >
                    <ArrowRightLeft size={19} />
                    <span>Settlements</span>
                </NavLink>


                {/* ================= ACCOUNT ================= */}

                <p className="sidebar-section-title sidebar-account-title">
                    ACCOUNT
                </p>


                <NavLink
                    to="/notifications"
                    className={getNavLinkClass}
                >
                    <Bell size={19} />
                    <span>Notifications</span>
                </NavLink>


                <NavLink
                    to="/profile"
                    className={getNavLinkClass}
                >
                    <UserCircle size={19} />
                    <span>Profile</span>
                </NavLink>


                <NavLink
                    to="/settings"
                    className={getNavLinkClass}
                >
                    <Settings size={19} />
                    <span>Settings</span>
                </NavLink>


                {/* ================= ADMIN ================= */}

                {isAdmin && (
                    <>
                        <p className="sidebar-section-title sidebar-admin-title">
                            ADMINISTRATION
                        </p>

                        <NavLink
                            to="/admin-dashboard"
                            className={getNavLinkClass}
                        >
                            <ShieldCheck size={19} />
                            <span>Admin Dashboard</span>
                        </NavLink>
                    </>
                )}

            </nav>


            {/* =================================================
                USER FOOTER
            ================================================= */}

            <div className="sidebar-footer">

                <div className="sidebar-user">

                    {/* USER TOP */}

                    <div className="sidebar-user-top">

                        <div className="sidebar-user-avatar">
                            {userName
                                .charAt(0)
                                .toUpperCase()}
                        </div>


                        <div className="sidebar-user-info">

                            <strong className="sidebar-user-name">
                                {userName}
                            </strong>

                            <span className="sidebar-user-email">
                                {userEmail}
                            </span>

                            <span
                                className={
                                    isAdmin
                                        ? "sidebar-user-role admin-role"
                                        : "sidebar-user-role"
                                }
                            >
                                {role}
                            </span>

                        </div>

                    </div>


                    {/* LOGOUT BUTTON */}

                    <button
                        type="button"
                        className="sidebar-logout"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut size={17} />
                        <span>Logout</span>
                    </button>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;
import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// =====================================================
// PAGES
// =====================================================

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Groups from "./pages/Groups";
import GroupDetails from "./pages/GroupDetails";

import Expenses from "./pages/Expenses";
import Settlements from "./pages/Settlements";

import Notifications from "./pages/Notifications";
import UserNotifications from "./pages/UserNotifications";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import CreateGroup from "./pages/CreateGroup";
import AddExpense from "./pages/AddExpense";

import AdminDashboard from "./pages/AdminDashboard";

// =====================================================
// DASHBOARD ROUTER
// =====================================================

function DashboardRouter() {

    const storedUser = localStorage.getItem("user");

    // NOT LOGGED IN
    if (!storedUser) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    try {

        const user = JSON.parse(storedUser);

        const role = String(
            user?.role || ""
        )
            .toUpperCase()
            .trim();

        // ADMIN
        if (role === "ADMIN") {
            return <Dashboard />;
        }

        // NORMAL USER
        return <UserDashboard />;

    } catch (error) {

        console.error(
            "Unable to determine user role:",
            error
        );

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }
}

// =====================================================
// NOTIFICATION ROUTER
// =====================================================

function NotificationRouter() {

    const storedUser =
        localStorage.getItem("user");

    // NOT LOGGED IN
    if (!storedUser) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    try {

        const user =
            JSON.parse(storedUser);

        const role =
            String(
                user?.role || ""
            )
                .toUpperCase()
                .trim();

        // ADMIN
        if (role === "ADMIN") {
            return <Notifications />;
        }

        // USER
        return <UserNotifications />;

    } catch (error) {

        console.error(
            "Unable to determine notification role:",
            error
        );

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }
}

// =====================================================
// APP
// =====================================================

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =================================================
                    LOGIN
                ================================================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                {/* =================================================
                    ROOT
                ================================================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                {/* =================================================
                    DASHBOARD
                    Automatically selects ADMIN / USER
                ================================================= */}

                <Route
                    path="/dashboard"
                    element={<DashboardRouter />}
                />

                {/* =================================================
                    GROUPS
                ================================================= */}

                <Route
                    path="/groups"
                    element={<Groups />}
                />

                {/* =================================================
                    CREATE GROUP
                ================================================= */}

                <Route
                    path="/groups/create"
                    element={<CreateGroup />}
                />

                {/* =================================================
                    GROUP DETAILS
                    IMPORTANT:
                    /groups/:id
                ================================================= */}

                <Route
                    path="/groups/:id"
                    element={<GroupDetails />}
                />

                {/* =================================================
                    EXPENSES
                ================================================= */}

                <Route
                    path="/expenses"
                    element={<Expenses />}
                />

                {/* =================================================
                    ADD EXPENSE
                ================================================= */}

                <Route
                    path="/expenses/add"
                    element={<AddExpense />}
                />

                {/* =================================================
                    SETTLEMENTS
                ================================================= */}

                <Route
                    path="/settlements"
                    element={<Settlements />}
                />

                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <Route
                    path="/notifications"
                    element={<NotificationRouter />}
                />

                {/* =================================================
                    PROFILE
                ================================================= */}

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                {/* =================================================
                    SETTINGS
                ================================================= */}

                <Route
                    path="/settings"
                    element={<Settings />}
                />

                {/* =================================================
                    ADMIN DASHBOARD
                ================================================= */}

                <Route
                    path="/admin-dashboard"
                    element={<AdminDashboard />}
                />

                {/* =================================================
                    UNKNOWN URL
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />
                <Route 
                    path="/notifications" 
                    element={<Notifications />} 
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
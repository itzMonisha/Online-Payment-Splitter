import React, { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";

import {
    LayoutDashboard,
    Users,
    Receipt,
    ArrowLeftRight,
    Bell,
    UserCircle,
    Settings,
    LogOut,
    RefreshCw,
    Plus,
    ChevronRight,
    WalletCards,
    CircleDollarSign
} from "lucide-react";

import "./UserDashboard.css";

import { getGroupsByUser } from "../services/groupService";
import { getExpensesByUser } from "../services/expenseService";

function UserDashboard() {

    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [expenses, setExpenses] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const storedUser = localStorage.getItem("user");

            if (!storedUser) {

                setError(
                    "User session not found. Please login again."
                );

                return;
            }

            let loggedInUser;

            try {

                loggedInUser = JSON.parse(storedUser);

            } catch (err) {

                console.error("USER JSON ERROR:", err);

                setError(
                    "Invalid user session. Please login again."
                );

                return;
            }

            const userId =
                loggedInUser?.id ||
                loggedInUser?.userId;

            if (!userId) {

                setError(
                    "User ID not found. Please login again."
                );

                return;
            }

            setUser(loggedInUser);

            // =================================================
            // LOAD GROUPS + EXPENSES
            // =================================================

            const [
                groupsData,
                expensesData
            ] = await Promise.all([

                getGroupsByUser(
                    Number(userId)
                ),

                getExpensesByUser(
                    Number(userId)
                )

            ]);

            setGroups(
                Array.isArray(groupsData)
                    ? groupsData
                    : []
            );

            setExpenses(
                Array.isArray(expensesData)
                    ? expensesData
                    : []
            );

        } catch (err) {

            console.error(
                "DASHBOARD LOADING ERROR:",
                err
            );

            if (
                err?.response?.status === 401 ||
                err?.response?.status === 403
            ) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else {

                setError(
                    err?.response?.data?.message ||
                    "Unable to load dashboard data."
                );
            }

            setGroups([]);
            setExpenses([]);

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadDashboard();

    }, []);

    // =====================================================
    // USER NAME
    // =====================================================

    const userName =
        user?.name ||
        user?.username ||
        "User";

    // =====================================================
    // NAVIGATION
    // =====================================================

    const goTo = (path) => {

        window.location.href = path;

    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to logout?"
            );

        if (!confirmed) {
            return;
        }

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");

        window.location.replace("/login");
    };

    // =====================================================
    // GROUP NAME
    // =====================================================

    const getGroupName = (expense) => {

        if (expense?.groupName) {
            return expense.groupName;
        }

        if (expense?.group?.groupName) {
            return expense.group.groupName;
        }

        if (expense?.group?.name) {
            return expense.group.name;
        }

        const group =
            groups.find(
                item =>
                    Number(item.id) ===
                    Number(expense?.groupId)
            );

        return (
            group?.groupName ||
            group?.name ||
            "Unknown Group"
        );
    };

    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (value) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ).format(
            Number(value || 0)
        );

    };

    // =====================================================
    // TOTAL EXPENSE
    // =====================================================

    const totalExpenseAmount =
        expenses.reduce(
            (total, expense) => {

                return (
                    total +
                    Number(
                        expense?.amount || 0
                    )
                );

            },
            0
        );

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="user-dashboard-layout dashboard-layout">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="user-sidebar dashboard-sidebar">

                {/* BRAND */}

                <div className="user-brand">

                    <div className="user-brand-icon">

                        <WalletCards size={25} />

                    </div>

                    <div>

                        <h2>
                            SplitPay
                        </h2>

                        <span>
                            Payment Splitter
                        </span>

                    </div>

                </div>


                {/* MAIN MENU */}

                <div className="user-sidebar-section">

                    <p className="user-sidebar-heading">
                        MAIN MENU
                    </p>


                    <button
                        className="user-sidebar-link active"
                        onClick={() =>
                            goTo("/dashboard")
                        }
                    >

                        <LayoutDashboard size={19} />

                        <span>
                            Dashboard
                        </span>

                    </button>


                    <button
                        className="user-sidebar-link"
                        onClick={() =>
                            goTo("/groups")
                        }
                    >

                        <Users size={19} />

                        <span>
                            Groups
                        </span>

                    </button>


                    <button
                        className="user-sidebar-link"
                        onClick={() =>
                            goTo("/expenses")
                        }
                    >

                        <Receipt size={19} />

                        <span>
                            Expenses
                        </span>

                    </button>


                    <button
                        className="user-sidebar-link"
                        onClick={() =>
                            goTo("/settlements")
                        }
                    >

                        <ArrowLeftRight size={19} />

                        <span>
                            Settlements
                        </span>

                    </button>

                </div>


                {/* ACCOUNT */}

                <div className="user-sidebar-section account-section">

                    <p className="user-sidebar-heading">
                        ACCOUNT
                    </p>


                    <button
                        className="user-sidebar-link"
                        onClick={() =>
                            goTo("/notifications")
                        }
                    >

                        <Bell size={19} />

                        <span>
                            Notifications
                        </span>

                    </button>


                    <button
                        className="user-sidebar-link"
                        onClick={() =>
                            goTo("/profile")
                        }
                    >

                        <UserCircle size={19} />

                        <span>
                            Profile
                        </span>

                    </button>


                    <button
                        className="user-sidebar-link"
                        onClick={() =>
                            goTo("/settings")
                        }
                    >

                        <Settings size={19} />

                        <span>
                            Settings
                        </span>

                    </button>

                </div>


                {/* BOTTOM */}

                <div className="user-sidebar-bottom">

                    <div className="user-help-box">

                        <div className="user-help-icon">
                            ?
                        </div>

                        <div>

                            <strong>
                                Need help?
                            </strong>

                            <span>
                                We're here for you.
                            </span>

                        </div>

                    </div>


                    <div className="user-user-box">

                        <div className="user-avatar">

                            {userName
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <div>

                            <strong>
                                {userName}
                            </strong>

                            <span>
                                USER
                            </span>

                        </div>

                    </div>


                    <button
                        className="user-logout"
                        onClick={handleLogout}
                    >

                        <LogOut size={17} />

                        Logout

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="user-dashboard-main dashboard-page">

                {/* HEADER */}

                <header className="user-dashboard-header">

                    <div>

                        <p className="user-dashboard-eyebrow">
                            PERSONAL OVERVIEW
                        </p>

                        <h1>
                            Dashboard
                        </h1>

                        <p className="user-dashboard-subtitle">
                            Your personal overview of
                            groups and shared expenses.
                        </p>

                    </div>


                    <button
                        className="user-refresh-button"
                        onClick={loadDashboard}
                        disabled={loading}
                    >

                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "user-refresh-spin"
                                    : ""
                            }
                        />

                        {loading
                            ? "Refreshing..."
                            : "Refresh"}

                    </button>

                </header>


                {/* WELCOME */}

                <section className="user-welcome-banner">

                    <div className="user-welcome-content">

                        <span>
                            Welcome back 👋
                        </span>

                        <h2>
                            {userName},
                            here's your
                            SplitPay overview
                        </h2>

                        <p>
                            See your groups and
                            shared expenses
                            in one place.
                        </p>

                    </div>


                    <button
                        className="user-create-group-button"
                        onClick={() =>
                            goTo("/groups")
                        }
                    >

                        <Plus size={18} />

                        Create Group

                    </button>

                </section>


                {/* ERROR */}

                {error && (

                    <div className="user-dashboard-error">
                        {error}
                    </div>

                )}


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <div className="user-dashboard-summary-grid">


                    {/* GROUPS */}

                    <div className="user-summary-card">

                        <div className="user-summary-icon purple">

                            <Users size={21} />

                        </div>

                        <div>

                            <span>
                                My Groups
                            </span>

                            <strong>
                                {groups.length}
                            </strong>

                        </div>

                    </div>


                    {/* EXPENSES */}

                    <div className="user-summary-card">

                        <div className="user-summary-icon blue">

                            <Receipt size={21} />

                        </div>

                        <div>

                            <span>
                                My Expenses
                            </span>

                            <strong>
                                {expenses.length}
                            </strong>

                        </div>

                    </div>


                    {/* TOTAL EXPENSE */}

                    <div className="user-summary-card">

                        <div className="user-summary-icon orange">

                            <CircleDollarSign size={21} />

                        </div>

                        <div>

                            <span>
                                Total Expenses
                            </span>

                            <strong>
                                ₹{formatMoney(
                                    totalExpenseAmount
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* SETTLEMENT */}

                    <div
                        className="user-summary-card clickable"
                        onClick={() =>
                            goTo("/settlements")
                        }
                    >

                        <div className="user-summary-icon green">

                            <ArrowLeftRight size={21} />

                        </div>

                        <div>

                            <span>
                                Settlements
                            </span>

                            <strong>
                                View
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    GROUPS + EXPENSES
                ================================================= */}

                <div className="user-dashboard-grid">


                    {/* =================================================
                        GROUPS
                    ================================================= */}

                    <section className="user-feature-card">

                        <div className="user-feature-header">

                            <div className="user-feature-title">

                                <div className="feature-icon purple">

                                    <Users size={20} />

                                </div>

                                <div>

                                    <h2>
                                        My Groups
                                    </h2>

                                    <p>
                                        Groups you're
                                        currently involved in.
                                    </p>

                                </div>

                            </div>


                            <button
                                className="user-view-all"
                                onClick={() =>
                                    goTo("/groups")
                                }
                            >

                                View All

                                <ChevronRight size={16} />

                            </button>

                        </div>


                        <div className="user-feature-body">

                            {loading ? (

                                <div className="user-empty-state">

                                    <div className="user-loading-spinner">

                                        <RefreshCw size={22} />

                                    </div>

                                    <strong>
                                        Loading groups...
                                    </strong>

                                </div>

                            ) : groups.length === 0 ? (

                                <div className="user-empty-state">

                                    <div className="user-empty-icon purple">

                                        <Users size={24} />

                                    </div>

                                    <strong>
                                        No groups yet
                                    </strong>

                                    <p>
                                        You are not part
                                        of any groups yet.
                                    </p>

                                    <button
                                        className="user-empty-button"
                                        onClick={() =>
                                            goTo("/groups")
                                        }
                                    >

                                        <Plus size={16} />

                                        Create Group

                                    </button>

                                </div>

                            ) : (

                                <div className="user-list">

                                    {groups
                                        .slice(0, 5)
                                        .map(group => (

                                            <div
                                                className="user-list-item"
                                                key={group.id}
                                            >

                                                <div className="user-list-icon purple">

                                                    <Users size={18} />

                                                </div>


                                                <div className="user-list-content">

                                                    <strong>

                                                        {group.groupName ||
                                                            group.name ||
                                                            "Unnamed Group"}

                                                    </strong>

                                                    <span>

                                                        {group.description ||
                                                            "Shared expense group"}

                                                    </span>

                                                </div>


                                                <button
                                                    className="user-list-arrow"
                                                    onClick={() =>
                                                        goTo(
                                                            `/groups/${group.id}`
                                                        )
                                                    }
                                                >

                                                    <ChevronRight
                                                        size={19}
                                                    />

                                                </button>

                                            </div>

                                        ))}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* =================================================
                        RECENT EXPENSES
                    ================================================= */}

                    <section className="user-feature-card">

                        <div className="user-feature-header">

                            <div className="user-feature-title">

                                <div className="feature-icon blue">

                                    <Receipt size={20} />

                                </div>

                                <div>

                                    <h2>
                                        Recent Expenses
                                    </h2>

                                    <p>
                                        Your latest shared expenses.
                                    </p>

                                </div>

                            </div>


                            <button
                                className="user-view-all"
                                onClick={() =>
                                    goTo("/expenses")
                                }
                            >

                                View All

                                <ChevronRight size={16} />

                            </button>

                        </div>


                        <div className="user-feature-body">

                            {loading ? (

                                <div className="user-empty-state">

                                    <div className="user-loading-spinner">

                                        <RefreshCw size={22} />

                                    </div>

                                    <strong>
                                        Loading expenses...
                                    </strong>

                                </div>

                            ) : expenses.length === 0 ? (

                                <div className="user-empty-state">

                                    <div className="user-empty-icon blue">

                                        <Receipt size={24} />

                                    </div>

                                    <strong>
                                        No expenses yet
                                    </strong>

                                    <p>
                                        Your shared
                                        expenses will
                                        appear here.
                                    </p>

                                    <button
                                        className="user-empty-button"
                                        onClick={() =>
                                            goTo("/expenses")
                                        }
                                    >

                                        <Plus size={16} />

                                        View Expenses

                                    </button>

                                </div>

                            ) : (

                                <div className="user-personal-expenses-list">

                                    {expenses
                                        .slice(0, 5)
                                        .map(expense => (

                                            <div
                                                className="user-personal-expense-card"
                                                key={expense.id}
                                            >

                                                <div className="personal-expense-top">

                                                    <div className="user-list-icon blue">

                                                        <CircleDollarSign
                                                            size={18}
                                                        />

                                                    </div>


                                                    <div className="personal-expense-title">

                                                        <strong>

                                                            {expense.name ||
                                                                expense.title ||
                                                                "Expense"}

                                                        </strong>

                                                        <span>

                                                            {expense.category ||
                                                                "Other"}

                                                        </span>

                                                    </div>


                                                    <strong className="personal-expense-total">

                                                        ₹
                                                        {formatMoney(
                                                            expense.amount
                                                        )}

                                                    </strong>

                                                </div>


                                                <div className="personal-expense-meta">

                                                    <span>
                                                        Group
                                                    </span>

                                                    <strong>
                                                        {getGroupName(
                                                            expense
                                                        )}
                                                    </strong>

                                                </div>


                                                <div className="personal-expense-meta">

                                                    <span>
                                                        Expense
                                                    </span>

                                                    <strong>
                                                        Shared Expense
                                                    </strong>

                                                </div>

                                            </div>

                                        ))}

                                </div>

                            )}

                        </div>


                        {expenses.length > 0 && (

                            <div className="user-feature-footer">

                                <span>
                                    Total expense amount
                                </span>

                                <strong>
                                    ₹
                                    {formatMoney(
                                        totalExpenseAmount
                                    )}
                                </strong>

                            </div>

                        )}

                    </section>

                </div>

            </main>

        </div>
    );
}

/*
 * =========================================================
 * ROLE-BASED DASHBOARD
 * =========================================================
 *
 * This file is Dashboard.jsx.
 *
 * ADMIN -> AdminDashboard
 * USER  -> existing UserDashboard content above
 *
 * We keep the complete existing UserDashboard code above,
 * so no user-dashboard functionality is lost.
 */
function Dashboard() {
    let loggedInUser = null;

    try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            loggedInUser = JSON.parse(storedUser);
        }
    } catch (error) {
        console.error(
            "Error reading logged-in user:",
            error
        );
    }

    const role = String(
        loggedInUser?.role ||
        localStorage.getItem("role") ||
        "USER"
    )
        .trim()
        .toUpperCase();

    console.log(
        "DASHBOARD ROLE:",
        role
    );

    if (role === "ADMIN") {
        return <AdminDashboard />;
    }

    return <UserDashboard />;
}

export default Dashboard;
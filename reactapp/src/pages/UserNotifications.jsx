import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
    Bell,
    CheckCircle,
    Wallet,
    ArrowDownLeft,
    ArrowUpRight,
    Receipt,
    Users,
    RefreshCw,
    Clock
} from "lucide-react";

import api from "../services/api";

import {
    getNotifications,
    getNotificationsByUser
} from "../services/notificationService";

import "./UserNotifications.css";

function UserNotifications() {


    const [notifications, setNotifications] = useState([]);
    const [activities, setActivities] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const getLoggedInUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "USER PARSE ERROR:",
                error
            );

            return null;
        }
    };


    // =====================================================
    // GET USER ID
    // =====================================================

    const getUserId = (currentUser) => {

        return (
            currentUser?.id ||
            currentUser?.userId ||
            currentUser?.userID
        );
    };


    // =====================================================
    // LOAD DATA
    // =====================================================

   const loadNotifications = useCallback(async () => {

        try {

            setRefreshing(true);

            const currentUser =
                getLoggedInUser();

            setCurrentUser(
                currentUser
            );

            if (!currentUser) {

                setNotifications([]);
                setActivities([]);

                return;
            }

            const userId =
                getUserId(currentUser);

            const currentUserIsAdmin =
                String(
                    currentUser?.role ||
                    currentUser?.userRole ||
                    ""
                ).toUpperCase() === "ADMIN";

            if (!userId) {

                console.error(
                    "USER ID NOT FOUND:",
                    currentUser
                );

                return;
            }


            // =================================================
            // 1. GET REAL NOTIFICATIONS
            // =================================================

            let notificationData = [];

            try {

                const response =
                    currentUserIsAdmin
                        ? await getNotifications()
                        : await getNotificationsByUser(
                            userId
                        );

                notificationData =
                    Array.isArray(response.data)
                        ? response.data
                        : [];

            } catch (error) {

                console.error(
                    "NOTIFICATION API ERROR:",
                    error
                );
            }


            setNotifications(
                notificationData
            );


            // =================================================
            // 2. GET USER EXPENSES
            // =================================================

            let expenseData = [];

            try {

                const response =
                    currentUserIsAdmin
                        ? await api.get(
                            "/expenses"
                        )
                        : await api.get(
                            `/expenses/user/${userId}`
                        );

                expenseData =
                    Array.isArray(response.data)
                        ? response.data
                        : [];

            } catch (error) {

                console.error(
                    "EXPENSE API ERROR:",
                    error
                );
            }


            // =================================================
            // 3. GET DETAILED EXPENSE INFORMATION
            // =================================================

            const generatedActivities = [];

            for (
                const expense
                of expenseData
            ) {

                try {

                    const response =
                        await api.get(
                            `/expenses/${expense.id}/user/${userId}`
                        );

                    const detail =
                        response.data;

                    if (!detail) {
                        continue;
                    }


                    // =========================================
                    // DETERMINE ACTIVITY TYPE
                    // =========================================

                    let type = "expense";

                    if (
                        Number(
                            detail.amountToPay
                        ) > 0
                    ) {

                        type = "owe";

                    } else if (
                        Number(
                            detail.amountToReceive
                        ) > 0
                    ) {

                        type = "receive";

                    }


                    generatedActivities.push({

                        id:
                            `expense-${detail.expenseId}`,

                        type,

                        expenseId:
                            detail.expenseId,

                        expenseName:
                            detail.name ||
                            "Expense",

                        amount:
                            Number(
                                detail.amount || 0
                            ),

                        groupName:
                            detail.groupName ||
                            "Group",

                        paidBy:
                            detail.paidByUserName ||
                            "Unknown",

                        userShare:
                            Number(
                                detail.userShare || 0
                            ),

                        amountToPay:
                            Number(
                                detail.amountToPay || 0
                            ),

                        amountToReceive:
                            Number(
                                detail.amountToReceive || 0
                            ),

                        category:
                            detail.category ||
                            "Expense",

                        shares:
                            detail.shares || [],

                        createdAt:
                            expense.createdAt ||
                            new Date().toISOString()

                    });

                } catch (error) {

                    console.error(
                        `DETAIL ERROR FOR EXPENSE ${expense.id}:`,
                        error
                    );
                }
            }


            // =================================================
            // 4. COMBINE REAL + GENERATED ACTIVITIES
            // =================================================

            const combined = [

                ...notificationData.map(
                    notification => ({

                        id:
                            `notification-${notification.id}`,

                        type:
                            notification.isRead
                                ? "read"
                                : "notification",

                        message:
                            notification.message,

                        expenseName:
                            notification.expenseName,

                        groupName:
                            notification.groupName,

                        createdAt:
                            notification.createdAt,

                        isRead:
                            notification.isRead

                    })
                ),

                ...generatedActivities

            ];


            // =================================================
            // REMOVE DUPLICATES
            // =================================================

            const uniqueActivities =
                combined.filter(
                    (item, index, self) =>
                        index ===
                        self.findIndex(
                            other =>
                                other.id ===
                                item.id
                        )
                );


            // =================================================
            // SORT NEWEST FIRST
            // =================================================

            uniqueActivities.sort(
                (a, b) =>
                    new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    )
            );


            setActivities(
                uniqueActivities
            );

        } catch (error) {

            console.error(
                "LOAD NOTIFICATIONS ERROR:",
                error
            );

          } finally {
        setLoading(false);
        setRefreshing(false);
    }
}, []);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

 useEffect(() => {
    loadNotifications();
}, [loadNotifications]);
    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "Recently";
        }

        try {

            return new Date(date)
                .toLocaleString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        } catch {

            return "Recently";
        }
    };


    // =====================================================
    // ACTIVITY TITLE
    // =====================================================

    const getTitle = (activity) => {

        if (
            activity.type === "owe"
        ) {

            return "Payment due";

        }

        if (
            activity.type === "receive"
        ) {

            return "Payment received";

        }

        if (
            activity.type === "notification"
        ) {

            return "New notification";

        }

        if (
            activity.type === "read"
        ) {

            return "Notification";

        }

        return "Expense activity";
    };


    // =====================================================
    // ACTIVITY MESSAGE
    // =====================================================

    const getMessage = (activity) => {

        if (
            activity.message
        ) {

            return activity.message;
        }


        if (
            activity.type === "owe"
        ) {

            return (
                `You owe ₹${activity.amountToPay.toFixed(2)} ` +
                `for "${activity.expenseName}" ` +
                `in ${activity.groupName}.`
            );
        }


        if (
            activity.type === "receive"
        ) {

            return (
                `${activity.paidBy} paid ₹${activity.amount.toFixed(2)} ` +
                `for "${activity.expenseName}". ` +
                `You should receive ₹${activity.amountToReceive.toFixed(2)}.`
            );
        }


        return (
            `"${activity.expenseName}" ` +
            `was added to ${activity.groupName}. ` +
            `Paid by ${activity.paidBy}.`
        );
    };


    // =====================================================
    // ICON
    // =====================================================

    const getIcon = (activity) => {

        if (
            activity.type === "owe"
        ) {

            return <ArrowUpRight size={22} />;
        }

        if (
            activity.type === "receive"
        ) {

            return <ArrowDownLeft size={22} />;
        }

        if (
            activity.type === "notification"
        ) {

            return <Bell size={22} />;
        }

        return <Receipt size={22} />;
    };


    // =====================================================
    // SUMMARY
    // =====================================================

    const totalActivities =
        activities.length;

    const unreadCount =
        notifications.filter(
            notification =>
                !notification.isRead
        ).length;

    const totalOwe =
        activities
            .filter(
                activity =>
                    activity.type === "owe"
            )
            .reduce(
                (sum, activity) =>
                    sum +
                    Number(
                        activity.amountToPay || 0
                    ),
                0
            );

    const totalReceive =
        activities
            .filter(
                activity =>
                    activity.type === "receive"
            )
            .reduce(
                (sum, activity) =>
                    sum +
                    Number(
                        activity.amountToReceive || 0
                    ),
                0
            );


    const isAdmin =
        String(
            currentUser?.role ||
            currentUser?.userRole ||
            ""
        ).toUpperCase() === "ADMIN";


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="app-layout">
                <Sidebar />

                <main className="main-content">
                    <div className="notifications-page">
                        <div className="notification-loading">
                            <div className="notification-loading-spinner"></div>
                            <p>Loading notifications...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    // =====================================================
    // ADMIN NOTIFICATION PAGE
    // =====================================================

    if (isAdmin) {

        const sortedNotifications =
            [...notifications]
                .sort(
                    (a, b) =>
                        new Date(
                            b?.createdAt || 0
                        ) -
                        new Date(
                            a?.createdAt || 0
                        )
                );

        const unreadCount =
            sortedNotifications.filter(
                notification =>
                    notification?.isRead !== true
            ).length;


        return (

            <div className="app-layout">

                <Sidebar />

                <main className="main-content">

                    <div
                        style={{
                            minHeight: "100vh",
                            padding: "36px 42px 60px",
                            background: "#f6f8fc"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: "20px",
                                paddingBottom: "24px",
                                borderBottom:
                                    "1px solid #e1e7f0"
                            }}
                        >

                            <div>

                                <p
                                    style={{
                                        margin:
                                            "0 0 7px",
                                        color:
                                            "#5748e8",
                                        fontSize:
                                            "10px",
                                        fontWeight:
                                            800,
                                        letterSpacing:
                                            "1.5px"
                                    }}
                                >
                                    ACCOUNT ACTIVITY
                                </p>

                                <h1
                                    style={{
                                        margin: 0,
                                        color:
                                            "#17366d",
                                        fontSize:
                                            "34px",
                                        fontWeight:
                                            800
                                    }}
                                >
                                    All Notifications
                                </h1>

                                <p
                                    style={{
                                        margin:
                                            "8px 0 0",
                                        color:
                                            "#8191aa",
                                        fontSize:
                                            "13px"
                                    }}
                                >
                                    Platform-wide notification
                                    activity for administrators.
                                </p>

                            </div>


                            <button
                                onClick={
                                    loadNotifications
                                }
                                style={{
                                    border: 0,
                                    borderRadius:
                                        "9px",
                                    padding:
                                        "10px 14px",
                                    background:
                                        "#5a4be7",
                                    color:
                                        "#ffffff",
                                    fontWeight:
                                        700,
                                    cursor:
                                        "pointer"
                                }}
                            >
                                Refresh
                            </button>

                        </div>


                        <div
                            style={{
                                display:
                                    "grid",
                                gridTemplateColumns:
                                    "repeat(3, minmax(0, 1fr))",
                                gap:
                                    "14px",
                                margin:
                                    "20px 0"
                            }}
                        >

                            <div className="admin-notification-summary-card">
                                <span>
                                    TOTAL NOTIFICATIONS
                                </span>
                                <strong>
                                    {
                                        sortedNotifications.length
                                    }
                                </strong>
                            </div>

                            <div className="admin-notification-summary-card">
                                <span>
                                    UNREAD
                                </span>
                                <strong>
                                    {unreadCount}
                                </strong>
                            </div>

                            <div className="admin-notification-summary-card">
                                <span>
                                    READ
                                </span>
                                <strong>
                                    {
                                        sortedNotifications.length -
                                        unreadCount
                                    }
                                </strong>
                            </div>

                        </div>


                        <section
                            className="admin-notification-panel"
                        >

                            <div
                                style={{
                                    padding:
                                        "17px 19px",
                                    borderBottom:
                                        "1px solid #edf0f5"
                                }}
                            >

                                <h2
                                    style={{
                                        margin:
                                            0,
                                        color:
                                            "#17366d",
                                        fontSize:
                                            "18px"
                                    }}
                                >
                                    Platform Notifications
                                </h2>

                                <p
                                    style={{
                                        margin:
                                            "4px 0 0",
                                        color:
                                            "#8a99ae",
                                        fontSize:
                                            "10px"
                                    }}
                                >
                                    Every notification returned by
                                    the global notifications endpoint.
                                </p>

                            </div>


                            {sortedNotifications.length ===
                            0 ? (

                                <div
                                    style={{
                                        minHeight:
                                            "180px",
                                        display:
                                            "flex",
                                        flexDirection:
                                            "column",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        gap:
                                            "7px",
                                        color:
                                            "#8191aa"
                                    }}
                                >

                                    <Bell size={30} />

                                    <h3>
                                        No notifications yet
                                    </h3>

                                    <p>
                                        New platform activity will
                                        appear here.
                                    </p>

                                </div>

                            ) : (

                                <div>

                                    {sortedNotifications.map(
                                        notification => (

                                            <div
                                                key={
                                                    notification.id
                                                }
                                                className="admin-notification-row"
                                            >

                                                <div
                                                    className="admin-notification-icon"
                                                >
                                                    <Bell
                                                        size={17}
                                                    />
                                                </div>


                                                <div
                                                    className="admin-notification-content"
                                                >

                                                    <strong>
                                                        {
                                                            notification?.title ||
                                                            notification?.type ||
                                                            "Notification"
                                                        }
                                                    </strong>

                                                    <p>
                                                        {
                                                            notification?.message ||
                                                            notification?.description ||
                                                            "Platform activity recorded."
                                                        }
                                                    </p>

                                                    <div
                                                        className="admin-notification-meta"
                                                    >

                                                        {notification?.groupName && (
                                                            <span>
                                                                Group:
                                                                {" "}
                                                                {
                                                                    notification.groupName
                                                                }
                                                            </span>
                                                        )}

                                                        {notification?.expenseName && (
                                                            <span>
                                                                Expense:
                                                                {" "}
                                                                {
                                                                    notification.expenseName
                                                                }
                                                            </span>
                                                        )}

                                                        {notification?.createdAt && (
                                                            <span>
                                                                {
                                                                    new Date(
                                                                        notification.createdAt
                                                                    ).toLocaleString()
                                                                }
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>


                                                <span
                                                    className={
                                                        notification?.isRead ===
                                                        true
                                                            ? "admin-notification-read"
                                                            : "admin-notification-unread"
                                                    }
                                                >
                                                    {
                                                        notification?.isRead ===
                                                        true
                                                            ? "READ"
                                                            : "UNREAD"
                                                    }
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </section>


                        <div
                            style={{
                                marginTop:
                                    "15px",
                                padding:
                                    "11px 13px",
                                borderRadius:
                                    "9px",
                                background:
                                    "#f0edff",
                                color:
                                    "#5748e8",
                                fontSize:
                                    "10px"
                            }}
                        >
                            Admin mode uses
                            <strong>
                                {" "}
                                /notifications
                            </strong>
                            rather than the
                            user-specific notifications endpoint.
                        </div>

                    </div>

                </main>

            </div>

        );

    }


    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                <div className="notifications-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="notifications-header">

                <div>

                    <div className="notifications-eyebrow">
                        ACCOUNT ACTIVITY
                    </div>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        Stay updated with your
                        expenses, payments and group activity.
                    </p>

                </div>


                <button
                    className="notification-refresh-btn"
                    onClick={loadNotifications}
                    disabled={refreshing}
                >

                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "loading-spin"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}

                </button>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="notification-summary">

                <div className="notification-summary-card">

                    <div className="notification-summary-icon purple">
                        <Bell size={23} />
                    </div>

                    <div>

                        <span>
                            TOTAL ACTIVITY
                        </span>

                        <strong>
                            {totalActivities}
                        </strong>

                        <p>
                            Recent account updates
                        </p>

                    </div>

                </div>


                <div className="notification-summary-card">

                    <div className="notification-summary-icon blue">
                        <CheckCircle size={23} />
                    </div>

                    <div>

                        <span>
                            UNREAD
                        </span>

                        <strong>
                            {unreadCount}
                        </strong>

                        <p>
                            Notifications waiting
                        </p>

                    </div>

                </div>


                <div className="notification-summary-card">

                    <div className="notification-summary-icon red">
                        <Wallet size={23} />
                    </div>

                    <div>

                        <span>
                            YOU OWE
                        </span>

                        <strong>
                            ₹{totalOwe.toFixed(2)}
                        </strong>

                        <p>
                            Amount you need to pay
                        </p>

                    </div>

                </div>


                <div className="notification-summary-card">

                    <div className="notification-summary-icon green">
                        <ArrowDownLeft size={23} />
                    </div>

                    <div>

                        <span>
                            YOU RECEIVE
                        </span>

                        <strong>
                            ₹{totalReceive.toFixed(2)}
                        </strong>

                        <p>
                            Amount others owe you
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                ACTIVITY SECTION
            ================================================= */}

            <div className="notifications-panel">

                <div className="notifications-panel-header">

                    <div>

                        <h2>
                            Recent Activity
                        </h2>

                        <p>
                            Your latest expenses,
                            payments and notifications.
                        </p>

                    </div>

                    <span className="activity-count">
                        {totalActivities}{" "}
                        {totalActivities === 1
                            ? "activity"
                            : "activities"}
                    </span>

                </div>


                {/* =================================================
                    EMPTY
                ================================================= */}

                {activities.length === 0 ? (

                    <div className="notification-empty">

                        <div className="notification-empty-icon">
                            <Bell size={30} />
                        </div>

                        <h3>
                            No activity yet
                        </h3>

                        <p>
                            When you create or participate
                            in an expense, your activity
                            will appear here.
                        </p>

                    </div>

                ) : (


                    /* =================================================
                       ACTIVITY LIST
                    ================================================= */

                    <div className="activity-list">

                        {activities.map(
                            activity => (

                                <div
                                    className={`activity-card ${
                                        activity.type
                                    }`}
                                    key={activity.id}
                                >

                                    {/* ICON */}

                                    <div className="activity-icon">

                                        {getIcon(
                                            activity
                                        )}

                                    </div>


                                    {/* CONTENT */}

                                    <div className="activity-content">

                                        <div className="activity-top">

                                            <div>

                                                <h3>
                                                    {getTitle(
                                                        activity
                                                    )}
                                                </h3>

                                                {activity.expenseName && (

                                                    <span className="activity-expense">

                                                        <Receipt
                                                            size={13}
                                                        />

                                                        {
                                                            activity.expenseName
                                                        }

                                                    </span>

                                                )}

                                            </div>

                                            {activity.amount > 0 && (

                                                <strong className="activity-total">

                                                    ₹
                                                    {Number(
                                                        activity.amount
                                                    ).toFixed(2)}

                                                </strong>

                                            )}

                                        </div>


                                        <p className="activity-message">

                                            {
                                                getMessage(
                                                    activity
                                                )
                                            }

                                        </p>


                                        <div className="activity-meta">

                                            {activity.groupName && (

                                                <span>

                                                    <Users
                                                        size={14}
                                                    />

                                                    {
                                                        activity.groupName
                                                    }

                                                </span>

                                            )}


                                            {activity.paidBy && (

                                                <span>

                                                    <Wallet
                                                        size={14}
                                                    />

                                                    Paid by{" "}
                                                    <b>
                                                        {
                                                            activity.paidBy
                                                        }
                                                    </b>

                                                </span>

                                            )}


                                            {activity.createdAt && (

                                                <span>

                                                    <Clock
                                                        size={14}
                                                    />

                                                    {
                                                        formatDate(
                                                            activity.createdAt
                                                        )
                                                    }

                                                </span>

                                            )}

                                        </div>


                                        {/* PAYMENT DETAILS */}

                                        {activity.type === "owe" && (

                                            <div className="activity-payment owe">

                                                <span>
                                                    YOUR SHARE
                                                </span>

                                                <strong>
                                                    ₹
                                                    {activity.userShare.toFixed(2)}
                                                </strong>

                                                <span>
                                                    YOU OWE
                                                </span>

                                                <strong>
                                                    ₹
                                                    {activity.amountToPay.toFixed(2)}
                                                </strong>

                                            </div>

                                        )}


                                        {activity.type === "receive" && (

                                            <div className="activity-payment receive">

                                                <span>
                                                    YOUR SHARE
                                                </span>

                                                <strong>
                                                    ₹
                                                    {activity.userShare.toFixed(2)}
                                                </strong>

                                                <span>
                                                    YOU RECEIVE
                                                </span>

                                                <strong>
                                                    ₹
                                                    {activity.amountToReceive.toFixed(2)}
                                                </strong>

                                            </div>

                                        )}

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

                </div>
            </main>
        </div>
    );
}

export default UserNotifications;
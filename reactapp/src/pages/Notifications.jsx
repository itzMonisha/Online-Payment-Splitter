import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Bell,
    CheckCircle2,
    RefreshCw,
    DollarSign,
    Users,
    Wallet,
    AlertCircle,
    Search,
    Check,
    Trash2,
    Clock3,
    Filter,
    X
} from "lucide-react";

import Sidebar from "../components/Sidebar";

import {
    getNotifications,
    markNotificationAsRead,
    deleteNotification
} from "../services/notificationService";

import "./Notifications.css";


function Notifications() {

    const [user, setUser] = useState(null);

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [processingId, setProcessingId] =
        useState(null);

    const [filter, setFilter] =
        useState("ALL");

    const [search, setSearch] =
        useState("");


    // =====================================================
    // LOAD LOGGED-IN ADMIN
    // =====================================================

    const loadUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch (err) {

            console.error(
                "Unable to read logged-in user:",
                err
            );

            return null;
        }
    };


    // =====================================================
    // LOAD PLATFORM NOTIFICATIONS
    // =====================================================

    const loadNotifications =
        useCallback(async (isRefresh = false) => {

            try {

                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const loggedInUser =
                    loadUser();

                if (!loggedInUser) {

                    setError(
                        "User session not found. Please login again."
                    );

                    setNotifications([]);

                    return;
                }

                const role =
                    String(
                        loggedInUser?.role ||
                        loggedInUser?.userRole ||
                        ""
                    )
                        .toUpperCase()
                        .trim();

                if (role !== "ADMIN") {

                    setError(
                        "Administrator access is required to view platform notifications."
                    );

                    setNotifications([]);

                    return;
                }

                setUser(loggedInUser);

                /*
                 * IMPORTANT:
                 * Admin notification page uses the GLOBAL
                 * notification endpoint.
                 *
                 * getNotifications() -> GET /notifications
                 */
                const data =
                    await getNotifications();

                setNotifications(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.error(
                    "Unable to load admin notifications:",
                    err
                );

                setNotifications([]);

                if (
                    err?.response?.status === 401
                ) {

                    setError(
                        "Your session has expired. Please login again."
                    );

                } else if (
                    err?.response?.status === 403
                ) {

                    setError(
                        "You do not have permission to view platform notifications."
                    );

                } else {

                    setError(
                        err?.response?.data?.message ||
                        "Unable to load platform notifications."
                    );
                }

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
    // READ STATUS
    // =====================================================

    const isRead = (notification) => {

        return (
            notification?.isRead === true ||
            notification?.read === true ||
            String(
                notification?.status || ""
            )
                .toUpperCase()
                .trim() === "READ"
        );
    };


    // =====================================================
    // SORT
    // =====================================================

    const sortedNotifications =
        useMemo(() => {

            return [...notifications].sort(
                (a, b) =>
                    new Date(
                        b?.createdAt || 0
                    ) -
                    new Date(
                        a?.createdAt || 0
                    )
            );

        }, [notifications]);


    // =====================================================
    // COUNTS
    // =====================================================

    const totalCount =
        sortedNotifications.length;

    const unreadCount =
        sortedNotifications.filter(
            notification =>
                !isRead(notification)
        ).length;

    const readCount =
        totalCount - unreadCount;


    // =====================================================
    // FILTER + SEARCH
    // =====================================================

    const filteredNotifications =
        useMemo(() => {

            const query =
                search
                    .toLowerCase()
                    .trim();

            return sortedNotifications.filter(
                notification => {

                    const notificationIsRead =
                        isRead(notification);

                    if (
                        filter === "UNREAD" &&
                        notificationIsRead
                    ) {
                        return false;
                    }

                    if (
                        filter === "READ" &&
                        !notificationIsRead
                    ) {
                        return false;
                    }

                    if (!query) {
                        return true;
                    }

                    const searchableText = [
                        notification?.title,
                        notification?.type,
                        notification?.message,
                        notification?.description,
                        notification?.groupName,
                        notification?.expenseName,
                        notification?.userName,
                        notification?.recipientName,
                        notification?.user?.name
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    return searchableText.includes(
                        query
                    );
                }
            );

        }, [
            sortedNotifications,
            filter,
            search
        ]);


    // =====================================================
    // ICON
    // =====================================================

    const getNotificationIcon =
        (notification) => {

            const text = `
                ${notification?.title || ""}
                ${notification?.type || ""}
                ${notification?.message || ""}
                ${notification?.description || ""}
            `.toLowerCase();

            if (
                text.includes("payment") ||
                text.includes("paid") ||
                text.includes("receive") ||
                text.includes("settlement")
            ) {
                return (
                    <DollarSign size={20} />
                );
            }

            if (
                text.includes("group") ||
                text.includes("member") ||
                text.includes("invite")
            ) {
                return (
                    <Users size={20} />
                );
            }

            if (
                text.includes("expense") ||
                text.includes("amount") ||
                text.includes("owe")
            ) {
                return (
                    <Wallet size={20} />
                );
            }

            if (
                text.includes("error") ||
                text.includes("failed") ||
                text.includes("warning")
            ) {
                return (
                    <AlertCircle size={20} />
                );
            }

            return (
                <Bell size={20} />
            );
        };


    // =====================================================
    // ICON TYPE
    // =====================================================

    const getIconClass =
        (notification) => {

            const text = `
                ${notification?.title || ""}
                ${notification?.type || ""}
                ${notification?.message || ""}
            `.toLowerCase();

            if (
                text.includes("payment") ||
                text.includes("paid") ||
                text.includes("receive") ||
                text.includes("settlement")
            ) {
                return "payment";
            }

            if (
                text.includes("group") ||
                text.includes("member") ||
                text.includes("invite")
            ) {
                return "group";
            }

            if (
                text.includes("expense") ||
                text.includes("amount") ||
                text.includes("owe")
            ) {
                return "expense";
            }

            if (
                text.includes("error") ||
                text.includes("failed") ||
                text.includes("warning")
            ) {
                return "warning";
            }

            return "general";
        };


    // =====================================================
    // DATE
    // =====================================================

    const formatDate =
        (date) => {

            if (!date) {
                return "Recently";
            }

            const parsed =
                new Date(date);

            if (
                Number.isNaN(
                    parsed.getTime()
                )
            ) {
                return "Recently";
            }

            return parsed.toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
        };


    // =====================================================
    // TITLE / MESSAGE
    // =====================================================

    const getTitle =
        (notification) => {

            return (
                notification?.title ||
                notification?.type ||
                "Platform Notification"
            );
        };


    const getMessage =
        (notification) => {

            return (
                notification?.message ||
                notification?.description ||
                "Activity was recorded on the SplitPay platform."
            );
        };


    // =====================================================
    // MARK AS READ
    // =====================================================

    const handleMarkAsRead =
        async (notification) => {

            if (
                isRead(notification)
            ) {
                return;
            }

            const id =
                notification?.id;

            if (
                id === undefined ||
                id === null
            ) {
                return;
            }

            try {

                setProcessingId(id);

                await markNotificationAsRead(
                    id
                );

                setNotifications(
                    previous =>
                        previous.map(
                            item =>
                                item.id === id
                                    ? {
                                        ...item,
                                        isRead: true,
                                        read: true,
                                        status: "READ"
                                    }
                                    : item
                        )
                );

            } catch (err) {

                console.error(
                    "Unable to mark notification as read:",
                    err
                );

                alert(
                    err?.response?.data?.message ||
                    "Unable to mark notification as read."
                );

            } finally {

                setProcessingId(null);
            }
        };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete =
        async (notification) => {

            const id =
                notification?.id;

            if (
                id === undefined ||
                id === null
            ) {
                return;
            }

            const confirmed =
                window.confirm(
                    "Delete this notification?"
                );

            if (!confirmed) {
                return;
            }

            try {

                setProcessingId(id);

                await deleteNotification(
                    id
                );

                setNotifications(
                    previous =>
                        previous.filter(
                            item =>
                                item.id !== id
                        )
                );

            } catch (err) {

                console.error(
                    "Unable to delete notification:",
                    err
                );

                alert(
                    err?.response?.data?.message ||
                    "Unable to delete notification."
                );

            } finally {

                setProcessingId(null);
            }
        };


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const clearSearch = () => {
        setSearch("");
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="app-layout">

                <Sidebar />

                <main className="main-content">

                    <div className="notifications-page">

                        <div className="notifications-loading">

                            <RefreshCw
                                size={28}
                                className="notifications-spin"
                            />

                            <h2>
                                Loading Notifications
                            </h2>

                            <p>
                                Fetching platform activity...
                            </p>

                        </div>

                    </div>

                </main>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="app-layout">

            <Sidebar />

            <main className="main-content">

                <div className="notifications-page">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <header className="notifications-header">

                        <div>

                            <p className="notifications-eyebrow">
                                ADMINISTRATION
                            </p>

                            <h1>
                                Notifications
                            </h1>

                            <p className="notifications-subtitle">
                                Monitor platform-wide activity,
                                payments, groups and expenses.
                            </p>

                        </div>

                        <button
                            className="notification-refresh-btn"
                            onClick={() =>
                                loadNotifications(true)
                            }
                            disabled={refreshing}
                        >

                            <RefreshCw
                                size={17}
                                className={
                                    refreshing
                                        ? "notifications-spin"
                                        : ""
                                }
                            />

                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"
                            }

                        </button>

                    </header>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="notifications-error">

                            <AlertCircle size={17} />

                            <span>
                                {error}
                            </span>

                        </div>
                    )}


                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <section className="notification-summary">

                        <div className="notification-summary-card total">

                            <div className="notification-summary-icon purple">
                                <Bell size={21} />
                            </div>

                            <div>

                                <span>
                                    TOTAL NOTIFICATIONS
                                </span>

                                <strong>
                                    {totalCount}
                                </strong>

                                <small>
                                    Platform activity
                                </small>

                            </div>

                        </div>


                        <div className="notification-summary-card unread">

                            <div className="notification-summary-icon blue">
                                <CheckCircle2 size={21} />
                            </div>

                            <div>

                                <span>
                                    UNREAD
                                </span>

                                <strong>
                                    {unreadCount}
                                </strong>

                                <small>
                                    Awaiting review
                                </small>

                            </div>

                        </div>


                        <div className="notification-summary-card read">

                            <div className="notification-summary-icon green">
                                <Check size={21} />
                            </div>

                            <div>

                                <span>
                                    READ
                                </span>

                                <strong>
                                    {readCount}
                                </strong>

                                <small>
                                    Already reviewed
                                </small>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        NOTIFICATION PANEL
                    ================================================= */}

                    <section className="notifications-panel">

                        <div className="notifications-panel-header">

                            <div>

                                <p>
                                    PLATFORM ACTIVITY
                                </p>

                                <h2>
                                    All Notifications
                                </h2>

                                <span>
                                    Global notifications visible to administrators.
                                </span>

                            </div>

                            <div className="notification-panel-count">
                                {filteredNotifications.length}
                                {" "}
                                {filteredNotifications.length === 1
                                    ? "notification"
                                    : "notifications"
                                }
                            </div>

                        </div>


                        {/* =================================================
                            TOOLBAR
                        ================================================= */}

                        <div className="notifications-toolbar">

                            <div className="notification-search">

                                <Search size={16} />

                                <input
                                    type="text"
                                    placeholder="Search notifications..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                />

                                {search && (

                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        aria-label="Clear search"
                                    >
                                        <X size={15} />
                                    </button>

                                )}

                            </div>


                            <div className="notification-filters">

                                <Filter size={14} />

                                <button
                                    className={
                                        filter === "ALL"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setFilter("ALL")
                                    }
                                >
                                    All
                                </button>

                                <button
                                    className={
                                        filter === "UNREAD"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setFilter("UNREAD")
                                    }
                                >
                                    Unread
                                    {unreadCount > 0 && (
                                        <span>
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                <button
                                    className={
                                        filter === "READ"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setFilter("READ")
                                    }
                                >
                                    Read
                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            LIST
                        ================================================= */}

                        {filteredNotifications.length === 0 ? (

                            <div className="notifications-empty">

                                <div className="notifications-empty-icon">
                                    <Bell size={29} />
                                </div>

                                <span className="notifications-empty-label">
                                    ALL CAUGHT UP
                                </span>

                                <h3>
                                    {search ||
                                    filter !== "ALL"
                                        ? "No matching notifications"
                                        : "No notifications yet"
                                    }
                                </h3>

                                <p>
                                    {search ||
                                    filter !== "ALL"
                                        ? "Try changing the search or filter."
                                        : "New platform activity will appear here automatically."
                                    }
                                </p>

                            </div>

                        ) : (

                            <div className="notification-list">

                                {filteredNotifications.map(
                                    notification => {

                                        const notificationIsRead =
                                            isRead(
                                                notification
                                            );

                                        const processing =
                                            processingId ===
                                            notification?.id;

                                        return (

                                            <article
                                                key={
                                                    notification.id
                                                }
                                                className={
                                                    notificationIsRead
                                                        ? "notification-row read"
                                                        : "notification-row unread"
                                                }
                                            >

                                                <div
                                                    className={
                                                        `notification-type-icon ${getIconClass(
                                                            notification
                                                        )}`
                                                    }
                                                >
                                                    {getNotificationIcon(
                                                        notification
                                                    )}
                                                </div>


                                                <div className="notification-content">

                                                    <div className="notification-title-row">

                                                        <div className="notification-title-block">

                                                            <h3>
                                                                {getTitle(
                                                                    notification
                                                                )}
                                                            </h3>

                                                            {!notificationIsRead && (
                                                                <span className="new-dot">
                                                                    NEW
                                                                </span>
                                                            )}

                                                        </div>

                                                        <span
                                                            className={
                                                                notificationIsRead
                                                                    ? "notification-status read-status"
                                                                    : "notification-status unread-status"
                                                            }
                                                        >
                                                            {notificationIsRead
                                                                ? "READ"
                                                                : "UNREAD"
                                                            }
                                                        </span>

                                                    </div>


                                                    <p className="notification-message">
                                                        {getMessage(
                                                            notification
                                                        )}
                                                    </p>


                                                    <div className="notification-meta">

                                                        {notification?.groupName && (
                                                            <span>
                                                                <Users size={12} />
                                                                {notification.groupName}
                                                            </span>
                                                        )}

                                                        {notification?.expenseName && (
                                                            <span>
                                                                <Wallet size={12} />
                                                                {notification.expenseName}
                                                            </span>
                                                        )}

                                                        {(notification?.userName ||
                                                        notification?.recipientName ||
                                                        notification?.user?.name) && (
                                                            <span>
                                                                <Users size={12} />
                                                                {
                                                                    notification?.userName ||
                                                                    notification?.recipientName ||
                                                                    notification?.user?.name
                                                                }
                                                            </span>
                                                        )}

                                                        {notification?.createdAt && (
                                                            <span>
                                                                <Clock3 size={12} />
                                                                {formatDate(
                                                                    notification.createdAt
                                                                )}
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>


                                                <div className="notification-actions">

                                                    {!notificationIsRead && (

                                                        <button
                                                            className="notification-action read-action"
                                                            title="Mark as read"
                                                            onClick={() =>
                                                                handleMarkAsRead(
                                                                    notification
                                                                )
                                                            }
                                                            disabled={processing}
                                                        >
                                                            <Check size={15} />
                                                            <span>
                                                                Mark read
                                                            </span>
                                                        </button>

                                                    )}

                                                    <button
                                                        className="notification-action delete-action"
                                                        title="Delete notification"
                                                        onClick={() =>
                                                            handleDelete(
                                                                notification
                                                            )
                                                        }
                                                        disabled={processing}
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>

                                                </div>

                                            </article>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </section>


                    {/* =================================================
                        FOOTER INFO
                    ================================================= */}

                    <div className="notifications-admin-note">

                        <ShieldIcon />

                        <div>

                            <strong>
                                Administrator view
                            </strong>

                            <span>
                                This page displays platform-wide notifications
                                returned by the admin notifications endpoint.
                            </span>

                        </div>

                        <span className="admin-active-badge">
                            ADMIN
                        </span>

                    </div>

                </div>

            </main>

        </div>
    );
}


/* Small inline shield component keeps the import list clean. */
function ShieldIcon() {
    return (
        <div className="notification-note-icon">
            <CheckCircle2 size={19} />
        </div>
    );
}


export default Notifications;
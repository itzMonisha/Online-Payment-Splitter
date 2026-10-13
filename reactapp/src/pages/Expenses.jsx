import React, {
    useEffect,
    useState
} from "react";

import {
    LayoutDashboard,
    Users,
    Receipt,
    ArrowLeftRight,
    Bell,
    UserCircle,
    Settings,
    LogOut,
    Plus,
    Download,
    Search,
    RefreshCw,
    CheckCircle,
    Hash,
    Trash2
} from "lucide-react";

import {
    getExpensesByUser,
    getAllExpenses,
    getExpenseDetailsForUser,
    deleteExpense
} from "../services/expenseService";

import Sidebar from "../components/Sidebar";

import "./Expenses.css";


function Expenses() {

    // =====================================================
    // USER
    // =====================================================

    const [user, setUser] = useState(null);

    const isAdmin =
        String(
            user?.role ||
            user?.userRole ||
            ""
        ).toUpperCase() === "ADMIN";


    // =====================================================
    // EXPENSES
    // =====================================================

    const [expenses, setExpenses] = useState([]);


    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] =
        useState(false);


    // Separate loading state for DELETE
    const [deletingExpenseId, setDeletingExpenseId] =
        useState(null);


    // =====================================================
    // ERROR
    // =====================================================

    const [error, setError] =
        useState("");


    // =====================================================
    // SEARCH
    // =====================================================

    const [searchTerm, setSearchTerm] =
        useState("");


    // =====================================================
    // CATEGORY
    // =====================================================

    const [selectedCategory, setSelectedCategory] =
        useState("All Categories");


    // =====================================================
    // LOAD USER
    // =====================================================

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {

                setUser(
                    JSON.parse(storedUser)
                );

            }

        } catch (error) {

            console.error(
                "Unable to load user:",
                error
            );

        }

    }, []);


    // =====================================================
    // LOAD USER EXPENSES
    // =====================================================
const loadExpenses = async () => {

    try {

        setLoading(true);
        setError("");

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {

            setError(
                "User session not found. Please login again."
            );

            setExpenses([]);

            return;
        }

        const loggedInUser =
            JSON.parse(storedUser);

        const userId =
            loggedInUser?.id ||
            loggedInUser?.userId;

        const role = String(
            loggedInUser?.role ||
            loggedInUser?.userRole ||
            localStorage.getItem("role") ||
            "USER"
        )
            .trim()
            .toUpperCase();

        const isAdmin =
            role === "ADMIN";

        setUser(loggedInUser);


        /*
        =================================================
        ADMIN
        =================================================

        ADMIN gets every expense.
        */

        let data;

        if (isAdmin) {

            console.log(
                "ADMIN: Loading ALL expenses"
            );

            data =
                await getAllExpenses();

        }

        /*
        =================================================
        USER
        =================================================

        USER gets only their expenses.
        */

        else {

            if (!userId) {

                setError(
                    "User ID not found. Please login again."
                );

                setExpenses([]);

                return;
            }

            console.log(
                "USER: Loading expenses for:",
                userId
            );

            data =
                await getExpensesByUser(
                    Number(userId)
                );
        }


        const basicExpenses =
            Array.isArray(data)
                ? data
                : [];


        /*
        =================================================
        DETAILED EXPENSE INFORMATION
        =================================================

        Important:

        User -> details for that user

        Admin -> do NOT use user's personal detail
                 endpoint for deciding what expenses
                 exist.

        */

        if (!isAdmin && userId) {

            const detailedExpenses =
                await Promise.all(

                    basicExpenses.map(
                        async (expense) => {

                            try {

                                if (!expense?.id) {
                                    return {
                                        ...expense,
                                        details: null
                                    };
                                }

                                const details =
                                    await getExpenseDetailsForUser(
                                        expense.id,
                                        Number(userId)
                                    );

                                return {
                                    ...expense,
                                    ...details
                                };

                            } catch (detailError) {

                                console.error(
                                    "EXPENSE DETAIL ERROR:",
                                    expense?.id,
                                    detailError
                                );

                                return {
                                    ...expense
                                };
                            }
                        }
                    )
                );

            setExpenses(
                detailedExpenses
            );

        } else {

            /*
            ADMIN:
            keep every expense exactly as returned
            by the global endpoint.
            */

            setExpenses(
                basicExpenses
            );
        }

    } catch (error) {

        console.error(
            "EXPENSE LOAD ERROR:",
            error
        );

        setExpenses([]);

        setError(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Unable to load expenses."
        );

    } finally {

        setLoading(false);
    }
};

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadExpenses();

    }, []);


    // =====================================================
    // USER NAME
    // =====================================================

    const userName =
        user?.name ||
        user?.username ||
        "User";


    // =====================================================
    // SUMMARY
    // =====================================================

    const totalAmount =
        expenses.reduce(
            (total, expense) =>
                total +
                Number(
                    expense.amount || 0
                ),
            0
        );


    const totalRecords =
        expenses.length;


    const totalCategories =
        new Set(
            expenses
                .map(
                    (expense) =>
                        expense.category
                )
                .filter(Boolean)
        ).size;


    // =====================================================
    // FILTERED EXPENSES
    // =====================================================

    const filteredExpenses =
        expenses.filter(
            (expense) => {

                const name =
                    expense.name ||
                    expense.title ||
                    expense.description ||
                    "Expense";


                const category =
                    expense.category ||
                    "Other";


                const group =
                    expense.group?.name ||
                    expense.groupName ||
                    expense.group?.groupName ||
                    "No group";


                const payer =
                    expense.paidByUserName ||
                    expense.paidByName ||
                    expense.payerName ||
                    expense.paidByUser?.name ||
                    "";


                const searchText =
                    `${name} ${category} ${group} ${payer}`
                        .toLowerCase();


                const matchesSearch =
                    searchText.includes(
                        searchTerm.toLowerCase()
                    );


                const matchesCategory =
                    selectedCategory ===
                        "All Categories" ||
                    category ===
                        selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    // =====================================================
    // DELETE EXPENSE
    // =====================================================

    const handleDeleteExpense =
        async (expenseId) => {

            if (!expenseId) {
                return;
            }


            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this expense?"
                );


            if (!confirmed) {
                return;
            }


            try {

                setDeletingExpenseId(
                    expenseId
                );


                setError("");


                console.log(
                    "Deleting expense:",
                    expenseId
                );


                await deleteExpense(
                    expenseId
                );


                // Remove expense immediately
                setExpenses(
                    (previousExpenses) =>
                        previousExpenses.filter(
                            (expense) =>
                                Number(
                                    expense.id
                                ) !==
                                Number(
                                    expenseId
                                )
                        )
                );


                console.log(
                    "Expense deleted successfully:",
                    expenseId
                );


                alert(
                    "Expense deleted successfully."
                );


            } catch (error) {

                console.error(
                    "DELETE EXPENSE ERROR:",
                    error
                );


                console.error(
                    "STATUS:",
                    error?.response?.status
                );


                console.error(
                    "RESPONSE:",
                    error?.response?.data
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
                    error?.message ||
                    "Unable to delete expense.";


                setError(message);


            } finally {

                setDeletingExpenseId(
                    null
                );

            }

        };


    // =====================================================
    // CATEGORIES
    // =====================================================

    const categories = [
        "All Categories",
        ...Array.from(
            new Set(
                expenses
                    .map(
                        (expense) =>
                            expense.category
                    )
                    .filter(Boolean)
            )
        )
    ];


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "role"
        );


        window.location.href =
            "/login";

    };


    // =====================================================
    // EXPORT CSV
    // =====================================================

    const handleExport = () => {

        if (!expenses.length) {

            alert(
                "There are no expenses to export."
            );

            return;
        }


        const headers = [
            "Expense",
            "Amount",
            "Category",
            "Group"
        ];


        const rows =
            expenses.map(
                (expense) => {

                    const name =
                        expense.name ||
                        expense.title ||
                        expense.description ||
                        "Expense";


                    const group =
                        expense.group?.name ||
                        expense.groupName ||
                        expense.group?.groupName ||
                        "No group";


                    return [
                        name,
                        expense.amount || 0,
                        expense.category ||
                            "Other",
                        group
                    ];

                }
            );


        const csv = [
            headers,
            ...rows
        ]
            .map(
                (row) =>
                    row
                        .map(
                            (value) =>
                                `"${String(value)
                                    .replace(
                                        /"/g,
                                        '""'
                                    )}"`
                        )
                        .join(",")
            )
            .join("\n");


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;


        link.download =
            "my-expenses.csv";


        link.click();


        URL.revokeObjectURL(
            url
        );

    };


    // =====================================================
    // NAVIGATION
    // =====================================================

    const navigate = (path) => {

        window.location.href =
            path;

    };


    // =====================================================
    // ADMIN RENDER
    // =====================================================

    if (isAdmin) {

        const totalExpenseValue =
            expenses.reduce(
                (total, expense) =>
                    total +
                    Number(
                        expense?.amount ||
                        expense?.totalAmount ||
                        0
                    ),
                0
            );

        const adminCategories = [
            "All Categories",
            ...Array.from(
                new Set(
                    expenses
                        .map(
                            expense =>
                                expense?.category
                        )
                        .filter(Boolean)
                )
            )
        ];

        const adminFilteredExpenses =
            expenses.filter(
                expense => {

                    const name =
                        expense?.name ||
                        expense?.title ||
                        expense?.description ||
                        "Expense";

                    const category =
                        expense?.category ||
                        "Other";

                    const group =
                        expense?.group?.name ||
                        expense?.group?.groupName ||
                        expense?.groupName ||
                        (
                            expense?.groupId
                                ? `Group #${expense.groupId}`
                                : "No group"
                        );

                    const payer =
                        expense?.paidByUserName ||
                        expense?.paidByName ||
                        expense?.payerName ||
                        expense?.paidByUser?.name ||
                        "";

                    const searchText =
                        `${name} ${category} ${group} ${payer}`
                            .toLowerCase();

                    const matchesSearch =
                        searchText.includes(
                            searchTerm
                                .toLowerCase()
                                .trim()
                        );

                    const matchesCategory =
                        selectedCategory ===
                            "All Categories" ||
                        category ===
                            selectedCategory;

                    return (
                        matchesSearch &&
                        matchesCategory
                    );

                }
            );


        return (

            <div className="app-layout">

                <Sidebar />

                <main className="main-content">

                    <div
                        className="admin-expenses-page"
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
                                borderBottom: "1px solid #e1e7f0"
                            }}
                        >

                            <div>

                                <p
                                    style={{
                                        margin: "0 0 7px",
                                        color: "#5748e8",
                                        fontSize: "10px",
                                        fontWeight: 800,
                                        letterSpacing: "1.5px"
                                    }}
                                >
                                    EXPENSE MANAGEMENT
                                </p>

                                <h1
                                    style={{
                                        margin: 0,
                                        color: "#17366d",
                                        fontSize: "34px",
                                        fontWeight: 800
                                    }}
                                >
                                    All Expenses
                                </h1>

                                <p
                                    style={{
                                        margin: "8px 0 0",
                                        color: "#8191aa",
                                        fontSize: "13px"
                                    }}
                                >
                                    Administrator view of every
                                    expense recorded on SplitPay.
                                </p>

                            </div>

                            <button
                                onClick={loadExpenses}
                                style={{
                                    border: 0,
                                    borderRadius: "9px",
                                    padding: "10px 14px",
                                    background: "#5a4be7",
                                    color: "#ffffff",
                                    fontWeight: 700,
                                    cursor: "pointer"
                                }}
                            >
                                Refresh
                            </button>

                        </div>


                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(4, minmax(0, 1fr))",
                                gap: "14px",
                                margin: "20px 0"
                            }}
                        >

                            <div className="admin-expense-summary-card">
                                <span>TOTAL EXPENSE VALUE</span>
                                <strong>
                                    ₹{totalExpenseValue.toFixed(2)}
                                </strong>
                            </div>

                            <div className="admin-expense-summary-card">
                                <span>EXPENSE RECORDS</span>
                                <strong>{expenses.length}</strong>
                            </div>

                            <div className="admin-expense-summary-card">
                                <span>CATEGORIES</span>
                                <strong>
                                    {adminCategories.length - 1}
                                </strong>
                            </div>

                            <div className="admin-expense-summary-card">
                                <span>FILTERED RECORDS</span>
                                <strong>
                                    {adminFilteredExpenses.length}
                                </strong>
                            </div>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "12px",
                                marginBottom: "15px",
                                background: "#ffffff",
                                border: "1px solid #e0e6f0",
                                borderRadius: "12px"
                            }}
                        >

                            <Search
                                size={17}
                                color="#8b9ab1"
                            />

                            <input
                                type="text"
                                placeholder="Search expense, group, payer or category..."
                                value={searchTerm}
                                onChange={event =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                style={{
                                    flex: 1,
                                    border: 0,
                                    outline: 0,
                                    fontSize: "12px"
                                }}
                            />

                            <select
                                value={selectedCategory}
                                onChange={event =>
                                    setSelectedCategory(
                                        event.target.value
                                    )
                                }
                                style={{
                                    minWidth: "170px",
                                    padding: "8px",
                                    border:
                                        "1px solid #dfe5ef",
                                    borderRadius: "8px",
                                    background: "#ffffff"
                                }}
                            >

                                {adminCategories.map(
                                    category => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        {error && (

                            <div
                                style={{
                                    marginBottom: "12px",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    background: "#fff1f2",
                                    color: "#d83f4a",
                                    fontSize: "11px"
                                }}
                            >
                                {error}
                            </div>

                        )}


                        <div
                            className="admin-table-card"
                            style={{
                                overflow: "hidden",
                                background: "#ffffff",
                                border: "1px solid #dfe6f0",
                                borderRadius: "14px"
                            }}
                        >

                            <div
                                className="admin-table-wrapper"
                                style={{
                                    overflowX: "auto"
                                }}
                            >

                                {loading ? (

                                    <div
                                        style={{
                                            minHeight: "180px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            color: "#7f90a8"
                                        }}
                                    >

                                        <RefreshCw size={28} />

                                        <h3>
                                            Loading all expenses...
                                        </h3>

                                    </div>

                                ) : (

                                    <table className="admin-table">

                                        <thead>

                                            <tr>
                                                <th>EXPENSE</th>
                                                <th>GROUP</th>
                                                <th>PAID BY</th>
                                                <th>AMOUNT</th>
                                                <th>CATEGORY</th>
                                                <th>CREATED</th>
                                                <th>ACTION</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {adminFilteredExpenses.length === 0 ? (

                                                <tr>
                                                    <td
                                                        colSpan="7"
                                                        className="table-empty"
                                                    >
                                                        No expenses found.
                                                    </td>
                                                </tr>

                                            ) : (

                                                adminFilteredExpenses.map(
                                                    expense => {

                                                        const name =
                                                            expense?.name ||
                                                            expense?.title ||
                                                            expense?.description ||
                                                            "Expense";

                                                        const group =
                                                            expense?.group?.name ||
                                                            expense?.group?.groupName ||
                                                            expense?.groupName ||
                                                            (
                                                                expense?.groupId
                                                                    ? `Group #${expense.groupId}`
                                                                    : "No group"
                                                            );

                                                        const payer =
                                                            expense?.paidByUserName ||
                                                            expense?.paidByName ||
                                                            expense?.payerName ||
                                                            expense?.paidByUser?.name ||
                                                            (
                                                                expense?.paidByUserId
                                                                    ? `User #${expense.paidByUserId}`
                                                                    : "Unknown"
                                                            );

                                                        return (

                                                            <tr
                                                                key={expense.id}
                                                            >

                                                                <td>
                                                                    <strong>
                                                                        {name}
                                                                    </strong>

                                                                    <small
                                                                        style={{
                                                                            display: "block",
                                                                            marginTop: "3px",
                                                                            color: "#98a5b8",
                                                                            fontSize: "8px"
                                                                        }}
                                                                    >
                                                                        Expense #
                                                                        {expense.id}
                                                                    </small>
                                                                </td>

                                                                <td>
                                                                    {group}
                                                                </td>

                                                                <td>
                                                                    {payer}
                                                                </td>

                                                                <td>
                                                                    <strong>
                                                                        ₹
                                                                        {Number(
                                                                            expense?.amount ||
                                                                            expense?.totalAmount ||
                                                                            0
                                                                        ).toFixed(2)}
                                                                    </strong>
                                                                </td>

                                                                <td>
                                                                    <span
                                                                        className="expense-category-badge"
                                                                    >
                                                                        {expense?.category ||
                                                                            "Other"}
                                                                    </span>
                                                                </td>

                                                                <td>
                                                                    {expense?.createdAt
                                                                        ? new Date(
                                                                              expense.createdAt
                                                                          ).toLocaleString()
                                                                        : "—"}
                                                                </td>

                                                                <td>
                                                                    <button
                                                                        className="delete-button"
                                                                        disabled={
                                                                            deletingExpenseId !==
                                                                            null
                                                                        }
                                                                        onClick={() =>
                                                                            handleDeleteExpense(
                                                                                expense.id
                                                                            )
                                                                        }
                                                                    >
                                                                        {deletingExpenseId ===
                                                                        expense.id ? (
                                                                            <RefreshCw
                                                                                size={15}
                                                                            />
                                                                        ) : (
                                                                            <Trash2
                                                                                size={15}
                                                                            />
                                                                        )}
                                                                    </button>
                                                                </td>

                                                            </tr>

                                                        );

                                                    }
                                                )

                                            )}

                                        </tbody>

                                    </table>

                                )}

                            </div>

                        </div>


                        <div
                            style={{
                                marginTop: "15px",
                                padding: "12px 14px",
                                borderRadius: "10px",
                                background: "#f0edff",
                                color: "#5748e8",
                                fontSize: "10px"
                            }}
                        >
                            Admin mode uses the global
                            <strong> /expenses </strong>
                            API instead of
                            <strong> /expenses/user/{'{'}userId{'}'} </strong>.
                        </div>

                    </div>

                </main>

            </div>

        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="expenses-layout">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="expenses-sidebar">


                {/* LOGO */}

                <div className="expenses-brand">

                    <div className="expenses-brand-icon">

                        <Receipt size={25} />

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


                {/* =================================================
                    MAIN MENU
                ================================================= */}

                <div className="expenses-sidebar-section">

                    <p>
                        MAIN MENU
                    </p>


                    <button
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                        className="expenses-nav-item"
                    >

                        <LayoutDashboard
                            size={19}
                        />

                        <span>
                            Dashboard
                        </span>

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/groups"
                            )
                        }
                        className="expenses-nav-item"
                    >

                        <Users size={19} />

                        <span>
                            Groups
                        </span>

                    </button>


                    <button
                        className="expenses-nav-item active"
                    >

                        <Receipt size={19} />

                        <span>
                            Expenses
                        </span>

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/settlements"
                            )
                        }
                        className="expenses-nav-item"
                    >

                        <ArrowLeftRight
                            size={19}
                        />

                        <span>
                            Settlements
                        </span>

                    </button>

                </div>


                {/* =================================================
                    ACCOUNT
                ================================================= */}

                <div className="expenses-sidebar-section account-section">

                    <p>
                        ACCOUNT
                    </p>


                    <button
                        onClick={() =>
                            navigate(
                                "/notifications"
                            )
                        }
                        className="expenses-nav-item"
                    >

                        <Bell size={19} />

                        <span>
                            Notifications
                        </span>

                        <span className="notification-dot">
                        </span>

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/profile"
                            )
                        }
                        className="expenses-nav-item"
                    >

                        <UserCircle
                            size={19}
                        />

                        <span>
                            Profile
                        </span>

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/settings"
                            )
                        }
                        className="expenses-nav-item"
                    >

                        <Settings
                            size={19}
                        />

                        <span>
                            Settings
                        </span>

                    </button>

                </div>


                {/* =================================================
                    SIDEBAR BOTTOM
                ================================================= */}

                <div className="expenses-sidebar-bottom">


                    <div className="expenses-help-box">

                        <div className="expenses-help-icon">
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


                    <div className="expenses-user-box">

                        <div className="expenses-user-avatar">

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
                        className="expenses-logout"
                        onClick={
                            handleLogout
                        }
                    >

                        <LogOut size={17} />

                        Logout

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="expenses-main">


                {/* HEADER */}

                <div className="expenses-page-header">

                    <div>

                        <p className="expenses-eyebrow">
                            EXPENSE TRACKING
                        </p>

                        <h1 className="expenses-page-title">
                            Expense History
                        </h1>

                        <p className="expenses-page-subtitle">
                            View, search and manage
                            your shared expenses.
                        </p>

                    </div>


                    <div className="expenses-header-actions">

                        <button
                            className="expenses-export-button"
                            onClick={
                                handleExport
                            }
                        >

                            <Download size={16} />

                            Export CSV

                        </button>


                        <button
                            className="expenses-primary-button"
                            onClick={() =>
                                navigate(
                                    "/expenses/add"
                                )
                            }
                        >

                            <Plus size={17} />

                            Add Expense

                        </button>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="expenses-error">

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={
                                loadExpenses
                            }
                        >

                            <RefreshCw
                                size={15}
                            />

                            Retry

                        </button>

                    </div>

                )}


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <section className="expenses-summary">


                    <div className="expense-summary-card">

                        <div className="expense-summary-icon purple">

                            <Receipt size={21} />

                        </div>

                        <div>

                            <span>
                                TOTAL EXPENSES
                            </span>

                            <strong>
                                ₹
                                {totalAmount.toFixed(
                                    2
                                )}
                            </strong>

                            <p>
                                Across your
                                recorded expenses
                            </p>

                        </div>

                    </div>


                    <div className="expense-summary-card">

                        <div className="expense-summary-icon blue">

                            <Hash size={21} />

                        </div>

                        <div>

                            <span>
                                EXPENSE RECORDS
                            </span>

                            <strong>
                                {totalRecords}
                            </strong>

                            <p>
                                Recorded expenses
                            </p>

                        </div>

                    </div>


                    <div className="expense-summary-card">

                        <div className="expense-summary-icon green">

                            <CheckCircle
                                size={21}
                            />

                        </div>

                        <div>

                            <span>
                                CATEGORIES
                            </span>

                            <strong>
                                {totalCategories}
                            </strong>

                            <p>
                                Different categories
                            </p>

                        </div>

                    </div>


                </section>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <section className="expenses-filter-card">


                    <div className="expenses-search-wrapper">

                        <label>
                            Search expenses
                        </label>


                        <div className="expenses-search-box">

                            <Search size={17} />

                            <input
                                type="text"
                                placeholder="Search by expense, category, group or payer..."
                                value={
                                    searchTerm
                                }
                                onChange={
                                    (e) =>
                                        setSearchTerm(
                                            e.target.value
                                        )
                                }
                            />

                        </div>

                    </div>


                    <div>

                        <label>
                            Category
                        </label>


                        <select
                            value={
                                selectedCategory
                            }
                            onChange={
                                (e) =>
                                    setSelectedCategory(
                                        e.target.value
                                    )
                            }
                        >

                            {categories.map(
                                (category) => (

                                    <option
                                        key={
                                            category
                                        }
                                        value={
                                            category
                                        }
                                    >

                                        {category}

                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </section>


                {/* =================================================
                    EXPENSE LIST
                ================================================= */}

                <section className="expenses-list-card">


                    <div className="expenses-list-header">

                        <div>

                            <h2>
                                My Recent Expenses
                            </h2>

                            <p>
                                Your recorded shared
                                expenses
                            </p>

                        </div>


                        <span>
                            {
                                filteredExpenses.length
                            } records
                        </span>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div className="expenses-empty-state">

                            <RefreshCw
                                size={28}
                                className="expenses-spin"
                            />

                            <h3>
                                Loading expenses...
                            </h3>

                        </div>

                    )}


                    {/* =================================================
                        EMPTY
                    ================================================= */}

                    {!loading &&
                        !error &&
                        expenses.length === 0 && (

                            <div className="expenses-empty-state">

                                <div className="expenses-empty-icon">

                                    <Receipt
                                        size={28}
                                    />

                                </div>

                                <h3>
                                    No expenses yet
                                </h3>

                                <p>
                                    Your recorded
                                    expenses will
                                    appear here.
                                </p>


                                <button
                                    onClick={() =>
                                        navigate(
                                            "/expenses/add"
                                        )
                                    }
                                >

                                    <Plus size={16} />

                                    Add Expense

                                </button>

                            </div>

                        )}


                    {/* =================================================
                        NO SEARCH RESULTS
                    ================================================= */}

                    {!loading &&
                        !error &&
                        expenses.length > 0 &&
                        filteredExpenses.length === 0 && (

                            <div className="expenses-empty-state">

                                <div className="expenses-empty-icon">

                                    <Search
                                        size={28}
                                    />

                                </div>

                                <h3>
                                    No matching expenses
                                </h3>

                                <p>
                                    Try changing your
                                    search or category.
                                </p>

                            </div>

                        )}


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    {!loading &&
                        !error &&
                        filteredExpenses.length > 0 && (

                            <div className="expenses-table-wrapper">

                                <table className="expenses-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Expense
                                            </th>

                                            <th>
                                                Amount
                                            </th>

                                            <th>
                                                Category
                                            </th>

                                            <th>
                                                Group
                                            </th>

                                            <th className="expense-actions-header">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredExpenses.map(
                                            (expense) => {

                                                const name =
                                                    expense.name ||
                                                    expense.title ||
                                                    expense.description ||
                                                    "Expense";


                                                const group =
                                                    expense.group?.name ||
                                                    expense.groupName ||
                                                    expense.group?.groupName ||
                                                    "No group";


                                                const isDeleting =
                                                    Number(
                                                        deletingExpenseId
                                                    ) ===
                                                    Number(
                                                        expense.id
                                                    );


                                                return (

                                                    <tr
                                                        key={
                                                            expense.id
                                                        }
                                                    >


                                                        {/* EXPENSE */}

                                                        <td>

                                                            <div className="expense-name-cell">

                                                                <div className="expense-name-icon">

                                                                    <Receipt
                                                                        size={16}
                                                                    />

                                                                </div>


                                                                <div>

                                                                    <strong>
                                                                        {name}
                                                                    </strong>

                                                                    <span>
                                                                        Expense #
                                                                        {
                                                                            expense.id
                                                                        }
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* AMOUNT */}

                                                        <td className="expense-amount-cell">

                                                            ₹
                                                            {Number(
                                                                expense.amount ||
                                                                0
                                                            ).toFixed(
                                                                2
                                                            )}

                                                        </td>


                                                        {/* CATEGORY */}

                                                        <td>

                                                            <span className="expense-category-badge">

                                                                {expense.category ||
                                                                    "Other"}

                                                            </span>

                                                        </td>


                                                        {/* GROUP */}

                                                        <td>

                                                            <span className="expense-group-badge">

                                                                {group}

                                                            </span>

                                                        </td>


                                                        {/* DELETE */}

                                                        <td className="expense-actions-cell">

                                                            <button
                                                                type="button"
                                                                className="expense-delete-button"
                                                                onClick={() =>
                                                                    handleDeleteExpense(
                                                                        expense.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingExpenseId !==
                                                                    null
                                                                }
                                                                title="Delete expense"
                                                            >

                                                                {isDeleting ? (

                                                                    <RefreshCw
                                                                        size={17}
                                                                        className="expenses-spin"
                                                                    />

                                                                ) : (

                                                                    <Trash2
                                                                        size={17}
                                                                    />

                                                                )}

                                                            </button>

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                </section>

            </main>

        </div>

    );

}


export default Expenses;
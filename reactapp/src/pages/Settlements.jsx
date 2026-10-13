import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import "./Settlements.css";

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
    CheckCircle,
    Wallet,
    IndianRupee
} from "lucide-react";

import {
    getExpensesByUser,
    getAllExpenses,
    getExpenseDetailsForUser
} from "../services/expenseService";

import {
    getSettlements
} from "../services/settlementService";

import Sidebar from "../components/Sidebar";


function Settlements() {

    // =====================================================
    // STATE
    // =====================================================

    const [user, setUser] = useState(null);

    const isAdmin =
        String(
            user?.role ||
            user?.userRole ||
            ""
        ).toUpperCase() === "ADMIN";

    const [settlements, setSettlements] =
        useState([]);

    const [expenses, setExpenses] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // GET CURRENT USER
    // =====================================================

    const getCurrentUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(
                storedUser
            );

        } catch (err) {

            console.error(
                "USER LOAD ERROR:",
                err
            );

            return null;
        }
    };


    // =====================================================
    // LOAD EXPENSE + SPLIT DETAILS
    // =====================================================

    const loadSettlements = useCallback(
        async () => {

            try {

                setLoading(true);
                setError("");

                const loggedInUser =
                    getCurrentUser();

                if (!loggedInUser) {

                    setError(
                        "User session not found. Please login again."
                    );

                    setExpenses([]);

                    return;
                }


                const currentUserId =
                    loggedInUser?.id ||
                    loggedInUser?.userId;


                if (!currentUserId) {

                    setError(
                        "User ID not found. Please login again."
                    );

                    setExpenses([]);

                    return;
                }


                setUser(
                    loggedInUser
                );


                // -------------------------------------------------
                // GET ALL EXPENSES WHERE CURRENT USER PARTICIPATES
                // -------------------------------------------------

                const expenseData =
                    String(
                        loggedInUser?.role ||
                        loggedInUser?.userRole ||
                        ""
                    ).toUpperCase() === "ADMIN"
                        ? await getAllExpenses()
                        : await getExpensesByUser(
                            Number(currentUserId)
                        );

                // Settlement records are global for administrators.
                // The existing user page continues to use the
                // expense-detail calculation for personal balances.
                try {

                    const settlementData =
                        await getSettlements();

                    setSettlements(
                        Array.isArray(
                            settlementData
                        )
                            ? settlementData
                            : []
                    );

                } catch (settlementError) {

                    console.error(
                        "SETTLEMENT RECORD API ERROR:",
                        settlementError
                    );

                    setSettlements([]);

                }


                const basicExpenses =
                    Array.isArray(expenseData)
                        ? expenseData
                        : [];


                // -------------------------------------------------
                // GET DETAILED INFORMATION FOR EVERY EXPENSE
                // -------------------------------------------------

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
                                            Number(currentUserId)
                                        );


                                    return {
                                        ...expense,
                                        details:
                                            details || null
                                    };

                                } catch (detailError) {

                                    console.error(
                                        "EXPENSE DETAIL ERROR:",
                                        expense?.id,
                                        detailError
                                    );


                                    return {
                                        ...expense,
                                        details: null
                                    };
                                }
                            }
                        )
                    );


                setExpenses(
                    detailedExpenses
                );

            } catch (err) {

                console.error(
                    "SETTLEMENT LOAD ERROR:",
                    err
                );


                setExpenses([]);


                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Unable to load settlement details."
                );

            } finally {

                setLoading(false);
            }

        },
        []
    );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadSettlements();

    }, [loadSettlements]);


    // =====================================================
    // USER NAME
    // =====================================================

    const userName =
        user?.name ||
        user?.username ||
        "User";


    // =====================================================
    // TOTAL YOU OWE
    // =====================================================

    const youOwe =
        expenses.reduce(
            (
                total,
                expense
            ) => {

                const detail =
                    expense?.details || {};

                return (
                    total +
                    Number(
                        detail?.amountToPay || 0
                    )
                );
            },
            0
        );


    // =====================================================
    // TOTAL YOU RECEIVE
    // =====================================================

    const youReceive =
        expenses.reduce(
            (
                total,
                expense
            ) => {

                const detail =
                    expense?.details || {};

                return (
                    total +
                    Number(
                        detail?.amountToReceive || 0
                    )
                );
            },
            0
        );


    // =====================================================
    // TOTAL EXPENSE AMOUNT
    // =====================================================

    const totalExpense =
        expenses.reduce(
            (
                total,
                expense
            ) => {

                const detail =
                    expense?.details || {};

                return (
                    total +
                    Number(
                        detail?.amount ??
                        expense?.amount ??
                        0
                    )
                );
            },
            0
        );


    // =====================================================
    // FORMAT CURRENCY
    // =====================================================

    const formatCurrency = (
        amount
    ) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2
            }
        ).format(
            Number(amount || 0)
        );
    };


    // =====================================================
    // NAVIGATION
    // =====================================================

    const navigate = (
        path
    ) => {

        window.location.href =
            path;
    };


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

        localStorage.removeItem(
            "authToken"
        );

        localStorage.removeItem(
            "currentUser"
        );

        window.location.href =
            "/login";
    };


    // =====================================================
    // ADMIN SETTLEMENT VIEW
    // =====================================================

    if (isAdmin && !loading) {

        const formatAdminCurrency =
            amount =>
                new Intl.NumberFormat(
                    "en-IN",
                    {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 2
                    }
                ).format(
                    Number(amount || 0)
                );

        const completedSettlements =
            settlements.filter(
                settlement =>
                    settlement?.settled === true ||
                    [
                        "PAID",
                        "SETTLED",
                        "COMPLETED"
                    ].includes(
                        String(
                            settlement?.status ||
                            ""
                        ).toUpperCase()
                    )
            );

        const pendingSettlements =
            settlements.length -
            completedSettlements.length;

        const settlementValue =
            settlements.reduce(
                (total, settlement) =>
                    total +
                    Number(
                        settlement?.amount ||
                        0
                    ),
                0
            );

        const adminExpenseValue =
            expenses.reduce(
                (total, expense) =>
                    total +
                    Number(
                        expense?.details?.amount ??
                        expense?.amount ??
                        expense?.totalAmount ??
                        0
                    ),
                0
            );


        const getPersonName =
            person => {

                if (!person) {
                    return "Unknown";
                }

                return (
                    person?.name ||
                    person?.username ||
                    person?.userName ||
                    person?.email ||
                    (
                        person?.id
                            ? `User #${person.id}`
                            : "Unknown"
                    )
                );

            };


        const getExpenseName =
            expense => {

                return (
                    expense?.details?.name ||
                    expense?.name ||
                    expense?.title ||
                    expense?.description ||
                    "Unnamed Expense"
                );

            };


        const getGroupName =
            expense => {

                return (
                    expense?.details?.groupName ||
                    expense?.group?.name ||
                    expense?.group?.groupName ||
                    expense?.groupName ||
                    (
                        expense?.groupId
                            ? `Group #${expense.groupId}`
                            : "No group"
                    )
                );

            };


        const getPayerName =
            expense => {

                return (
                    expense?.details?.paidByUserName ||
                    expense?.paidByUserName ||
                    expense?.paidByName ||
                    expense?.payerName ||
                    expense?.paidByUser?.name ||
                    (
                        expense?.paidByUserId
                            ? `User #${expense.paidByUserId}`
                            : "Unknown"
                    )
                );

            };


        return (

            <div className="app-layout">

                <Sidebar />

                <main className="main-content">

                    <div
                        className="admin-settlements-page"
                        style={{
                            minHeight: "100vh",
                            padding: "36px 42px 60px",
                            background: "#f6f8fc"
                        }}
                    >

                        {/* =================================================
                            HEADER
                        ================================================= */}

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
                                    PAYMENT MANAGEMENT
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
                                    All Settlements
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
                                    Administrator view of settlement
                                    records and expense-level payment
                                    information.
                                </p>

                            </div>


                            <button
                                onClick={
                                    loadSettlements
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


                        {error && (

                            <div
                                style={{
                                    marginTop:
                                        "14px",
                                    padding:
                                        "10px",
                                    borderRadius:
                                        "8px",
                                    background:
                                        "#fff1f2",
                                    color:
                                        "#d83f4a",
                                    fontSize:
                                        "11px"
                                }}
                            >
                                {error}
                            </div>

                        )}


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <div
                            style={{
                                display:
                                    "grid",
                                gridTemplateColumns:
                                    "repeat(4, minmax(0, 1fr))",
                                gap:
                                    "14px",
                                margin:
                                    "20px 0"
                            }}
                        >

                            <div className="admin-settlement-summary-card">
                                <span>
                                    SETTLEMENT RECORDS
                                </span>
                                <strong>
                                    {settlements.length}
                                </strong>
                            </div>

                            <div className="admin-settlement-summary-card">
                                <span>
                                    COMPLETED
                                </span>
                                <strong>
                                    {
                                        completedSettlements.length
                                    }
                                </strong>
                            </div>

                            <div className="admin-settlement-summary-card">
                                <span>
                                    PENDING
                                </span>
                                <strong>
                                    {pendingSettlements}
                                </strong>
                            </div>

                            <div className="admin-settlement-summary-card">
                                <span>
                                    SETTLEMENT VALUE
                                </span>
                                <strong>
                                    {
                                        formatAdminCurrency(
                                            settlementValue
                                        )
                                    }
                                </strong>
                            </div>

                        </div>


                        {/* =================================================
                            GLOBAL SETTLEMENT RECORDS
                        ================================================= */}

                        <section
                            style={{
                                marginTop:
                                    "18px"
                            }}
                        >

                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "flex-end",
                                    marginBottom:
                                        "10px"
                                }}
                            >

                                <div>

                                    <p
                                        style={{
                                            margin:
                                                "0 0 5px",
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
                                        SETTLEMENT RECORDS
                                    </p>

                                    <h2
                                        style={{
                                            margin:
                                                0,
                                            color:
                                                "#17366d",
                                            fontSize:
                                                "19px"
                                        }}
                                    >
                                        All Payments
                                    </h2>

                                </div>

                            </div>


                            <div
                                style={{
                                    overflow:
                                        "hidden",
                                    background:
                                        "#ffffff",
                                    border:
                                        "1px solid #dfe6f0",
                                    borderRadius:
                                        "14px"
                                }}
                            >

                                <div
                                    style={{
                                        overflowX:
                                            "auto"
                                    }}
                                >

                                    <table
                                        className="admin-table"
                                        style={{
                                            width:
                                                "100%",
                                            minWidth:
                                                "760px",
                                            borderCollapse:
                                                "collapse"
                                        }}
                                    >

                                        <thead>

                                            <tr>
                                                <th>ID</th>
                                                <th>FROM</th>
                                                <th>TO</th>
                                                <th>AMOUNT</th>
                                                <th>STATUS</th>
                                                <th>DATE</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {settlements.length ===
                                            0 ? (

                                                <tr>

                                                    <td
                                                        colSpan="6"
                                                        className="table-empty"
                                                    >
                                                        No settlement
                                                        records found.
                                                    </td>

                                                </tr>

                                            ) : (

                                                settlements.map(
                                                    settlement => {

                                                        const isPaid =
                                                            settlement?.settled ===
                                                                true ||
                                                            [
                                                                "PAID",
                                                                "SETTLED",
                                                                "COMPLETED"
                                                            ].includes(
                                                                String(
                                                                    settlement?.status ||
                                                                    ""
                                                                ).toUpperCase()
                                                            );

                                                        return (

                                                            <tr
                                                                key={
                                                                    settlement.id
                                                                }
                                                            >

                                                                <td>
                                                                    #
                                                                    {
                                                                        settlement.id
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        getPersonName(
                                                                            settlement?.fromUser ||
                                                                            settlement?.payer ||
                                                                            settlement?.from
                                                                        )
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        getPersonName(
                                                                            settlement?.toUser ||
                                                                            settlement?.receiver ||
                                                                            settlement?.to
                                                                        )
                                                                    }
                                                                </td>

                                                                <td>
                                                                    <strong>
                                                                        {
                                                                            formatAdminCurrency(
                                                                                settlement?.amount
                                                                            )
                                                                        }
                                                                    </strong>
                                                                </td>

                                                                <td>

                                                                    <span
                                                                        style={{
                                                                            display:
                                                                                "inline-flex",
                                                                            padding:
                                                                                "5px 8px",
                                                                            borderRadius:
                                                                                "20px",
                                                                            background:
                                                                                isPaid
                                                                                    ? "#e8f8f0"
                                                                                    : "#fff3e6",
                                                                            color:
                                                                                isPaid
                                                                                    ? "#139765"
                                                                                    : "#d47d21",
                                                                            fontSize:
                                                                                "8px",
                                                                            fontWeight:
                                                                                800
                                                                        }}
                                                                    >
                                                                        {
                                                                            isPaid
                                                                                ? "PAID"
                                                                                : "PENDING"
                                                                        }
                                                                    </span>

                                                                </td>

                                                                <td>
                                                                    {
                                                                        settlement?.createdAt
                                                                            ? new Date(
                                                                                  settlement.createdAt
                                                                              ).toLocaleString()
                                                                            : "—"
                                                                    }
                                                                </td>

                                                            </tr>

                                                        );

                                                    }
                                                )

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            EXPENSE-LEVEL PAYMENT INFORMATION
                        ================================================= */}

                        <section
                            style={{
                                marginTop:
                                    "25px"
                            }}
                        >

                            <div
                                style={{
                                    marginBottom:
                                        "10px"
                                }}
                            >

                                <p
                                    style={{
                                        margin:
                                            "0 0 5px",
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
                                    EXPENSE PAYMENT DETAILS
                                </p>

                                <h2
                                    style={{
                                        margin: 0,
                                        color:
                                            "#17366d",
                                        fontSize:
                                            "19px"
                                    }}
                                >
                                    Expense Settlement Information
                                </h2>

                                <p
                                    style={{
                                        margin:
                                            "5px 0 0",
                                        color:
                                            "#8a99ae",
                                        fontSize:
                                            "10px"
                                    }}
                                >
                                    Total expense value:
                                    {" "}
                                    {
                                        formatAdminCurrency(
                                            adminExpenseValue
                                        )
                                    }
                                </p>

                            </div>


                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(300px, 1fr))",
                                    gap:
                                        "14px"
                                }}
                            >

                                {expenses.length ===
                                0 ? (

                                    <div
                                        style={{
                                            minHeight:
                                                "160px",
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
                                            background:
                                                "#ffffff",
                                            border:
                                                "1px solid #dfe6f0",
                                            borderRadius:
                                                "14px",
                                            color:
                                                "#8191aa"
                                        }}
                                    >

                                        <ArrowLeftRight
                                            size={28}
                                        />

                                        <h3>
                                            No expense
                                            settlement
                                            details found.
                                        </h3>

                                    </div>

                                ) : (

                                    expenses.map(
                                        expense => {

                                            const detail =
                                                expense?.details ||
                                                {};

                                            const shares =
                                                Array.isArray(
                                                    detail?.shares
                                                )
                                                    ? detail.shares
                                                    : Array.isArray(
                                                          expense?.shares
                                                      )
                                                        ? expense.shares
                                                        : [];

                                            const amount =
                                                Number(
                                                    detail?.amount ??
                                                    expense?.amount ??
                                                    expense?.totalAmount ??
                                                    0
                                                );

                                            return (

                                                <article
                                                    key={
                                                        expense.id
                                                    }
                                                    style={{
                                                        padding:
                                                            "16px",
                                                        background:
                                                            "#ffffff",
                                                        border:
                                                            "1px solid #dfe6f0",
                                                        borderRadius:
                                                            "13px"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            gap:
                                                                "10px"
                                                        }}
                                                    >

                                                        <div>

                                                            <h3
                                                                style={{
                                                                    margin:
                                                                        0,
                                                                    color:
                                                                        "#17366d",
                                                                    fontSize:
                                                                        "14px"
                                                                }}
                                                            >
                                                                {
                                                                    getExpenseName(
                                                                        expense
                                                                    )
                                                                }
                                                            </h3>

                                                            <span
                                                                style={{
                                                                    display:
                                                                        "inline-block",
                                                                    marginTop:
                                                                        "4px",
                                                                    padding:
                                                                        "4px 7px",
                                                                    borderRadius:
                                                                        "20px",
                                                                    background:
                                                                        "#edf7ff",
                                                                    color:
                                                                        "#2784d7",
                                                                    fontSize:
                                                                        "8px",
                                                                    fontWeight:
                                                                        800
                                                                }}
                                                            >
                                                                {
                                                                    detail?.category ||
                                                                    expense?.category ||
                                                                    "Other"
                                                                }
                                                            </span>

                                                        </div>


                                                        <strong
                                                            style={{
                                                                color:
                                                                    "#17366d",
                                                                fontSize:
                                                                    "16px"
                                                            }}
                                                        >
                                                            {
                                                                formatAdminCurrency(
                                                                    amount
                                                                )
                                                            }
                                                        </strong>

                                                    </div>


                                                    <div
                                                        style={{
                                                            display:
                                                                "grid",
                                                            gridTemplateColumns:
                                                                "repeat(2, 1fr)",
                                                            gap:
                                                                "9px",
                                                            marginTop:
                                                                "13px",
                                                            padding:
                                                                "10px",
                                                            borderRadius:
                                                                "8px",
                                                            background:
                                                                "#f7f8fc"
                                                        }}
                                                    >

                                                        <div>
                                                            <span
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    color:
                                                                        "#8b9ab1",
                                                                    fontSize:
                                                                        "8px",
                                                                    fontWeight:
                                                                        800
                                                                }}
                                                            >
                                                                GROUP
                                                            </span>

                                                            <strong
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    marginTop:
                                                                        "3px",
                                                                    color:
                                                                        "#263c63",
                                                                    fontSize:
                                                                        "10px"
                                                                }}
                                                            >
                                                                {
                                                                    getGroupName(
                                                                        expense
                                                                    )
                                                                }
                                                            </strong>
                                                        </div>


                                                        <div>
                                                            <span
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    color:
                                                                        "#8b9ab1",
                                                                    fontSize:
                                                                        "8px",
                                                                    fontWeight:
                                                                        800
                                                                }}
                                                            >
                                                                PAID BY
                                                            </span>

                                                            <strong
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    marginTop:
                                                                        "3px",
                                                                    color:
                                                                        "#263c63",
                                                                    fontSize:
                                                                        "10px"
                                                                }}
                                                            >
                                                                {
                                                                    getPayerName(
                                                                        expense
                                                                    )
                                                                }
                                                            </strong>
                                                        </div>

                                                    </div>


                                                    <div
                                                        style={{
                                                            marginTop:
                                                                "12px"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                justifyContent:
                                                                    "space-between",
                                                                paddingBottom:
                                                                    "7px",
                                                                borderBottom:
                                                                    "1px solid #edf0f5"
                                                            }}
                                                        >

                                                            <strong
                                                                style={{
                                                                    color:
                                                                        "#263c63",
                                                                    fontSize:
                                                                        "10px"
                                                                }}
                                                            >
                                                                Member Shares
                                                            </strong>

                                                            <span
                                                                style={{
                                                                    color:
                                                                        "#8a99ae",
                                                                    fontSize:
                                                                        "8px"
                                                                }}
                                                            >
                                                                {
                                                                    shares.length
                                                                }
                                                                {" "}
                                                                members
                                                            </span>

                                                        </div>


                                                        {shares.length ===
                                                        0 ? (

                                                            <div
                                                                style={{
                                                                    marginTop:
                                                                        "8px",
                                                                    padding:
                                                                        "9px",
                                                                    borderRadius:
                                                                        "8px",
                                                                    background:
                                                                        "#fafbfe",
                                                                    color:
                                                                        "#8a99ae",
                                                                    fontSize:
                                                                        "9px"
                                                                }}
                                                            >
                                                                Member share
                                                                details were
                                                                not returned
                                                                by the backend.
                                                            </div>

                                                        ) : (

                                                            shares.map(
                                                                (
                                                                    share,
                                                                    index
                                                                ) => {

                                                                    const name =
                                                                        getPersonName(
                                                                            share
                                                                        );

                                                                    const shareAmount =
                                                                        Number(
                                                                            share?.shareAmount ??
                                                                            share?.amount ??
                                                                            share?.share ??
                                                                            0
                                                                        );

                                                                    return (

                                                                        <div
                                                                            key={
                                                                                share?.userId ||
                                                                                share?.id ||
                                                                                index
                                                                            }
                                                                            style={{
                                                                                display:
                                                                                    "flex",
                                                                                alignItems:
                                                                                    "center",
                                                                                gap:
                                                                                    "8px",
                                                                                padding:
                                                                                    "8px 0",
                                                                                borderBottom:
                                                                                    "1px solid #f0f2f6"
                                                                            }}
                                                                        >

                                                                            <div
                                                                                style={{
                                                                                    width:
                                                                                        "28px",
                                                                                    height:
                                                                                        "28px",
                                                                                    display:
                                                                                        "grid",
                                                                                    placeItems:
                                                                                        "center",
                                                                                    borderRadius:
                                                                                        "50%",
                                                                                    background:
                                                                                        "#eeebff",
                                                                                    color:
                                                                                        "#5748e8",
                                                                                    fontSize:
                                                                                        "10px",
                                                                                    fontWeight:
                                                                                        800
                                                                                }}
                                                                            >
                                                                                {
                                                                                    name
                                                                                        .charAt(
                                                                                            0
                                                                                        )
                                                                                        .toUpperCase()
                                                                                }
                                                                            </div>

                                                                            <div
                                                                                style={{
                                                                                    flex:
                                                                                        1
                                                                                }}
                                                                            >

                                                                                <strong
                                                                                    style={{
                                                                                        display:
                                                                                            "block",
                                                                                        color:
                                                                                            "#263c63",
                                                                                        fontSize:
                                                                                            "10px"
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        name
                                                                                    }
                                                                                </strong>

                                                                                <span
                                                                                    style={{
                                                                                        display:
                                                                                            "block",
                                                                                        marginTop:
                                                                                            "2px",
                                                                                        color:
                                                                                            "#8a99ae",
                                                                                        fontSize:
                                                                                            "8px"
                                                                                    }}
                                                                                >
                                                                                    User ID:
                                                                                    {" "}
                                                                                    {
                                                                                        share?.userId ||
                                                                                        share?.id ||
                                                                                        "—"
                                                                                    }
                                                                                </span>

                                                                            </div>

                                                                            <strong
                                                                                style={{
                                                                                    color:
                                                                                        "#17366d",
                                                                                    fontSize:
                                                                                        "10px"
                                                                                }}
                                                                            >
                                                                                {
                                                                                    formatAdminCurrency(
                                                                                        shareAmount
                                                                                    )
                                                                                }
                                                                            </strong>

                                                                        </div>

                                                                    );

                                                                }
                                                            )

                                                        )}

                                                    </div>

                                                </article>

                                            );

                                        }
                                    )

                                )}

                            </div>

                        </section>


                        <div
                            style={{
                                marginTop:
                                    "20px",
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
                            Administrator settlement records come from
                            <strong> /settlements </strong>
                            and expense information comes from the global
                            <strong> /expenses </strong>
                            endpoint. Individual member shares depend on
                            the detail response returned by the backend.
                        </div>

                    </div>

                </main>

            </div>

        );

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="settlements-layout">

                <main className="settlements-main">

                    <div className="settlements-loading">

                        <RefreshCw
                            size={30}
                            className="settlements-spin"
                        />

                        <h2>
                            Loading settlement details...
                        </h2>

                        <p>
                            Calculating your shares and
                            member payments.
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="settlements-layout">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="settlements-sidebar">

                {/* BRAND */}

                <div className="settlements-brand">

                    <div className="settlements-brand-icon">
                        <Receipt size={23} />
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

                <div className="settlements-sidebar-section">

                    <p>
                        MAIN MENU
                    </p>


                    <button
                        className="settlements-nav-item"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <LayoutDashboard size={19} />

                        <span>
                            Dashboard
                        </span>
                    </button>


                    <button
                        className="settlements-nav-item"
                        onClick={() =>
                            navigate("/groups")
                        }
                    >
                        <Users size={19} />

                        <span>
                            Groups
                        </span>
                    </button>


                    <button
                        className="settlements-nav-item"
                        onClick={() =>
                            navigate("/expenses")
                        }
                    >
                        <Receipt size={19} />

                        <span>
                            Expenses
                        </span>
                    </button>


                    <button
                        className="settlements-nav-item active"
                    >
                        <ArrowLeftRight size={19} />

                        <span>
                            Settlements
                        </span>
                    </button>

                </div>


                {/* ACCOUNT */}

                <div className="settlements-sidebar-section account-section">

                    <p>
                        ACCOUNT
                    </p>


                    <button
                        className="settlements-nav-item"
                        onClick={() =>
                            navigate("/notifications")
                        }
                    >
                        <Bell size={19} />

                        <span>
                            Notifications
                        </span>
                    </button>


                    <button
                        className="settlements-nav-item"
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        <UserCircle size={19} />

                        <span>
                            Profile
                        </span>
                    </button>


                    <button
                        className="settlements-nav-item"
                        onClick={() =>
                            navigate("/settings")
                        }
                    >
                        <Settings size={19} />

                        <span>
                            Settings
                        </span>
                    </button>

                </div>


                {/* SIDEBAR BOTTOM */}

                <div className="settlements-sidebar-bottom">

                    <div className="settlements-help-box">

                        <div className="settlements-help-icon">
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


                    <div className="settlements-user-box">

                        <div className="settlements-user-avatar">

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
                        className="settlements-logout"
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

            <main className="settlements-main">

                {/* HEADER */}

                <div className="settlements-header-row">

                    <div>

                        <p className="settlements-eyebrow">
                            PAYMENT SETTLEMENT
                        </p>

                        <h1>
                            Settlements
                        </h1>

                        <p className="settlements-subtitle">
                            See exactly who paid, who owes,
                            and how much each member has to pay.
                        </p>

                    </div>


                    <button
                        className="settlements-refresh-button"
                        onClick={
                            loadSettlements
                        }
                        disabled={loading}
                    >

                        <RefreshCw size={16} />

                        Refresh

                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="settlements-error">

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={
                                loadSettlements
                            }
                        >
                            Retry
                        </button>

                    </div>

                )}


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <section className="settlements-summary">


                    {/* TOTAL EXPENSE */}

                    <div className="settlement-summary-card">

                        <div className="settlement-summary-icon blue">
                            <Receipt size={21} />
                        </div>

                        <div className="settlement-summary-content">

                            <span>
                                TOTAL EXPENSES
                            </span>

                            <strong>
                                {formatCurrency(
                                    totalExpense
                                )}
                            </strong>

                            <p>
                                Total shared expenses
                            </p>

                        </div>

                    </div>


                    {/* YOU OWE */}

                    <div className="settlement-summary-card">

                        <div className="settlement-summary-icon red">
                            <Wallet size={21} />
                        </div>

                        <div className="settlement-summary-content">

                            <span>
                                YOU OWE
                            </span>

                            <strong>
                                {formatCurrency(
                                    youOwe
                                )}
                            </strong>

                            <p>
                                Amount you need to pay
                            </p>

                        </div>

                    </div>


                    {/* YOU RECEIVE */}

                    <div className="settlement-summary-card">

                        <div className="settlement-summary-icon green">
                            <IndianRupee size={21} />
                        </div>

                        <div className="settlement-summary-content">

                            <span>
                                YOU RECEIVE
                            </span>

                            <strong>
                                {formatCurrency(
                                    youReceive
                                )}
                            </strong>

                            <p>
                                Amount others owe you
                            </p>

                        </div>

                    </div>


                    {/* RECORDS */}

                    <div className="settlement-summary-card">

                        <div className="settlement-summary-icon orange">
                            <Users size={21} />
                        </div>

                        <div className="settlement-summary-content">

                            <span>
                                EXPENSE RECORDS
                            </span>

                            <strong>
                                {expenses.length}
                            </strong>

                            <p>
                                Shared expense records
                            </p>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    EXPENSE SETTLEMENT DETAILS
                ================================================= */}

                <section className="settlements-list-card">

                    <div className="settlements-list-header">

                        <div>

                            <h2>
                                Expense Settlement Details
                            </h2>

                            <p>
                                Who paid the full amount and
                                how much each member owes.
                            </p>

                        </div>

                        <span>
                            {expenses.length} records
                        </span>

                    </div>


                    {/* NO EXPENSES */}

                    {expenses.length === 0 && !error && (

                        <div className="settlements-empty-card">

                            <div className="settlements-empty-icon">

                                <ArrowLeftRight
                                    size={28}
                                />

                            </div>

                            <h3>
                                No expense details yet
                            </h3>

                            <p>
                                Add a shared expense to see
                                the individual member shares here.
                            </p>

                        </div>

                    )}


                    {/* EXPENSE LIST */}

                    {expenses.length > 0 && (

                        <div className="settlements-expense-list">

                            {expenses.map(
                                (
                                    expense
                                ) => {

                                    const detail =
                                        expense?.details ||
                                        {};


                                    const amount =
                                        Number(
                                            detail?.amount ??
                                            expense?.amount ??
                                            0
                                        );


                                    const category =
                                        detail?.category ||
                                        expense?.category ||
                                        "Other";


                                    const groupName =
                                        detail?.groupName ||
                                        `Group #${detail?.groupId || expense?.groupId || "-"}`;


                                    const payerName =
                                        detail?.paidByUserName ||
                                        "Unknown";


                                    const userShare =
                                        Number(
                                            detail?.userShare ||
                                            0
                                        );


                                    const amountToPay =
                                        Number(
                                            detail?.amountToPay ||
                                            0
                                        );


                                    const amountToReceive =
                                        Number(
                                            detail?.amountToReceive ||
                                            0
                                        );


                                    const shares =
                                        Array.isArray(
                                            detail?.shares
                                        )
                                            ? detail.shares
                                            : [];


                                    return (

                                        <div
                                            className="settlement-expense-card"
                                            key={
                                                expense?.id
                                            }
                                        >

                                            {/* EXPENSE HEADER */}

                                            <div className="settlement-expense-header">

                                                <div className="settlement-expense-title">

                                                    <div className="settlement-expense-icon">

                                                        <IndianRupee
                                                            size={18}
                                                        />

                                                    </div>

                                                    <div>

                                                        <h3>
                                                            {expense?.name ||
                                                                detail?.name ||
                                                                "Unnamed Expense"}
                                                        </h3>

                                                        <span>
                                                            {category}
                                                        </span>

                                                    </div>

                                                </div>


                                                <div className="settlement-expense-total">

                                                    {formatCurrency(
                                                        amount
                                                    )}

                                                </div>

                                            </div>


                                            {/* BASIC DETAILS */}

                                            <div className="settlement-expense-info">

                                                <div>

                                                    <span>
                                                        GROUP
                                                    </span>

                                                    <strong>
                                                        {groupName}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        PAID BY
                                                    </span>

                                                    <strong className="payer-name">
                                                        {payerName}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        EACH MEMBER SHARE
                                                    </span>

                                                    <strong>
                                                        {formatCurrency(
                                                            userShare
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* CURRENT USER SUMMARY */}

                                            <div className="settlement-personal-summary">

                                                <div>

                                                    <span>
                                                        YOUR SHARE
                                                    </span>

                                                    <strong>
                                                        {formatCurrency(
                                                            userShare
                                                        )}
                                                    </strong>

                                                </div>


                                                {amountToPay > 0 && (

                                                    <div className="owe-box">

                                                        <span>
                                                            YOU OWE
                                                        </span>

                                                        <strong>
                                                            {formatCurrency(
                                                                amountToPay
                                                            )}
                                                        </strong>

                                                    </div>

                                                )}


                                                {amountToReceive > 0 && (

                                                    <div className="receive-box">

                                                        <span>
                                                            YOU RECEIVE
                                                        </span>

                                                        <strong>
                                                            {formatCurrency(
                                                                amountToReceive
                                                            )}
                                                        </strong>

                                                    </div>

                                                )}


                                                {amountToPay === 0 &&
                                                    amountToReceive === 0 && (

                                                        <div className="paid-your-share-box">

                                                            <span>
                                                                STATUS
                                                            </span>

                                                            <strong>
                                                                Paid your share
                                                            </strong>

                                                        </div>

                                                    )}

                                            </div>


                                            {/* MEMBER SHARES */}

                                            <div className="settlement-members-section">

                                                <div className="settlement-members-title">

                                                    <h4>
                                                        Member Shares
                                                    </h4>

                                                    <span>
                                                        {shares.length} members
                                                    </span>

                                                </div>


                                                {shares.length === 0 ? (

                                                    <div className="settlement-no-shares">
                                                        Member share details unavailable.
                                                    </div>

                                                ) : (

                                                    <div className="settlement-members-list">

                                                        {shares.map(
                                                            (
                                                                share,
                                                                index
                                                            ) => {

                                                                const memberName =
                                                                    share?.userName ||
                                                                    share?.name ||
                                                                    share?.username ||
                                                                    `Member ${index + 1}`;


                                                                const memberAmount =
                                                                    Number(
                                                                        share?.shareAmount ??
                                                                        share?.amount ??
                                                                        share?.share ??
                                                                        0
                                                                    );


                                                                const isPayer =
                                                                    share?.isPayer === true ||
                                                                    share?.paidBy === true ||
                                                                    share?.payer === true ||
                                                                    Number(
                                                                        share?.userId
                                                                    ) ===
                                                                    Number(
                                                                        detail?.paidByUserId
                                                                    );


                                                                return (

                                                                    <div
                                                                        className="settlement-member-row"
                                                                        key={
                                                                            share?.userId ||
                                                                            share?.id ||
                                                                            index
                                                                        }
                                                                    >

                                                                        <div className="settlement-member-person">

                                                                            <div className="settlement-member-avatar">

                                                                                {memberName
                                                                                    .charAt(0)
                                                                                    .toUpperCase()}

                                                                            </div>

                                                                            <div>

                                                                                <strong>
                                                                                    {memberName}
                                                                                </strong>

                                                                                <span>
                                                                                    {isPayer
                                                                                        ? `Paid full amount to cover this expense`
                                                                                        : `Owes ${payerName}`}
                                                                                </span>

                                                                            </div>

                                                                        </div>


                                                                        <div className="settlement-member-amount">

                                                                            {formatCurrency(
                                                                                memberAmount
                                                                            )}

                                                                        </div>


                                                                        {isPayer ? (

                                                                            <span className="member-paid-badge">

                                                                                <CheckCircle
                                                                                    size={14}
                                                                                />

                                                                                PAID

                                                                            </span>

                                                                        ) : (

                                                                            <span className="member-owe-badge">

                                                                                OWES

                                                                            </span>

                                                                        )}

                                                                    </div>

                                                                );
                                                            }
                                                        )}

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    );
                                }
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Settlements;
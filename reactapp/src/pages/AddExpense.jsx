import React, {
    useEffect,
    useState,
    useCallback
} from "react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import {
    ArrowLeft,
    Receipt,
    Save,
    Users,
    IndianRupee,
    Tag
} from "lucide-react";

import {
    createExpense
} from "../services/expenseService";

import {
    getGroupsByUser
} from "../services/groupService";

import "./AddExpense.css";


function AddExpense() {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    // =====================================================
    // STATE
    // =====================================================

    const [groups, setGroups] =
        useState([]);

    const [loadingGroups, setLoadingGroups] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [form, setForm] = useState({

        name: "",

        amount: "",

        category: "",

        groupId: ""

    });


    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const getLoggedInUser = () => {

        try {

            return JSON.parse(
                localStorage.getItem("user") || "null"
            );

        } catch (error) {

            console.error(
                "USER DATA ERROR:",
                error
            );

            return null;
        }
    };


    // =====================================================
    // LOAD USER GROUPS
    // =====================================================

    const loadGroups = useCallback(
        async () => {

            try {

                setLoadingGroups(true);

                setError("");

                const user =
                    getLoggedInUser();

                const userId =
                    user?.id ||
                    user?.userId ||
                    user?.uid;

                if (!userId) {

                    setError(
                        "Unable to identify the logged-in user. Please login again."
                    );

                    return;
                }

                console.log(
                    "Loading groups for user:",
                    userId
                );

                const data =
                    await getGroupsByUser(
                        Number(userId)
                    );

                console.log(
                    "USER GROUPS:",
                    data
                );

                const userGroups =
                    Array.isArray(data)
                        ? data
                        : [];

                setGroups(
                    userGroups
                );

                // =================================================
                // GROUP ID FROM URL
                //
                // Example:
                // /expenses/add?groupId=5
                // =================================================

                const groupIdFromUrl =
                    searchParams.get(
                        "groupId"
                    );

                if (groupIdFromUrl) {

                    const matchingGroup =
                        userGroups.find(
                            (group) =>
                                String(
                                    group.id
                                ) ===
                                String(
                                    groupIdFromUrl
                                )
                        );

                    if (matchingGroup) {

                        setForm(
                            (previous) => ({
                                ...previous,
                                groupId:
                                    String(
                                        matchingGroup.id
                                    )
                            })
                        );
                    }
                }

            } catch (err) {

                console.error(
                    "LOAD GROUPS ERROR:",
                    err
                );

                const message =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.response?.data ||
                    err?.message ||
                    "Unable to load your groups.";

                setError(
                    typeof message === "string"
                        ? message
                        : "Unable to load your groups."
                );

            } finally {

                setLoadingGroups(false);

            }

        },
        [searchParams]
    );


    // =====================================================
    // LOAD GROUPS
    // =====================================================

    useEffect(() => {

        loadGroups();

    }, [loadGroups]);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );

        setError("");
        setSuccess("");
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        // =================================================
        // VALIDATE USER
        // =================================================

        const user =
            getLoggedInUser();

        const userId =
            user?.id ||
            user?.userId ||
            user?.uid;

        if (!userId) {

            setError(
                "Logged-in user not found. Please login again."
            );

            return;
        }


        // =================================================
        // VALIDATE EXPENSE NAME
        // =================================================

        const expenseName =
            form.name.trim();

        if (!expenseName) {

            setError(
                "Please enter an expense name."
            );

            return;
        }


        // =================================================
        // VALIDATE AMOUNT
        // =================================================

        const amount =
            Number(form.amount);

        if (
            !form.amount ||
            Number.isNaN(amount) ||
            amount <= 0
        ) {

            setError(
                "Please enter a valid amount greater than zero."
            );

            return;
        }


        // =================================================
        // VALIDATE CATEGORY
        // =================================================

        const category =
            form.category.trim();

        if (!category) {

            setError(
                "Please enter an expense category."
            );

            return;
        }


        // =================================================
        // VALIDATE GROUP
        // =================================================

        if (!form.groupId) {

            setError(
                "Please select a group."
            );

            return;
        }


        // =================================================
        // PAYLOAD
        // =================================================

        const payload = {

            name: expenseName,

            amount: amount,

            category: category,

            groupId:
                Number(form.groupId),

            paidByUserId:
                Number(userId)

        };


        console.log(
            "CREATE EXPENSE PAYLOAD:",
            payload
        );


        // =================================================
        // API CALL
        // =================================================

        try {

            setLoading(true);

            const createdExpense =
                await createExpense(
                    payload
                );

            console.log(
                "EXPENSE CREATED:",
                createdExpense
            );

            setSuccess(
                "Expense added successfully!"
            );

            // =================================================
            // CLEAR FORM
            // =================================================

            setForm(
                (previous) => ({
                    ...previous,

                    name: "",

                    amount: "",

                    category: ""

                    // Keep group selected
                })
            );


            // =================================================
            // AFTER SUCCESS
            // =================================================

            setTimeout(() => {

                navigate(
                    `/expenses`
                );

            }, 800);

        } catch (err) {

            console.error(
                "CREATE EXPENSE ERROR:",
                err
            );

            console.error(
                "STATUS:",
                err?.response?.status
            );

            console.error(
                "BACKEND RESPONSE:",
                err?.response?.data
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.response?.data ||
                err?.message ||
                "Unable to create expense.";

            setError(
                typeof message === "string"
                    ? message
                    : "Unable to create expense."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="add-expense-page">


            {/* =================================================
                HEADER
                ================================================= */}

            <div className="add-expense-header">

                <div className="add-expense-title-area">

                    <div className="add-expense-icon">

                        <Receipt
                            size={27}
                        />

                    </div>


                    <div>

                        <p className="page-eyebrow">
                            EXPENSE MANAGEMENT
                        </p>

                        <h1>
                            Add Expense
                        </h1>

                        <p>
                            Record a new shared expense for one of your groups.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="expense-back-button"
                    onClick={() =>
                        navigate("/expenses")
                    }
                    disabled={loading}
                >

                    <ArrowLeft
                        size={17}
                    />

                    Back to Expenses

                </button>

            </div>


            {/* =================================================
                MAIN CARD
                ================================================= */}

            <div className="add-expense-card">


                <div className="add-expense-card-header">

                    <div className="card-heading-icon">

                        <Receipt
                            size={22}
                        />

                    </div>


                    <div>

                        <h2>
                            Expense Details
                        </h2>

                        <p>
                            Enter the details of your shared expense.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                    ================================================= */}

                {error && (

                    <div className="expense-alert expense-error">

                        <strong>
                            Unable to add expense
                        </strong>

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* =================================================
                    SUCCESS
                    ================================================= */}

                {success && (

                    <div className="expense-alert expense-success">

                        <strong>
                            Success
                        </strong>

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                <form
                    className="add-expense-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                        EXPENSE NAME
                        ================================================= */}

                    <div className="expense-form-group">

                        <label htmlFor="name">

                            Expense Name

                            <span className="required">
                                *
                            </span>

                        </label>


                        <div className="input-with-icon">

                            <Receipt
                                size={17}
                            />

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Example: Dinner"
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* =================================================
                        AMOUNT
                        ================================================= */}

                    <div className="expense-form-group">

                        <label htmlFor="amount">

                            Amount

                            <span className="required">
                                *
                            </span>

                        </label>


                        <div className="input-with-icon">

                            <IndianRupee
                                size={17}
                            />

                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="Example: 500"
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* =================================================
                        CATEGORY
                        ================================================= */}

                    <div className="expense-form-group">

                        <label htmlFor="category">

                            Category

                            <span className="required">
                                *
                            </span>

                        </label>


                        <div className="input-with-icon">

                            <Tag
                                size={17}
                            />

                            <select
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                disabled={loading}
                            >

                                <option value="">
                                    Select category
                                </option>

                                <option value="Food">
                                    Food
                                </option>

                                <option value="Travel">
                                    Travel
                                </option>

                                <option value="Shopping">
                                    Shopping
                                </option>

                                <option value="Entertainment">
                                    Entertainment
                                </option>

                                <option value="Bills">
                                    Bills
                                </option>

                                <option value="Accommodation">
                                    Accommodation
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* =================================================
                        GROUP
                        ================================================= */}

                    <div className="expense-form-group full-width">

                        <label htmlFor="groupId">

                            Group

                            <span className="required">
                                *
                            </span>

                        </label>


                        <div className="input-with-icon">

                            <Users
                                size={17}
                            />


                            <select
                                id="groupId"
                                name="groupId"
                                value={form.groupId}
                                onChange={handleChange}
                                disabled={
                                    loading ||
                                    loadingGroups
                                }
                            >

                                <option value="">

                                    {loadingGroups
                                        ? "Loading your groups..."
                                        : "Select a group"}

                                </option>


                                {groups.map(
                                    (group) => (

                                        <option
                                            key={group.id}
                                            value={group.id}
                                        >

                                            {group.groupName}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {!loadingGroups &&
                            groups.length === 0 && (

                                <div className="no-groups-message">

                                    <span>
                                        You don't have any groups yet.
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/groups/create"
                                            )
                                        }
                                    >
                                        Create a group
                                    </button>

                                </div>

                            )}

                    </div>


                    {/* =================================================
                        CURRENT USER
                        ================================================= */}

                    <div className="expense-payer-card">

                        <div className="payer-icon">

                            <Users
                                size={19}
                            />

                        </div>


                        <div>

                            <span className="payer-label">
                                Paid by
                            </span>

                            <strong>

                                {getLoggedInUser()?.name ||
                                    getLoggedInUser()?.username ||
                                    "Current User"}

                            </strong>

                            <small>
                                This expense will be recorded under your account.
                            </small>

                        </div>

                    </div>


                    {/* =================================================
                        ACTIONS
                        ================================================= */}

                    <div className="add-expense-actions">

                        <button
                            type="button"
                            className="cancel-expense-button"
                            onClick={() =>
                                navigate("/expenses")
                            }
                            disabled={loading}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="save-expense-button"
                            disabled={
                                loading ||
                                loadingGroups ||
                                groups.length === 0
                            }
                        >

                            <Save
                                size={17}
                            />

                            {loading
                                ? "Adding..."
                                : "Add Expense"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default AddExpense;
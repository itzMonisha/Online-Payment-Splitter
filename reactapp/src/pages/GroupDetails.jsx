import React, {
    useEffect,
    useState,
    useCallback
} from "react";

import "./GroupDetails.css";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    ArrowLeft,
    Users,
    Receipt,
    Plus,
    X,
    Search,
    UserPlus,
    Trash2,
    Pencil,
    IndianRupee
} from "lucide-react";

import {
    getGroupById,
    getGroupMembers,
    addGroupMember,
    removeGroupMember,
    searchUsers,
    updateGroup
} from "../services/groupService";

import {
    createExpense,
    getExpensesByGroup,
    updateExpense,
    deleteExpense
} from "../services/expenseService";


function GroupDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // GROUP
    // =====================================================

    const [group, setGroup] = useState(null);

    const [loading, setLoading] = useState(true);

    const [pageError, setPageError] = useState("");


    // =====================================================
    // MEMBERS
    // =====================================================

    const [members, setMembers] = useState([]);

    const [membersLoading, setMembersLoading] =
        useState(false);

    const [showMemberModal, setShowMemberModal] =
        useState(false);

    const [memberSearch, setMemberSearch] =
        useState("");

    const [users, setUsers] = useState([]);

    const [searchLoading, setSearchLoading] =
        useState(false);

    const [memberError, setMemberError] =
        useState("");

    const [memberSuccess, setMemberSuccess] =
        useState("");


    // =====================================================
    // EXPENSES
    // =====================================================

    const [expenses, setExpenses] = useState([]);

    const [expensesLoading, setExpensesLoading] =
        useState(false);

    const [showExpenseModal, setShowExpenseModal] =
        useState(false);

    const [expenseForm, setExpenseForm] = useState({
        name: "",
        amount: "",
        category: "Food",
        paidByUserId: ""
    });

    const [expenseError, setExpenseError] =
        useState("");

    const [expenseSuccess, setExpenseSuccess] =
        useState("");

    const [expenseSaving, setExpenseSaving] =
        useState(false);

    // =====================================================
    // EDIT EXPENSE
    // =====================================================

    const [showEditExpenseModal, setShowEditExpenseModal] =
        useState(false);

    const [editExpenseForm, setEditExpenseForm] = useState({
        id: "",
        name: "",
        amount: "",
        category: "Food",
        paidByUserId: ""
    });

    const [editExpenseError, setEditExpenseError] =
        useState("");

    const [editExpenseSuccess, setEditExpenseSuccess] =
        useState("");

    const [editExpenseSaving, setEditExpenseSaving] =
        useState(false);


    // =====================================================
    // LOAD GROUP
    // =====================================================

    useEffect(() => {

        const loadGroup = async () => {

            try {

                setLoading(true);

                setPageError("");

                const data =
                    await getGroupById(id);

                if (!data) {

                    setPageError(
                        "Group not found."
                    );

                    return;
                }

                setGroup(data);

            } catch (error) {

                console.error(
                    "GROUP DETAILS ERROR:",
                    error
                );

                setPageError(
                    error?.userMessage ||
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Unable to load group."
                );

            } finally {

                setLoading(false);

            }

        };


        if (id) {

            loadGroup();

        }

    }, [id]);
// =====================================================
// OPEN EDIT GROUP MODAL
// =====================================================

const openEditGroupModal = () => {

    setEditGroupForm({

        name:
            group?.groupName ||
            group?.name ||
            "",

        description:
            group?.description ||
            ""
    });

    setEditGroupError("");
    setEditGroupSuccess("");

    setShowEditGroupModal(true);
};


// =====================================================
// CLOSE EDIT GROUP MODAL
// =====================================================

const closeEditGroupModal = () => {

    if (editGroupSaving) {
        return;
    }

    setShowEditGroupModal(false);

    setEditGroupError("");
    setEditGroupSuccess("");
};


// =====================================================
// EDIT GROUP FORM CHANGE
// =====================================================

const handleEditGroupChange = (event) => {

    const {
        name,
        value
    } = event.target;

    setEditGroupForm(
        (previous) => ({
            ...previous,
            [name]: value
        })
    );

    setEditGroupError("");
};


// =====================================================
// UPDATE GROUP
// =====================================================

const handleUpdateGroup = async (event) => {

    event.preventDefault();

    setEditGroupError("");
    setEditGroupSuccess("");


    // =================================================
    // VALIDATE GROUP NAME
    // =================================================

    const groupName =
        editGroupForm.name.trim();

    if (!groupName) {

        setEditGroupError(
            "Please enter a group name."
        );

        return;
    }


    if (groupName.length < 3) {

        setEditGroupError(
            "Group name must contain at least 3 characters."
        );

        return;
    }


    // =================================================
    // VALIDATE DESCRIPTION
    // =================================================

    const description =
        editGroupForm.description.trim();


    try {

        setEditGroupSaving(true);


        // =================================================
        // DATA SENT TO BACKEND
        // =================================================

        const groupData = {

            groupName: groupName,

            description: description
        };


        console.log(
            "UPDATING GROUP:",
            id,
            groupData
        );


        // =================================================
        // PUT REQUEST
        // =================================================

        const updatedGroup =
            await updateGroup(
                id,
                groupData
            );


        // =================================================
        // UPDATE UI IMMEDIATELY
        // =================================================

        setGroup(
            (previousGroup) => ({

                ...previousGroup,

                ...(updatedGroup || {}),

                groupName:
                    updatedGroup?.groupName ||
                    updatedGroup?.name ||
                    groupName,

                name:
                    updatedGroup?.name ||
                    groupName,

                description:
                    updatedGroup?.description !== undefined
                        ? updatedGroup.description
                        : description
            })
        );


        setEditGroupSuccess(
            "Group updated successfully."
        );


        // =================================================
        // CLOSE MODAL
        // =================================================

        setTimeout(() => {

            setShowEditGroupModal(false);

            setEditGroupError("");
            setEditGroupSuccess("");

        }, 700);


    } catch (error) {

        console.error(
            "UPDATE GROUP ERROR:",
            error
        );


        const message =
            error?.userMessage ||
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            (
                typeof error?.response?.data === "string"
                    ? error.response.data
                    : null
            ) ||
            error?.message ||
            "Unable to update group.";


        setEditGroupError(
            message
        );


    } finally {

        setEditGroupSaving(false);
    }
};
    // =====================================================
    // LOAD MEMBERS
    // =====================================================

    const loadMembers = useCallback(
        async () => {

            if (!id) {
                return;
            }

            try {

                setMembersLoading(true);

                const data =
                    await getGroupMembers(id);

                const memberList =
                    Array.isArray(data)
                        ? data
                        : [];

                setMembers(memberList);

            } catch (error) {

                console.error(
                    "MEMBERS ERROR:",
                    error
                );

                setMembers([]);

            } finally {

                setMembersLoading(false);

            }

        },
        [id]
    );


    // =====================================================
    // LOAD EXPENSES
    // =====================================================

    const loadExpenses = useCallback(
        async () => {

            if (!id) {
                return;
            }

            try {

                setExpensesLoading(true);

                const data =
                    await getExpensesByGroup(id);

                setExpenses(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "EXPENSES LOAD ERROR:",
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

                setExpenses([]);

            } finally {

                setExpensesLoading(false);

            }

        },
        [id]
    );


    // =====================================================
    // LOAD MEMBERS + EXPENSES
    // =====================================================

    useEffect(() => {

        if (!group || !id) {
            return;
        }

        loadMembers();

        loadExpenses();

    }, [
        group,
        id,
        loadMembers,
        loadExpenses
    ]);


    // =====================================================
    // SEARCH USERS
    // =====================================================

    useEffect(() => {

        if (!showMemberModal) {
            return;
        }

        const keyword =
            memberSearch.trim();

        if (!keyword) {

            setUsers([]);

            setMemberError("");

            return;
        }


        const timer =
            setTimeout(
                async () => {

                    try {

                        setSearchLoading(true);

                        setMemberError("");

                        const data =
                            await searchUsers(
                                keyword
                            );


                        // IDs of users already in group
                        const existingMemberIds =
                            members.map(
                                (member) =>
                                    Number(member.id)
                            );


                        // Remove existing members
                        const filteredUsers =
                            Array.isArray(data)
                                ? data.filter(
                                    (user) =>
                                        !existingMemberIds.includes(
                                            Number(user.id)
                                        )
                                )
                                : [];


                        setUsers(
                            filteredUsers
                        );

                    } catch (error) {

                        console.error(
                            "USER SEARCH ERROR:",
                            error
                        );

                        setUsers([]);

                        setMemberError(
                            error?.response?.data?.message ||
                            error?.response?.data?.error ||
                            "Unable to search users."
                        );

                    } finally {

                        setSearchLoading(false);

                    }

                },
                400
            );


        return () =>
            clearTimeout(timer);

    }, [
        memberSearch,
        showMemberModal,
        members
    ]);


    // =====================================================
    // OPEN MEMBER MODAL
    // =====================================================

    const openMemberModal = () => {

        setMemberSearch("");

        setUsers([]);

        setMemberError("");

        setMemberSuccess("");

        setShowMemberModal(true);

    };
    // =====================================================
// EDIT GROUP
// =====================================================

const [showEditGroupModal, setShowEditGroupModal] =
    useState(false);

const [editGroupForm, setEditGroupForm] = useState({
    name: "",
    description: ""
});

const [editGroupError, setEditGroupError] =
    useState("");

const [editGroupSuccess, setEditGroupSuccess] =
    useState("");

const [editGroupSaving, setEditGroupSaving] =
    useState(false);


    // =====================================================
    // CLOSE MEMBER MODAL
    // =====================================================

    const closeMemberModal = () => {

        setShowMemberModal(false);

        setMemberSearch("");

        setUsers([]);

        setMemberError("");

        setMemberSuccess("");

    };


    // =====================================================
    // ADD MEMBER
    // =====================================================

    const handleAddMember = async (user) => {

        try {

            setMemberError("");

            setMemberSuccess("");

            await addGroupMember(
                id,
                user.id
            );


            setMemberSuccess(
                `${user.name || "User"} added successfully.`
            );


            await loadMembers();


            setUsers(
                (previousUsers) =>
                    previousUsers.filter(
                        (item) =>
                            Number(item.id) !==
                            Number(user.id)
                    )
            );

        } catch (error) {

            console.error(
                "ADD MEMBER ERROR:",
                error
            );

            setMemberError(
                error?.userMessage ||
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to add member."
            );

        }

    };


    // =====================================================
    // REMOVE MEMBER
    // =====================================================

    const handleRemoveMember =
        async (userId) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to remove this member?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await removeGroupMember(
                    id,
                    userId
                );


                await loadMembers();

            } catch (error) {

                console.error(
                    "REMOVE MEMBER ERROR:",
                    error
                );


                alert(
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Unable to remove member."
                );

            }

        };


    // =====================================================
    // OPEN EXPENSE MODAL
    // =====================================================

    const openExpenseModal = () => {

        setExpenseError("");

        setExpenseSuccess("");


        if (
            !members ||
            members.length === 0
        ) {

            setExpenseError(
                "Please add members to this group before creating an expense."
            );

        }


        /*
         * Default payer = first group member.
         *
         * User can change this using the
         * Paid By dropdown.
         */

        setExpenseForm({

            name: "",

            amount: "",

            category: "Food",

            paidByUserId:
                members.length > 0
                    ? String(members[0].id)
                    : ""

        });


        setShowExpenseModal(true);

    };


    // =====================================================
    // CLOSE EXPENSE MODAL
    // =====================================================

    const closeExpenseModal = () => {

        if (expenseSaving) {
            return;
        }


        setShowExpenseModal(false);

        setExpenseError("");

        setExpenseSuccess("");

    };


    // =====================================================
    // EXPENSE FORM CHANGE
    // =====================================================

    const handleExpenseChange =
        (event) => {

            const {
                name,
                value
            } = event.target;


            setExpenseForm(
                (previous) => ({
                    ...previous,
                    [name]: value
                })
            );

        };


    // =====================================================
    // CREATE EXPENSE
    // =====================================================

    const handleCreateExpense =
        async (event) => {

            event.preventDefault();


            setExpenseError("");

            setExpenseSuccess("");


            // =================================================
            // VALIDATE NAME
            // =================================================

            const expenseName =
                expenseForm.name.trim();


            if (!expenseName) {

                setExpenseError(
                    "Please enter an expense name."
                );

                return;

            }


            // =================================================
            // VALIDATE AMOUNT
            // =================================================

            const amount =
                Number(
                    expenseForm.amount
                );


            if (
                !expenseForm.amount ||
                Number.isNaN(amount) ||
                amount <= 0
            ) {

                setExpenseError(
                    "Please enter a valid amount greater than zero."
                );

                return;

            }


            // =================================================
            // VALIDATE CATEGORY
            // =================================================

            if (!expenseForm.category) {

                setExpenseError(
                    "Please select a category."
                );

                return;

            }


            // =================================================
            // VALIDATE GROUP MEMBERS
            // =================================================

            if (
                !members ||
                members.length === 0
            ) {

                setExpenseError(
                    "Please add members to this group before creating an expense."
                );

                return;

            }


            // =================================================
            // GET ALL GROUP MEMBER IDS
            // =================================================

            /*
             * IMPORTANT:
             *
             * The expense is automatically split among
             * ALL members of this group.
             *
             * Therefore we send all member IDs to backend.
             *
             * User does NOT have to manually select
             * each member.
             */

            const groupMemberIds =
                members
                    .map(
                        (member) =>
                            Number(member.id)
                    )
                    .filter(
                        (memberId) =>
                            Number.isFinite(memberId)
                    );


            if (
                groupMemberIds.length === 0
            ) {

                setExpenseError(
                    "At least one group member must be selected."
                );

                return;

            }


            // =================================================
            // VALIDATE PAYER
            // =================================================

            if (
                !expenseForm.paidByUserId
            ) {

                setExpenseError(
                    "Please select who paid for this expense."
                );

                return;

            }


            const payerId =
                Number(
                    expenseForm.paidByUserId
                );


            const payerIsMember =
                groupMemberIds.includes(
                    payerId
                );


            if (!payerIsMember) {

                setExpenseError(
                    "The selected payer must be a member of this group."
                );

                return;

            }


            // =================================================
            // CREATE EXPENSE
            // =================================================

            try {

                setExpenseSaving(true);


                /*
                 * IMPORTANT:
                 *
                 * No split preview is calculated here.
                 *
                 * The Add Expense page only stores:
                 *
                 * - name
                 * - amount
                 * - category
                 * - group
                 * - all participating members
                 * - payer
                 *
                 * The dashboard/settlement area can calculate
                 * the individual shares later.
                 */


              const expenseData = {
    name: expenseName,
    amount: Number(amount.toFixed(2)),
    category: expenseForm.category,
    groupId: Number(id),
    paidByUserId: payerId,

    // IMPORTANT:
    // Backend expects participantIds, NOT memberIds
    participantIds: groupMemberIds
};


                console.log(
                    "================================="
                );

                console.log(
                    "CREATING GROUP EXPENSE"
                );

                console.log(
                    "GROUP ID:",
                    Number(id)
                );

                console.log(
                    "EXPENSE NAME:",
                    expenseName
                );

                console.log(
                    "AMOUNT:",
                    amount
                );

                console.log(
                    "CATEGORY:",
                    expenseForm.category
                );

                console.log(
                    "GROUP MEMBER IDS:",
                    groupMemberIds
                );

                console.log(
                    "PAYER ID:",
                    payerId
                );

                console.log(
                    "FINAL EXPENSE DATA:",
                    expenseData
                );

                console.log(
                    "================================="
                );


                // =================================================
                // POST EXPENSE
                // =================================================

                const savedExpense =
                    await createExpense(
                        expenseData
                    );


                console.log(
                    "EXPENSE CREATED:",
                    savedExpense
                );


                // =================================================
                // UPDATE EXPENSE LIST
                // =================================================

                if (savedExpense) {

                    setExpenses(
                        (previous) => [
                            ...previous,
                            savedExpense
                        ]
                    );

                }


                // =================================================
                // SUCCESS
                // =================================================

                setExpenseSuccess(
                    "Expense added successfully."
                );


                // =================================================
                // REFRESH
                // =================================================

                try {

                    await loadExpenses();

                } catch (refreshError) {

                    console.warn(
                        "Expense created, but refresh failed:",
                        refreshError
                    );

                }


                // =================================================
                // RESET + CLOSE
                // =================================================

                setTimeout(() => {

                    setShowExpenseModal(
                        false
                    );


                    setExpenseForm({

                        name: "",

                        amount: "",

                        category: "Food",

                        paidByUserId:
                            members.length > 0
                                ? String(
                                    members[0].id
                                )
                                : ""

                    });


                    setExpenseError("");

                    setExpenseSuccess("");

                }, 700);


            } catch (error) {

                console.error(
                    "CREATE EXPENSE ERROR:",
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
                    "Unable to add expense.";


                setExpenseError(
                    message
                );

            } finally {

                setExpenseSaving(
                    false
                );

            }

        };



    // =====================================================
    // OPEN EDIT EXPENSE MODAL
    // =====================================================

    const openEditExpenseModal = (expense) => {

        if (!expense) {
            return;
        }

        setEditExpenseError("");
        setEditExpenseSuccess("");

        setEditExpenseForm({
            id: expense.id,
            name: expense.name || "",
            amount:
                expense.amount !== undefined &&
                expense.amount !== null
                    ? String(expense.amount)
                    : "",
            category: expense.category || "Food",
            paidByUserId:
                expense.paidByUserId !== undefined &&
                expense.paidByUserId !== null
                    ? String(expense.paidByUserId)
                    : (
                        expense.paidBy?.id !== undefined &&
                        expense.paidBy?.id !== null
                            ? String(expense.paidBy.id)
                            : ""
                    )
        });

        setShowEditExpenseModal(true);
    };


    // =====================================================
    // CLOSE EDIT EXPENSE MODAL
    // =====================================================

    const closeEditExpenseModal = () => {

        if (editExpenseSaving) {
            return;
        }

        setShowEditExpenseModal(false);
        setEditExpenseError("");
        setEditExpenseSuccess("");
    };


    // =====================================================
    // EDIT EXPENSE FORM CHANGE
    // =====================================================

    const handleEditExpenseChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setEditExpenseForm(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );

        setEditExpenseError("");
    };


    // =====================================================
    // UPDATE EXPENSE - PUT
    // =====================================================

    const handleUpdateExpense = async (event) => {

        event.preventDefault();

        setEditExpenseError("");
        setEditExpenseSuccess("");

        const expenseName =
            editExpenseForm.name.trim();

        const amount =
            Number(editExpenseForm.amount);

        if (!expenseName) {
            setEditExpenseError(
                "Please enter an expense name."
            );
            return;
        }

        if (
            !editExpenseForm.amount ||
            Number.isNaN(amount) ||
            amount <= 0
        ) {
            setEditExpenseError(
                "Please enter a valid amount greater than zero."
            );
            return;
        }

        if (!editExpenseForm.category) {
            setEditExpenseError(
                "Please select a category."
            );
            return;
        }

        if (
            !members ||
            members.length === 0
        ) {
            setEditExpenseError(
                "This group has no members."
            );
            return;
        }

        if (!editExpenseForm.paidByUserId) {
            setEditExpenseError(
                "Please select who paid for this expense."
            );
            return;
        }

        const groupMemberIds =
            members
                .map(
                    (member) =>
                        Number(member.id)
                )
                .filter(
                    (memberId) =>
                        Number.isFinite(memberId)
                );

        const payerId =
            Number(
                editExpenseForm.paidByUserId
            );

        if (!groupMemberIds.includes(payerId)) {
            setEditExpenseError(
                "The selected payer must be a member of this group."
            );
            return;
        }

        if (!editExpenseForm.id) {
            setEditExpenseError(
                "Expense ID is missing."
            );
            return;
        }

        try {

            setEditExpenseSaving(true);

            const expenseData = {
                name: expenseName,
                amount: Number(
                    amount.toFixed(2)
                ),
                category:
                    editExpenseForm.category,
                groupId: Number(id),
                paidByUserId: payerId,
                participantIds: groupMemberIds
            };

            console.log(
                "UPDATING EXPENSE:",
                editExpenseForm.id,
                expenseData
            );

            const updatedExpense =
                await updateExpense(
                    editExpenseForm.id,
                    expenseData
                );

            setExpenses(
                (previousExpenses) =>
                    previousExpenses.map(
                        (expense) =>
                            Number(expense.id) ===
                            Number(editExpenseForm.id)
                                ? (
                                    updatedExpense ||
                                    {
                                        ...expense,
                                        ...expenseData,
                                        id: expense.id
                                    }
                                )
                                : expense
                    )
            );

            setEditExpenseSuccess(
                "Expense updated successfully."
            );

            try {
                await loadExpenses();
            } catch (refreshError) {
                console.warn(
                    "Expense updated, but refresh failed:",
                    refreshError
                );
            }

            setTimeout(() => {
                setShowEditExpenseModal(false);
                setEditExpenseError("");
                setEditExpenseSuccess("");
            }, 700);

        } catch (error) {

            console.error(
                "UPDATE EXPENSE ERROR:",
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
                error?.message ||
                "Unable to update expense.";

            setEditExpenseError(message);

        } finally {

            setEditExpenseSaving(false);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="group-details-page">

                <div className="group-details-loading">

                    Loading group...

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        pageError ||
        !group
    ) {

        return (

            <div className="group-details-page">

                <button
                    type="button"
                    className="back-button"
                    onClick={() =>
                        navigate("/groups")
                    }
                >

                    <ArrowLeft size={17} />

                    Back to Groups

                </button>


                <div className="group-details-error">

                    <h2>
                        Group not found
                    </h2>


                    <p>

                        {pageError ||
                            "The requested group does not exist."}

                    </p>


                    <button
                        type="button"
                        className="page-primary-button"
                        onClick={() =>
                            navigate("/groups")
                        }
                    >

                        Go to Groups

                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // GROUP DATA
    // =====================================================

    const groupName =
        group.groupName ||
        group.name ||
        "Untitled Group";


    const description =
        group.description ||
        "No description available.";


    // =====================================================
    // RENDER
    // =====================================================
    // =====================================================
// DELETE EXPENSE
// =====================================================

const handleDeleteExpense = async (expenseId) => {

    if (!expenseId) {
        return;
    }

    const confirmed = window.confirm(
        "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
        return;
    }

    try {

        setExpensesLoading(true);

        console.log(
            "Deleting expense:",
            expenseId
        );

        await deleteExpense(expenseId);

        // Remove expense immediately from UI
        setExpenses((previousExpenses) =>
            previousExpenses.filter(
                (expense) =>
                    Number(expense.id) !==
                    Number(expenseId)
            )
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

        alert(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            (
                typeof error?.response?.data === "string"
                    ? error.response.data
                    : null
            ) ||
            "Unable to delete expense."
        );

    } finally {

        setExpensesLoading(false);

    }
};
    return (

        <div className="group-details-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="group-details-header">

                <button
                    type="button"
                    className="back-button"
                    onClick={() =>
                        navigate("/groups")
                    }
                >

                    <ArrowLeft size={17} />

                    Back to Groups

                </button>


                <p className="page-eyebrow">

                    GROUP MANAGEMENT

                </p>


                <div className="group-details-title-row">

                    <div>

                        <h1>
                            {groupName}
                        </h1>

                        <p className="group-details-subtitle">
                            {description}
                        </p>

                    </div>

                    <button
                        type="button"
                        className="edit-group-button"
                        onClick={openEditGroupModal}
                    >
                        <Pencil size={16} />
                        Edit Group
                    </button>

                </div>

            </div>


            {/* =================================================
                TWO COLUMN LAYOUT
            ================================================= */}

            <div className="group-details-grid">


                {/* =================================================
                    MEMBERS
                ================================================= */}

                <section className="group-details-card">


                    <div className="group-details-card-header">


                        <div className="group-details-card-title">


                            <div className="details-icon purple">

                                <Users size={20} />

                            </div>


                            <div>

                                <h2>
                                    Members
                                </h2>

                                <p>
                                    People in this group
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            className="small-primary-button"
                            onClick={
                                openMemberModal
                            }
                        >

                            <Plus size={16} />

                            Add Member

                        </button>

                    </div>


                    <div className="group-details-card-content">


                        {membersLoading ? (

                            <div className="details-loading">

                                Loading members...

                            </div>

                        ) : members.length === 0 ? (

                            <div className="details-empty">


                                <div className="details-empty-icon">

                                    <Users size={32} />

                                </div>


                                <h3>
                                    No members yet
                                </h3>


                                <p>
                                    Add members to start
                                    splitting expenses.
                                </p>

                            </div>

                        ) : (

                            <div className="members-list">

                                {members.map(
                                    (member) => (

                                        <div
                                            className="member-item"
                                            key={member.id}
                                        >


                                            <div className="member-avatar">

                                                {(member.name ||
                                                    "U")
                                                    .charAt(0)
                                                    .toUpperCase()}

                                            </div>


                                            <div className="member-info">

                                                <strong>

                                                    {member.name ||
                                                        "Unknown User"}

                                                </strong>


                                                <span>

                                                    {member.email ||
                                                        "Member"}

                                                </span>

                                            </div>


                                            <button
                                                type="button"
                                                className="member-remove-button"
                                                onClick={() =>
                                                    handleRemoveMember(
                                                        member.id
                                                    )
                                                }
                                                title="Remove member"
                                            >

                                                <Trash2 size={16} />

                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </section>


                {/* =================================================
                    EXPENSES
                ================================================= */}

                <section className="group-details-card">


                    <div className="group-details-card-header">


                        <div className="group-details-card-title">


                            <div className="details-icon blue">

                                <Receipt size={20} />

                            </div>


                            <div>

                                <h2>
                                    Expenses
                                </h2>

                                <p>
                                    Shared expenses in this group
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            className="small-primary-button"
                            onClick={
                                openExpenseModal
                            }
                        >

                            <Plus size={16} />

                            Add Expense

                        </button>

                    </div>


                    <div className="group-details-card-content">


                        {expensesLoading ? (

                            <div className="details-loading">

                                Loading expenses...

                            </div>

                        ) : expenses.length === 0 ? (

                            <div className="details-empty">


                                <div className="details-empty-icon blue">

                                    <Receipt size={32} />

                                </div>


                                <h3>
                                    No expenses yet
                                </h3>


                                <p>
                                    Add the first expense
                                    for this group.
                                </p>

                            </div>

                        ) : (
<div className="expenses-list">

    {expenses.map((expense) => (

        <div
            className="expense-item"
            key={expense.id}
        >

            {/* =================================================
                EXPENSE ICON
            ================================================= */}

            <div className="expense-icon">

                <IndianRupee size={18} />

            </div>


            {/* =================================================
                EXPENSE INFORMATION
            ================================================= */}

            <div className="expense-info">

                <strong>
                    {expense.name ||
                        "Unnamed Expense"}
                </strong>

                <span>
                    {expense.category ||
                        "Other"}
                </span>

            </div>


            {/* =================================================
                AMOUNT
            ================================================= */}

            <div className="expense-amount">

                ₹
                {Number(
                    expense.amount || 0
                ).toFixed(2)}

            </div>


            {/* =================================================
                EDIT BUTTON
            ================================================= */}

            <button
                type="button"
                className="expense-edit-button"
                onClick={() =>
                    openEditExpenseModal(
                        expense
                    )
                }
                title="Edit expense"
                aria-label={
                    `Edit ${
                        expense.name ||
                        "expense"
                    }`
                }
            >

                <Pencil size={16} />

            </button>


            {/* =================================================
                DELETE BUTTON
            ================================================= */}

            <button
                type="button"
                className="expense-delete-button"
                onClick={() =>
                    handleDeleteExpense(
                        expense.id
                    )
                }
                title="Delete expense"
                aria-label={
                    `Delete ${
                        expense.name ||
                        "expense"
                    }`
                }
            >

                <Trash2 size={17} />

            </button>

        </div>

    ))}

</div>

                        )}

                    </div>

                </section>

            </div>



            {/* =====================================================
                EDIT GROUP MODAL
            ===================================================== */}

            {showEditGroupModal && (

                <div
                    className="modal-overlay"
                    onMouseDown={closeEditGroupModal}
                >

                    <div
                        className="app-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="app-modal-header">

                            <div>

                                <h2>
                                    Edit Group
                                </h2>

                                <p>
                                    Update your group details.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={closeEditGroupModal}
                                disabled={editGroupSaving}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form onSubmit={handleUpdateGroup}>

                            <div className="app-modal-body">

                                {editGroupError && (
                                    <div className="modal-error">
                                        {editGroupError}
                                    </div>
                                )}

                                {editGroupSuccess && (
                                    <div className="modal-success">
                                        {editGroupSuccess}
                                    </div>
                                )}

                                <div className="expense-form-field">

                                    <label htmlFor="editGroupName">
                                        Group Name
                                    </label>

                                    <input
                                        id="editGroupName"
                                        type="text"
                                        name="name"
                                        value={editGroupForm.name}
                                        onChange={handleEditGroupChange}
                                        placeholder="Enter group name"
                                        maxLength={100}
                                        required
                                        disabled={editGroupSaving}
                                    />

                                </div>

                                <div className="expense-form-field">

                                    <label htmlFor="editGroupDescription">
                                        Description
                                    </label>

                                    <textarea
                                        id="editGroupDescription"
                                        name="description"
                                        value={editGroupForm.description}
                                        onChange={handleEditGroupChange}
                                        placeholder="Enter group description"
                                        rows={4}
                                        maxLength={255}
                                        disabled={editGroupSaving}
                                    />

                                </div>

                            </div>

                            <div className="app-modal-footer">

                                <button
                                    type="button"
                                    className="modal-cancel-button"
                                    onClick={closeEditGroupModal}
                                    disabled={editGroupSaving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="modal-submit-button"
                                    disabled={editGroupSaving}
                                >
                                    {editGroupSaving
                                        ? "Saving..."
                                        : "Save Changes"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* =====================================================
                ADD MEMBER MODAL
            ===================================================== */}

            {showMemberModal && (

                <div
                    className="modal-overlay"
                    onMouseDown={
                        closeMemberModal
                    }
                >


                    <div
                        className="app-modal member-modal"
                        onMouseDown={
                            (event) =>
                                event.stopPropagation()
                        }
                    >


                        {/* HEADER */}

                        <div className="app-modal-header">


                            <div>

                                <h2>
                                    Add Member
                                </h2>


                                <p>
                                    Search for a user and
                                    add them to this group.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={
                                    closeMemberModal
                                }
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* BODY */}

                        <div className="app-modal-body">


                            {memberError && (

                                <div className="modal-error">

                                    {memberError}

                                </div>

                            )}


                            {memberSuccess && (

                                <div className="modal-success">

                                    {memberSuccess}

                                </div>

                            )}


                            <div className="search-box">

                                <Search size={18} />


                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={memberSearch}
                                    onChange={
                                        (event) =>
                                            setMemberSearch(
                                                event.target.value
                                            )
                                    }
                                    autoFocus
                                />

                            </div>


                            <div className="user-search-results">


                                {searchLoading ? (

                                    <div className="search-message">

                                        Searching users...

                                    </div>

                                ) : memberSearch.trim() === "" ? (

                                    <div className="search-message">

                                        Start typing to search users.

                                    </div>

                                ) : users.length === 0 ? (

                                    <div className="search-message">

                                        No users found.

                                    </div>

                                ) : (

                                    users.map(
                                        (user) => (

                                            <div
                                                className="user-search-item"
                                                key={user.id}
                                            >


                                                <div className="member-avatar">

                                                    {(user.name ||
                                                        "U")
                                                        .charAt(0)
                                                        .toUpperCase()}

                                                </div>


                                                <div className="member-info">

                                                    <strong>

                                                        {user.name ||
                                                            "Unknown User"}

                                                    </strong>


                                                    <span>

                                                        {user.email ||
                                                            ""}

                                                    </span>

                                                </div>


                                                <button
                                                    type="button"
                                                    className="add-user-button"
                                                    onClick={() =>
                                                        handleAddMember(
                                                            user
                                                        )
                                                    }
                                                >

                                                    <UserPlus size={16} />

                                                    Add

                                                </button>

                                            </div>

                                        )
                                    )

                                )}

                            </div>

                        </div>


                        {/* FOOTER */}

                        <div className="app-modal-footer">


                            <button
                                type="button"
                                className="modal-cancel-button"
                                onClick={
                                    closeMemberModal
                                }
                            >

                                Cancel

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                ADD EXPENSE MODAL
            ===================================================== */}

            {showExpenseModal && (

                <div
                    className="modal-overlay"
                    onMouseDown={
                        closeExpenseModal
                    }
                >


                    <div
                        className="app-modal expense-modal"
                        onMouseDown={
                            (event) =>
                                event.stopPropagation()
                        }
                    >


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="app-modal-header">


                            <div>

                                <h2>
                                    Add Expense
                                </h2>


                                <p>

                                    Add a shared expense to{" "}

                                    <strong>
                                        {groupName}
                                    </strong>

                                    .

                                </p>

                            </div>


                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={
                                    closeExpenseModal
                                }
                                disabled={
                                    expenseSaving
                                }
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form
                            onSubmit={
                                handleCreateExpense
                            }
                        >


                            <div className="app-modal-body">


                                {/* =================================================
                                    ERROR
                                ================================================= */}

                                {expenseError && (

                                    <div className="modal-error">

                                        {expenseError}

                                    </div>

                                )}


                                {/* =================================================
                                    SUCCESS
                                ================================================= */}

                                {expenseSuccess && (

                                    <div className="modal-success">

                                        {expenseSuccess}

                                    </div>

                                )}


                                {/* =================================================
                                    EXPENSE NAME
                                ================================================= */}

                                <div className="expense-form-field">


                                    <label htmlFor="expenseName">

                                        Expense Name

                                    </label>


                                    <input
                                        id="expenseName"
                                        type="text"
                                        name="name"
                                        value={
                                            expenseForm.name
                                        }
                                        onChange={
                                            handleExpenseChange
                                        }
                                        placeholder="Example: Dinner"
                                        required
                                        disabled={
                                            expenseSaving
                                        }
                                    />

                                </div>


                                {/* =================================================
                                    AMOUNT
                                ================================================= */}

                                <div className="expense-form-field">


                                    <label htmlFor="expenseAmount">

                                        Amount

                                    </label>


                                    <div className="amount-input">


                                        <span>
                                            ₹
                                        </span>


                                        <input
                                            id="expenseAmount"
                                            type="number"
                                            name="amount"
                                            value={
                                                expenseForm.amount
                                            }
                                            onChange={
                                                handleExpenseChange
                                            }
                                            placeholder="0.00"
                                            min="0.01"
                                            step="0.01"
                                            inputMode="decimal"
                                            required
                                            disabled={
                                                expenseSaving
                                            }
                                        />

                                    </div>

                                </div>


                                {/* =================================================
                                    CATEGORY
                                ================================================= */}

                                <div className="expense-form-field">


                                    <label htmlFor="expenseCategory">

                                        Category

                                    </label>


                                    <select
                                        id="expenseCategory"
                                        name="category"
                                        value={
                                            expenseForm.category
                                        }
                                        onChange={
                                            handleExpenseChange
                                        }
                                        disabled={
                                            expenseSaving
                                        }
                                    >


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


                                        <option value="Other">
                                            Other
                                        </option>


                                    </select>

                                </div>


                                {/* =================================================
                                    PAID BY
                                ================================================= */}

                                <div className="expense-form-field">


                                    <label
                                        htmlFor="paidByUserId"
                                    >
                                        Paid By
                                    </label>


                                    {members.length > 0 ? (

                                        <select
                                            id="paidByUserId"
                                            name="paidByUserId"
                                            value={
                                                expenseForm.paidByUserId
                                            }
                                            onChange={
                                                handleExpenseChange
                                            }
                                            required
                                            disabled={
                                                expenseSaving
                                            }
                                        >


                                            <option value="">

                                                Select member

                                            </option>


                                            {members.map(
                                                (member) => (

                                                    <option
                                                        key={
                                                            member.id
                                                        }
                                                        value={
                                                            member.id
                                                        }
                                                    >

                                                        {member.name ||
                                                            "Unknown User"}

                                                    </option>

                                                )
                                            )}


                                        </select>

                                    ) : (

                                        <div className="no-members-warning">

                                            Please add members to this
                                            group first.

                                        </div>

                                    )}


                                    <small className="expense-field-help">

                                        Select the group member who
                                        paid this expense.

                                    </small>

                                </div>


                                {/* =================================================
                                    NO SPLIT PREVIEW
                                ================================================= */}

                                {/*
                                    IMPORTANT:

                                    There is intentionally NO
                                    split preview here.

                                    Example:

                                    Expense = ₹500
                                    Group = Natpu
                                    Members = 4
                                    Paid By = Lanisha

                                    This page only records the expense.

                                    The dashboard / settlement section
                                    should later show:

                                    Each member share = ₹125
                                    Lanisha paid ₹500
                                    Lanisha receives ₹375
                                    Other members owe ₹125 each.
                                */}


                            </div>


                            {/* =================================================
                                FOOTER
                            ================================================= */}

                            <div className="app-modal-footer">


                                <button
                                    type="button"
                                    className="modal-cancel-button"
                                    onClick={
                                        closeExpenseModal
                                    }
                                    disabled={
                                        expenseSaving
                                    }
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="modal-submit-button"
                                    disabled={
                                        expenseSaving ||
                                        members.length === 0 ||
                                        !expenseForm.paidByUserId
                                    }
                                >

                                    {expenseSaving
                                        ? "Adding..."
                                        : "Add Expense"}

                                </button>


                            </div>


                        </form>

                    </div>

                </div>

            )}


            {/* =====================================================
                EDIT EXPENSE MODAL
            ===================================================== */}

            {showEditExpenseModal && (

                <div
                    className="modal-overlay"
                    onMouseDown={closeEditExpenseModal}
                >

                    <div
                        className="app-modal expense-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="app-modal-header">

                            <div>

                                <h2>
                                    Edit Expense
                                </h2>

                                <p>
                                    Update the expense details for{" "}
                                    <strong>
                                        {groupName}
                                    </strong>.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={closeEditExpenseModal}
                                disabled={editExpenseSaving}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <form onSubmit={handleUpdateExpense}>

                            <div className="app-modal-body">

                                {editExpenseError && (
                                    <div className="modal-error">
                                        {editExpenseError}
                                    </div>
                                )}

                                {editExpenseSuccess && (
                                    <div className="modal-success">
                                        {editExpenseSuccess}
                                    </div>
                                )}


                                <div className="expense-form-field">

                                    <label htmlFor="editExpenseName">
                                        Expense Name
                                    </label>

                                    <input
                                        id="editExpenseName"
                                        type="text"
                                        name="name"
                                        value={editExpenseForm.name}
                                        onChange={handleEditExpenseChange}
                                        placeholder="Example: Dinner"
                                        required
                                        disabled={editExpenseSaving}
                                    />

                                </div>


                                <div className="expense-form-field">

                                    <label htmlFor="editExpenseAmount">
                                        Amount
                                    </label>

                                    <div className="amount-input">

                                        <span>₹</span>

                                        <input
                                            id="editExpenseAmount"
                                            type="number"
                                            name="amount"
                                            value={editExpenseForm.amount}
                                            onChange={handleEditExpenseChange}
                                            placeholder="0.00"
                                            min="0.01"
                                            step="0.01"
                                            inputMode="decimal"
                                            required
                                            disabled={editExpenseSaving}
                                        />

                                    </div>

                                </div>


                                <div className="expense-form-field">

                                    <label htmlFor="editExpenseCategory">
                                        Category
                                    </label>

                                    <select
                                        id="editExpenseCategory"
                                        name="category"
                                        value={editExpenseForm.category}
                                        onChange={handleEditExpenseChange}
                                        disabled={editExpenseSaving}
                                    >

                                        <option value="Food">Food</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Entertainment">
                                            Entertainment
                                        </option>
                                        <option value="Bills">Bills</option>
                                        <option value="Other">Other</option>

                                    </select>

                                </div>


                                <div className="expense-form-field">

                                    <label htmlFor="editPaidByUserId">
                                        Paid By
                                    </label>

                                    {members.length > 0 ? (

                                        <select
                                            id="editPaidByUserId"
                                            name="paidByUserId"
                                            value={editExpenseForm.paidByUserId}
                                            onChange={handleEditExpenseChange}
                                            required
                                            disabled={editExpenseSaving}
                                        >

                                            <option value="">
                                                Select member
                                            </option>

                                            {members.map((member) => (
                                                <option
                                                    key={member.id}
                                                    value={member.id}
                                                >
                                                    {member.name ||
                                                        "Unknown User"}
                                                </option>
                                            ))}

                                        </select>

                                    ) : (

                                        <div className="no-members-warning">
                                            Please add members to this group first.
                                        </div>

                                    )}

                                    <small className="expense-field-help">
                                        Select the group member who paid this expense.
                                    </small>

                                </div>

                            </div>


                            <div className="app-modal-footer">

                                <button
                                    type="button"
                                    className="modal-cancel-button"
                                    onClick={closeEditExpenseModal}
                                    disabled={editExpenseSaving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="modal-submit-button"
                                    disabled={
                                        editExpenseSaving ||
                                        members.length === 0 ||
                                        !editExpenseForm.paidByUserId
                                    }
                                >
                                    {editExpenseSaving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}


export default GroupDetails;
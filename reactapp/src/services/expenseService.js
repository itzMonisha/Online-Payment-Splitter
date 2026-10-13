import api from "./api";


// =====================================================
// CREATE EXPENSE
// =====================================================

export const createExpense = async (
    expense
) => {

    const response = await api.post(
        "/expenses",
        expense
    );

    return response.data;
};


// =====================================================
// GET ALL EXPENSES
// ADMIN
// =====================================================

export const getAllExpenses = async () => {

    const response = await api.get(
        "/expenses"
    );

    return response.data;
};


// =====================================================
// GET EXPENSE BY ID
// =====================================================

export const getExpenseById = async (
    id
) => {

    const response = await api.get(
        `/expenses/${id}`
    );

    return response.data;
};


// =====================================================
// GET EXPENSES BY USER
// USER
// =====================================================

export const getExpensesByUser = async (
    userId
) => {

    if (!userId) {
        throw new Error(
            "User ID is required."
        );
    }

    const response = await api.get(
        `/expenses/user/${userId}`
    );

    return response.data;
};


// =====================================================
// GET EXPENSES BY GROUP
// =====================================================

export const getExpensesByGroup = async (
    groupId
) => {

    const response = await api.get(
        `/expenses/group/${groupId}`
    );

    return response.data;
};


// =====================================================
// GET EXPENSES BY CATEGORY
// =====================================================

export const getExpensesByCategory = async (
    category
) => {

    const response = await api.get(
        `/expenses/category/${encodeURIComponent(
            category
        )}`
    );

    return response.data;
};


// =====================================================
// GET EXPENSE DETAILS FOR USER
// =====================================================

export const getExpenseDetailsForUser = async (
    expenseId,
    userId
) => {

    const response = await api.get(
        `/expenses/${expenseId}/user/${userId}`
    );

    return response.data;
};


// =====================================================
// UPDATE EXPENSE
// =====================================================

export const updateExpense = async (
    id,
    expense
) => {

    const response = await api.put(
        `/expenses/${id}`,
        expense
    );

    return response.data;
};


// =====================================================
// DELETE EXPENSE
// =====================================================

export const deleteExpense = async (
    id
) => {

    const response = await api.delete(
        `/expenses/${id}`
    );

    return response.data;
};


export default api;
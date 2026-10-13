import api from "./api";


// =====================================================
// SETTLEMENT SERVICE
// =====================================================
//
// ADMIN:
//     getSettlements()
//     -> GET /api/settlements
//     -> ALL settlement records
//
// USER:
//     getSettlementsByUser(userId)
//     -> GET /api/settlements/user/{userId}
//     -> ONLY that user's settlement records
//
// =====================================================


// =====================================================
// ADMIN - GET ALL SETTLEMENTS
// =====================================================

export const getSettlements = async () => {

    const response = await api.get(
        "/settlements"
    );

    return response.data;
};


// =====================================================
// USER - GET PERSONAL SETTLEMENTS
// =====================================================

export const getSettlementsByUser = async (
    userId
) => {

    if (!userId) {

        throw new Error(
            "User ID is required."
        );
    }

    const response = await api.get(
        `/settlements/user/${userId}`
    );

    return response.data;
};


// =====================================================
// GET SETTLEMENT BY ID
// =====================================================

export const getSettlementById = async (
    id
) => {

    if (!id) {

        throw new Error(
            "Settlement ID is required."
        );
    }

    const response = await api.get(
        `/settlements/${id}`
    );

    return response.data;
};


// =====================================================
// MARK SETTLEMENT AS PAID
// =====================================================

export const markSettlementPaid = async (
    id
) => {

    if (!id) {

        throw new Error(
            "Settlement ID is required."
        );
    }

    const response = await api.put(
        `/settlements/${id}/pay`
    );

    return response.data;
};


// =====================================================
// DELETE SETTLEMENT
// =====================================================

export const deleteSettlement = async (
    id
) => {

    if (!id) {

        throw new Error(
            "Settlement ID is required."
        );
    }

    const response = await api.delete(
        `/settlements/${id}`
    );

    return response.data;
};


// =====================================================
// EXPORT API INSTANCE
// =====================================================

export default api;
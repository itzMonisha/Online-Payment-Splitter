import api from "./api";

/*
=========================================================
  GROUP SERVICE
=========================================================

  ADMIN:
      getGroups()
      -> returns ALL groups

  USER:
      getGroupsByUser(userId)
      -> returns only groups belonging to that user

=========================================================
*/


// =====================================================
// GET ALL GROUPS
// ADMIN ONLY
// =====================================================

export const getGroups = async () => {

    try {

        const response = await api.get(
            "/user_groups"
        );

        return response.data;

    } catch (error) {

        console.error(
            "GET ALL GROUPS ERROR:",
            error
        );

        throw error;
    }
};


// =====================================================
// GET GROUPS BY USER
// USER ONLY
// =====================================================

export const getGroupsByUser = async (
    userId
) => {

    if (!userId) {
        throw new Error(
            "User ID is required."
        );
    }

    try {

        const response = await api.get(
            `/user_groups/user/${userId}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "GET USER GROUPS ERROR:",
            error
        );

        throw error;
    }
};


// =====================================================
// GET GROUP BY ID
// =====================================================

export const getGroupById = async (
    id
) => {

    if (!id) {
        throw new Error(
            "Group ID is required."
        );
    }

    try {

        const response = await api.get(
            `/user_groups/${id}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "GET GROUP BY ID ERROR:",
            error
        );

        throw error;
    }
};


// =====================================================
// CREATE GROUP
// =====================================================

export const createGroup = async (
    group
) => {

    try {

        const response = await api.post(
            "/user_groups",
            group
        );

        return response.data;

    } catch (error) {

        console.error(
            "CREATE GROUP ERROR:",
            error
        );

        throw error;
    }
};


// =====================================================
// UPDATE GROUP
// =====================================================
// EDIT GROUP NAME / DESCRIPTION
// PUT /user_groups/{id}
// =====================================================

export const updateGroup = async (
    id,
    group
) => {

    if (!id) {
        throw new Error(
            "Group ID is required."
        );
    }

    if (!group) {
        throw new Error(
            "Group data is required."
        );
    }

    try {

        const response = await api.put(
            `/user_groups/${id}`,
            group
        );

        return response.data;

    } catch (error) {

        console.error(
            "UPDATE GROUP ERROR:",
            error
        );

        throw error;
    }
};


// =====================================================
// DELETE GROUP
// =====================================================

export const deleteGroup = async (
    id
) => {

    if (!id) {
        throw new Error(
            "Group ID is required."
        );
    }

    try {

        const response = await api.delete(
            `/user_groups/${id}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "DELETE GROUP ERROR:",
            error
        );

        throw error;
    }
};


// =====================================================
// GET GROUP MEMBERS
// =====================================================

export const getGroupMembers = async (
    groupId
) => {

    if (!groupId) {
        throw new Error(
            "Group ID is required."
        );
    }

    try {

        const response = await api.get(
            `/user_groups/${groupId}/members`
        );

        return response.data;

    } catch (error) {

        console.error(
            "GET GROUP MEMBERS ERROR:",
            error
        );

        throw error;
    }
};


// =====================================================
// ADD MEMBER
// =====================================================

export const addGroupMember = async (
    groupId,
    userId
) => {

    if (!groupId || !userId) {
        throw new Error(
            "Group ID and User ID are required."
        );
    }

    try {

        const response = await api.post(
            `/user_groups/${groupId}/members/${userId}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "ADD GROUP MEMBER ERROR:",
            error
        );

        throw error;
    }
};


// =====================================================
// REMOVE MEMBER
// =====================================================

export const removeGroupMember = async (
    groupId,
    userId
) => {

    if (!groupId || !userId) {
        throw new Error(
            "Group ID and User ID are required."
        );
    }

    try {

        const response = await api.delete(
            `/user_groups/${groupId}/members/${userId}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "REMOVE GROUP MEMBER ERROR:",
            error
        );

        throw error;
    }
};


// =====================================================
// SEARCH USERS
// =====================================================

export const searchUsers = async (
    keyword
) => {

    if (!keyword || !keyword.trim()) {
        return [];
    }

    try {

        const response = await api.get(
            `/users/search?keyword=${encodeURIComponent(
                keyword.trim()
            )}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "SEARCH USERS ERROR:",
            error
        );

        throw error;
    }
};


export default api;
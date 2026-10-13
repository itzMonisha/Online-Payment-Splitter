import api from "./api";

/*
 * =========================================================
 * NOTIFICATION SERVICE
 * =========================================================
 *
 * Backend:
 * /api/notifications
 */


/*
 * =========================================================
 * GET ALL NOTIFICATIONS
 *
 * GET /api/notifications
 *
 * Used by AdminDashboard
 * =========================================================
 */

export const getNotifications = async () => {

    const response =
        await api.get(
            "/notifications"
        );

    return Array.isArray(response.data)
        ? response.data
        : [];
};


/*
 * =========================================================
 * GET NOTIFICATIONS BY USER
 *
 * GET /api/notifications/user/{userId}
 * =========================================================
 */

export const getNotificationsByUser =
    async (userId) => {

        if (
            userId === undefined ||
            userId === null ||
            String(userId).trim() === ""
        ) {

            return [];
        }

        const response =
            await api.get(
                `/notifications/user/${encodeURIComponent(
                    userId
                )}`
            );

        return Array.isArray(response.data)
            ? response.data
            : [];
    };


/*
 * =========================================================
 * GET NOTIFICATION BY ID
 *
 * GET /api/notifications/{id}
 * =========================================================
 */

export const getNotificationById =
    async (id) => {

        if (
            id === undefined ||
            id === null ||
            String(id).trim() === ""
        ) {

            throw new Error(
                "Notification ID is required."
            );
        }

        const response =
            await api.get(
                `/notifications/${encodeURIComponent(
                    id
                )}`
            );

        return response.data;
    };


/*
 * =========================================================
 * CREATE NOTIFICATION
 *
 * POST /api/notifications
 * =========================================================
 */

export const createNotification =
    async (notificationData) => {

        if (
            !notificationData ||
            typeof notificationData !==
                "object"
        ) {

            throw new Error(
                "Notification data is required."
            );
        }

        const response =
            await api.post(
                "/notifications",
                notificationData
            );

        return response.data;
    };


/*
 * =========================================================
 * MARK AS READ
 *
 * PUT /api/notifications/{id}/read
 * =========================================================
 */

export const markNotificationAsRead =
    async (id) => {

        if (
            id === undefined ||
            id === null ||
            String(id).trim() === ""
        ) {

            throw new Error(
                "Notification ID is required."
            );
        }

        const response =
            await api.put(
                `/notifications/${encodeURIComponent(
                    id
                )}/read`
            );

        return response.data;
    };


/*
 * Alias
 */

export const markAsRead =
    markNotificationAsRead;


/*
 * =========================================================
 * DELETE NOTIFICATION
 *
 * DELETE /api/notifications/{id}
 * =========================================================
 */

export const deleteNotification =
    async (id) => {

        if (
            id === undefined ||
            id === null ||
            String(id).trim() === ""
        ) {

            throw new Error(
                "Notification ID is required."
            );
        }

        const response =
            await api.delete(
                `/notifications/${encodeURIComponent(
                    id
                )}`
            );

        return response.data;
    };


/*
 * =========================================================
 * GET UNREAD NOTIFICATIONS
 * =========================================================
 */

export const getUnreadNotifications =
    async () => {

        const notifications =
            await getNotifications();

        return notifications.filter(
            (notification) =>
                notification?.isRead !== true
        );
    };


/*
 * =========================================================
 * GET UNREAD COUNT
 * =========================================================
 */

export const getUnreadNotificationCount =
    async () => {

        const notifications =
            await getNotifications();

        return notifications.filter(
            (notification) =>
                notification?.isRead !== true
        ).length;
    };


/*
 * =========================================================
 * DEFAULT EXPORT
 * =========================================================
*/
// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;
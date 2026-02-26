import { databases, ID, Query } from "./appwriteConfig";

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const NOTIFICATIONS_COLLECTION_ID = import.meta.env.VITE_NOTIFICATIONS_COLLECTION_ID;
const USERS_COLLECTION_ID = import.meta.env.VITE_USERS_COLLECTION_ID;

/**
 * Find MLAs that serve a given district (case-insensitive).
 * Returns an array of MLA user profile documents.
 */
export const findMLAsByDistrict = async (district) => {
    try {
        // Fetch all MLA users
        const res = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal("role", "mla"), Query.limit(100)]
        );

        // Filter case-insensitively by district
        return res.documents.filter(
            (doc) => doc.district?.toLowerCase() === district?.toLowerCase()
        );
    } catch (error) {
        console.error("Error finding MLAs:", error);
        return [];
    }
};

/**
 * Create a notification document for a specific user.
 */
export const createNotification = async ({
    recipientUserId,
    recipientName,
    type,        // "ROAD_REPORT" | "HELP_REQUEST"
    title,
    message,
    reportId,
    district,
    reporterName,
}) => {
    try {
        return await databases.createDocument(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION_ID,
            ID.unique(),
            {
                recipientUserId,
                recipientName,
                type,
                title,
                message,
                reportId,
                district,
                reporterName,
                isRead: false,
                createdAt: new Date().toISOString(),
            }
        );
    } catch (error) {
        console.error("Error creating notification:", error);
        // Don't throw — notifications are non-critical
        return null;
    }
};

/**
 * Notify all MLAs in a district about a new report.
 */
export const notifyMLAsAboutReport = async ({
    district,
    type,         // "ROAD_REPORT" | "HELP_REQUEST"
    title,
    message,
    reportId,
    reporterName,
}) => {
    try {
        const mlas = await findMLAsByDistrict(district);

        if (mlas.length === 0) {
            console.log(`No MLAs found for district: ${district}`);
            return [];
        }

        // Create a notification for each MLA
        const notifications = await Promise.allSettled(
            mlas.map((mla) =>
                createNotification({
                    recipientUserId: mla.userId,
                    recipientName: mla.name,
                    type,
                    title,
                    message,
                    reportId,
                    district,
                    reporterName,
                })
            )
        );

        console.log(`✅ Notified ${mlas.length} MLA(s) in ${district}`);
        return notifications;
    } catch (error) {
        console.error("Error notifying MLAs:", error);
        return [];
    }
};

/**
 * Get notifications for a specific user.
 */
export const getNotifications = async (userId, limit = 50) => {
    try {
        const res = await databases.listDocuments(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION_ID,
            [
                Query.equal("recipientUserId", userId),
                Query.orderDesc("createdAt"),
                Query.limit(limit),
            ]
        );
        return res.documents;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

/**
 * Get unread notification count for a user.
 */
export const getUnreadCount = async (userId) => {
    try {
        const res = await databases.listDocuments(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION_ID,
            [
                Query.equal("recipientUserId", userId),
                Query.equal("isRead", false),
                Query.limit(100),
            ]
        );
        return res.total;
    } catch (error) {
        console.error("Error fetching unread count:", error);
        return 0;
    }
};

/**
 * Mark a single notification as read.
 */
export const markAsRead = async (notificationId) => {
    try {
        return await databases.updateDocument(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION_ID,
            notificationId,
            { isRead: true }
        );
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};

/**
 * Mark all notifications as read for a user.
 */
export const markAllAsRead = async (userId) => {
    try {
        const unread = await databases.listDocuments(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION_ID,
            [
                Query.equal("recipientUserId", userId),
                Query.equal("isRead", false),
                Query.limit(100),
            ]
        );

        await Promise.allSettled(
            unread.documents.map((doc) =>
                databases.updateDocument(
                    DATABASE_ID,
                    NOTIFICATIONS_COLLECTION_ID,
                    doc.$id,
                    { isRead: true }
                )
            )
        );

        return unread.documents.length;
    } catch (error) {
        console.error("Error marking all as read:", error);
        return 0;
    }
};

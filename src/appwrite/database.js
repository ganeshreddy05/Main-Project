import { databases, Query } from "./config";
import { ID } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;

const databaseService = {
    // Generic CRUD operations
    createDocument: async (collectionId, data, documentId = ID.unique(), permissions = []) => {
        try {
            return await databases.createDocument(
                DATABASE_ID,
                collectionId,
                documentId,
                data,
                permissions
            );
        } catch (error) {
            console.error("Create document error:", error);
            throw error;
        }
    },

    getDocument: async (collectionId, documentId) => {
        try {
            return await databases.getDocument(DATABASE_ID, collectionId, documentId);
        } catch (error) {
            console.error("Get document error:", error);
            throw error;
        }
    },

    listDocuments: async (collectionId, queries = []) => {
        try {
            return await databases.listDocuments(DATABASE_ID, collectionId, queries);
        } catch (error) {
            console.error("List documents error:", error);
            throw error;
        }
    },

    updateDocument: async (collectionId, documentId, data) => {
        try {
            return await databases.updateDocument(
                DATABASE_ID,
                collectionId,
                documentId,
                data
            );
        } catch (error) {
            console.error("Update document error:", error);
            throw error;
        }
    },

    deleteDocument: async (collectionId, documentId) => {
        try {
            return await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
        } catch (error) {
            console.error("Delete document error:", error);
            throw error;
        }
    },

    // User-specific operations
    createUser: async (userData) => {
        const USERS_COLLECTION_ID = import.meta.env.VITE_USERS_COLLECTION_ID;
        return await databaseService.createDocument(
            USERS_COLLECTION_ID,
            userData,
            userData.userId
        );
    },

    getUser: async (userId) => {
        const USERS_COLLECTION_ID = import.meta.env.VITE_USERS_COLLECTION_ID;
        return await databaseService.getDocument(USERS_COLLECTION_ID, userId);
    },

    updateUser: async (userId, userData) => {
        const USERS_COLLECTION_ID = import.meta.env.VITE_USERS_COLLECTION_ID;
        return await databaseService.updateDocument(USERS_COLLECTION_ID, userId, userData);
    },

    getUserByEmail: async (email) => {
        const USERS_COLLECTION_ID = import.meta.env.VITE_USERS_COLLECTION_ID;
        const result = await databaseService.listDocuments(USERS_COLLECTION_ID, [
            Query.equal("email", email),
        ]);
        return result.documents.length > 0 ? result.documents[0] : null;
    },

    // Road Reports operations
    createRoadReport: async (reportData) => {
        const ROAD_REPORTS_COLLECTION_ID = import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID;
        return await databaseService.createDocument(ROAD_REPORTS_COLLECTION_ID, reportData);
    },

    getRoadReports: async (queries = []) => {
        const ROAD_REPORTS_COLLECTION_ID = import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID;
        return await databaseService.listDocuments(ROAD_REPORTS_COLLECTION_ID, queries);
    },

    updateRoadReport: async (reportId, data) => {
        const ROAD_REPORTS_COLLECTION_ID = import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID;
        return await databaseService.updateDocument(ROAD_REPORTS_COLLECTION_ID, reportId, data);
    },

    // Help Requests operations
    createHelpRequest: async (requestData) => {
        const HELP_REQUESTS_COLLECTION_ID = import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID;
        return await databaseService.createDocument(HELP_REQUESTS_COLLECTION_ID, requestData);
    },

    getHelpRequests: async (queries = []) => {
        const HELP_REQUESTS_COLLECTION_ID = import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID;
        return await databaseService.listDocuments(HELP_REQUESTS_COLLECTION_ID, queries);
    },

    updateHelpRequest: async (requestId, data) => {
        const HELP_REQUESTS_COLLECTION_ID = import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID;
        return await databaseService.updateDocument(HELP_REQUESTS_COLLECTION_ID, requestId, data);
    },

    // Travel Alerts operations
    createTravelAlert: async (alertData) => {
        const TRAVEL_ALERTS_COLLECTION_ID = import.meta.env.VITE_TRAVEL_ALERTS_COLLECTION_ID;
        return await databaseService.createDocument(TRAVEL_ALERTS_COLLECTION_ID, alertData);
    },

    getTravelAlerts: async (queries = []) => {
        const TRAVEL_ALERTS_COLLECTION_ID = import.meta.env.VITE_TRAVEL_ALERTS_COLLECTION_ID;
        return await databaseService.listDocuments(TRAVEL_ALERTS_COLLECTION_ID, queries);
    },

    // MLA Applications operations
    createMLAApplication: async (applicationData) => {
        const MLA_APPLICATIONS_COLLECTION_ID = import.meta.env.VITE_MLA_APPLICATIONS_COLLECTION_ID;
        return await databaseService.createDocument(MLA_APPLICATIONS_COLLECTION_ID, applicationData);
    },

    getMLAApplications: async (queries = []) => {
        const MLA_APPLICATIONS_COLLECTION_ID = import.meta.env.VITE_MLA_APPLICATIONS_COLLECTION_ID;
        return await databaseService.listDocuments(MLA_APPLICATIONS_COLLECTION_ID, queries);
    },

    updateMLAApplication: async (applicationId, data) => {
        const MLA_APPLICATIONS_COLLECTION_ID = import.meta.env.VITE_MLA_APPLICATIONS_COLLECTION_ID;
        return await databaseService.updateDocument(MLA_APPLICATIONS_COLLECTION_ID, applicationId, data);
    },

    // MLA Responses operations
    createMLAResponse: async (responseData) => {
        const MLA_RESPONSES_COLLECTION_ID = import.meta.env.VITE_MLA_RESPONSES_COLLECTION_ID;
        return await databaseService.createDocument(MLA_RESPONSES_COLLECTION_ID, responseData);
    },

    getMLAResponses: async (queries = []) => {
        const MLA_RESPONSES_COLLECTION_ID = import.meta.env.VITE_MLA_RESPONSES_COLLECTION_ID;
        return await databaseService.listDocuments(MLA_RESPONSES_COLLECTION_ID, queries);
    },
};

export default databaseService;

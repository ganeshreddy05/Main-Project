import { ID } from "appwrite";
import { account } from "./config";

const authService = {
    register: async (email, password, name) => {
        try {
            return await account.create(ID.unique(), email, password, name);
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    getCurrentUser: async () => {
        try {
            return await account.get();
        } catch {
            return null;
        }
    },

    logout: async () => {
        try {
            return await account.deleteSession("current");
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    },

    // Delete all sessions (force logout from all devices)
    logoutAll: async () => {
        try {
            return await account.deleteSessions();
        } catch (error) {
            console.error("Logout all error:", error);
            throw error;
        }
    },

    // Get all active sessions
    getSessions: async () => {
        try {
            return await account.listSessions();
        } catch (error) {
            console.error("Get sessions error:", error);
            throw error;
        }
    },

    // Update user password
    updatePassword: async (newPassword, oldPassword) => {
        try {
            return await account.updatePassword(newPassword, oldPassword);
        } catch (error) {
            console.error("Update password error:", error);
            throw error;
        }
    },

    // Update user name
    updateName: async (name) => {
        try {
            return await account.updateName(name);
        } catch (error) {
            console.error("Update name error:", error);
            throw error;
        }
    },

    // Update user email
    updateEmail: async (email, password) => {
        try {
            return await account.updateEmail(email, password);
        } catch (error) {
            console.error("Update email error:", error);
            throw error;
        }
    },
};

export default authService;

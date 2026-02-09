import { storage } from "./config";
import { ID } from "appwrite";

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

const storageService = {
    // Upload file
    uploadFile: async (file, fileId = ID.unique(), permissions = []) => {
        try {
            return await storage.createFile(BUCKET_ID, fileId, file, permissions);
        } catch (error) {
            console.error("Upload file error:", error);
            throw error;
        }
    },

    // Get file preview/download URL
    getFileView: (fileId) => {
        try {
            return storage.getFileView(BUCKET_ID, fileId);
        } catch (error) {
            console.error("Get file view error:", error);
            throw error;
        }
    },

    // Get file download URL
    getFileDownload: (fileId) => {
        try {
            return storage.getFileDownload(BUCKET_ID, fileId);
        } catch (error) {
            console.error("Get file download error:", error);
            throw error;
        }
    },

    // Get file preview (with width and height for images)
    getFilePreview: (fileId, width = 400, height = 400, quality = 75) => {
        try {
            return storage.getFilePreview(BUCKET_ID, fileId, width, height, "center", quality);
        } catch (error) {
            console.error("Get file preview error:", error);
            throw error;
        }
    },

    // Delete file
    deleteFile: async (fileId) => {
        try {
            return await storage.deleteFile(BUCKET_ID, fileId);
        } catch (error) {
            console.error("Delete file error:", error);
            throw error;
        }
    },

    // List files
    listFiles: async (queries = []) => {
        try {
            return await storage.listFiles(BUCKET_ID, queries);
        } catch (error) {
            console.error("List files error:", error);
            throw error;
        }
    },

    // Get file details
    getFile: async (fileId) => {
        try {
            return await storage.getFile(BUCKET_ID, fileId);
        } catch (error) {
            console.error("Get file error:", error);
            throw error;
        }
    },

    // Upload multiple files
    uploadMultipleFiles: async (files, permissions = []) => {
        try {
            const uploadPromises = Array.from(files).map((file) =>
                storageService.uploadFile(file, ID.unique(), permissions)
            );
            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error("Upload multiple files error:", error);
            throw error;
        }
    },

    // Delete multiple files
    deleteMultipleFiles: async (fileIds) => {
        try {
            const deletePromises = fileIds.map((fileId) => storageService.deleteFile(fileId));
            return await Promise.all(deletePromises);
        } catch (error) {
            console.error("Delete multiple files error:", error);
            throw error;
        }
    },
};

export default storageService;

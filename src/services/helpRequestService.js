import { databases, storage, ID, Query } from "./appwriteConfig";

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const HELP_COLLECTION_ID = import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

// ⚠️ VALIDATION: Check if request is valid community issue
export const validateCommunityImpact = (data) => {
    const errors = [];

    // Check affected population
    if (!data.affectedPopulation || data.affectedPopulation < 10) {
        errors.push("Issue must affect at least 10 people/families to qualify as community issue");
    }

    // Check community impact description
    if (!data.communityImpact || data.communityImpact.trim().length < 20) {
        errors.push("Please describe how this issue affects the community (minimum 20 characters)");
    }

    return errors;
};

// Upload image/video
export const uploadHelpMedia = async (file) => {
    const uploaded = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
    );

    const fileUrl = storage.getFileView(BUCKET_ID, uploaded.$id);

    return {
        mediaId: uploaded.$id,
        mediaURL: fileUrl.href,
        mediaType: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
    };
};

// Create Help Request (with validation)
export const createHelpRequest = async (data) => {
    // Validate first
    const errors = validateCommunityImpact(data);
    if (errors.length > 0) {
        throw new Error(errors.join(". "));
    }

    return databases.createDocument(
        DATABASE_ID,
        HELP_COLLECTION_ID,
        ID.unique(),
        data
    );
};

// Get requests by district
export const getHelpRequestsByDistrict = (district) => {
    return databases.listDocuments(
        DATABASE_ID,
        HELP_COLLECTION_ID,
        [
            Query.equal("district", district),
            Query.orderDesc("$createdAt"),
            Query.limit(50),
        ]
    );
};

// Get requests by user
export const getMyHelpRequests = (userId) => {
    return databases.listDocuments(
        DATABASE_ID,
        HELP_COLLECTION_ID,
        [
            Query.equal("userId", userId),
            Query.orderDesc("$createdAt"),
        ]
    );
};

// Update request status
export const updateHelpRequestStatus = (id, status) => {
    return databases.updateDocument(
        DATABASE_ID,
        HELP_COLLECTION_ID,
        id,
        { status }
    );
};

// Like request
export const likeHelpRequest = (id, likedBy) => {
    return databases.updateDocument(
        DATABASE_ID,
        HELP_COLLECTION_ID,
        id,
        {
            likedBy,
            likes: likedBy.length,
        }
    );
};

// Delete request (only owner)
export const deleteHelpRequest = (id) => {
    return databases.deleteDocument(
        DATABASE_ID,
        HELP_COLLECTION_ID,
        id
    );
};

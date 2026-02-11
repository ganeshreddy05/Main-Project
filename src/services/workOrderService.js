import { databases, ID } from "./appwriteConfig";
import { Query } from "appwrite";

/**
 * Work Order Service
 * Handles all database operations for department work orders
 */

// Create a new work order
export const createWorkOrder = async (workOrderData) => {
    try {
        console.log("🔧 Work Order Service - Creating work order with data:", workOrderData);

        const response = await databases.createDocument(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_WORK_ORDERS_COLLECTION_ID,
            ID.unique(),
            {
                ...workOrderData,
                assignedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        );

        console.log("✅ Work Order Service - Document created successfully:", response.$id);
        return response;
    } catch (error) {
        console.error("❌ Work Order Service - Error creating work order:", error);
        console.error("📋 Failed data:", workOrderData);
        throw error;
    }
};

// Get work orders by MLA ID
export const getWorkOrdersByMLA = async (mlaId) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_WORK_ORDERS_COLLECTION_ID,
            [Query.equal("mlaId", mlaId), Query.orderDesc("$createdAt")]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching MLA work orders:", error);
        throw error;
    }
};

// Get work orders by department
export const getWorkOrdersByDepartment = async (department) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_WORK_ORDERS_COLLECTION_ID,
            [
                Query.equal("assignedDepartment", department),
                Query.orderDesc("$createdAt"),
            ]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching department work orders:", error);
        throw error;
    }
};

// Get work order by ID
export const getWorkOrderById = async (workOrderId) => {
    try {
        const response = await databases.getDocument(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_WORK_ORDERS_COLLECTION_ID,
            workOrderId
        );
        return response;
    } catch (error) {
        console.error("Error fetching work order:", error);
        throw error;
    }
};

// Get work orders for a specific road report
export const getWorkOrdersForReport = async (roadReportId) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_WORK_ORDERS_COLLECTION_ID,
            [Query.equal("roadReportId", roadReportId)]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching work orders for report:", error);
        throw error;
    }
};

// Update work order status
export const updateWorkOrderStatus = async (workOrderId, status, additionalData = {}) => {
    try {
        const updateData = {
            status,
            updatedAt: new Date().toISOString(),
            ...additionalData,
        };

        // Add timestamp fields based on status
        if (status === "accepted" && !additionalData.acceptedAt) {
            updateData.acceptedAt = new Date().toISOString();
        } else if (status === "in_progress" && !additionalData.startedAt) {
            updateData.startedAt = new Date().toISOString();
        } else if (status === "completed" && !additionalData.completedAt) {
            updateData.completedAt = new Date().toISOString();
        } else if (status === "rejected" && !additionalData.rejectedAt) {
            updateData.rejectedAt = new Date().toISOString();
        }

        const response = await databases.updateDocument(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_WORK_ORDERS_COLLECTION_ID,
            workOrderId,
            updateData
        );
        return response;
    } catch (error) {
        console.error("Error updating work order:", error);
        throw error;
    }
};

// Update road report with department assignment
export const updateRoadReportWithAssignment = async (roadReportId, department, workOrderId) => {
    try {
        console.log("🔧 Updating road report:", roadReportId);
        console.log("📋 Department:", department);
        console.log("📋 Work Order ID:", workOrderId);

        const updateData = {
            assignedToDepartment: department,
            // departmentStatus: "assigned",  // ⚠️ Temporarily disabled - testing enum issue
            workOrderId: workOrderId,
        };

        console.log("📤 Sending update data:", updateData);
        console.log("⚠️ departmentStatus DISABLED for testing - checking if enum is the issue");

        const response = await databases.updateDocument(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
            roadReportId,
            updateData
        );

        console.log("✅ Road report updated successfully:", response);
        return response;
    } catch (error) {
        console.error("❌ Error updating road report:", error);
        console.error("❌ Error code:", error.code);
        console.error("❌ Error type:", error.type);
        console.error("❌ Error message:", error.message);
        console.error("❌ Failed update data:", {
            roadReportId,
            department,
            workOrderId
        });
        throw error;
    }
};

// Add progress note to work order
export const addProgressNote = async (workOrderId, currentProgress, newNote) => {
    try {
        // Parse existing progress notes (JSON string)
        let progressNotes = [];
        if (currentProgress) {
            try {
                progressNotes = JSON.parse(currentProgress);
            } catch {
                progressNotes = [];
            }
        }

        // Add new note
        progressNotes.push({
            date: new Date().toISOString(),
            note: newNote,
        });

        // Update document
        const response = await databases.updateDocument(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_WORK_ORDERS_COLLECTION_ID,
            workOrderId,
            {
                progressNotes: JSON.stringify(progressNotes),
                updatedAt: new Date().toISOString(),
            }
        );
        return response;
    } catch (error) {
        console.error("Error adding progress note:", error);
        throw error;
    }
};

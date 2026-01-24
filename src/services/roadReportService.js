import { databases, storage, ID, Query } from "./appwriteConfig";

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const ROAD_COLLECTION_ID = import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

// Upload image/video
export const uploadRoadMedia = async (file) => {
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

// Create Road Report
export const createRoadReport = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    ROAD_COLLECTION_ID,
    ID.unique(),
    data
  );
};

// Get reports by district
export const getRoadReportsByDistrict = (district) => {
  return databases.listDocuments(
    DATABASE_ID,
    ROAD_COLLECTION_ID,
    [
      Query.equal("district", district),
      Query.equal("status", "ACTIVE"),
      Query.orderDesc("$createdAt"),
    ]
  );
};

// Resolve (only owner)
export const resolveRoadReport = (id) => {
  return databases.updateDocument(
    DATABASE_ID,
    ROAD_COLLECTION_ID,
    id,
    { status: "RESOLVED" }
  );
};

// Like report
export const likeRoadReport = (id, likedBy) => {
  return databases.updateDocument(
    DATABASE_ID,
    ROAD_COLLECTION_ID,
    id,
    {
      likedBy,
      likes: likedBy.length,
    }
  );
};

import { databases,  Query } from "@/services/appwriteConfig";
import { ID } from "appwrite"

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const HELP_COLLECTION_ID = import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID;

const dbService = {
 
  createHelpRequest: async (data) => {
    return await databases.createDocument(
      DATABASE_ID,
      HELP_COLLECTION_ID,
      ID.unique(),
      data
    );
  },

 
  getHelpRequestsByCity: async (city) => {
    return await databases.listDocuments(
      DATABASE_ID,
       HELP_COLLECTION_ID,
      [
        Query.equal("city", city),
        Query.equal("status", "Active"),
        Query.orderDesc("$createdAt"),
      ]
    );
  },
  getMyHelpRequests: async (userId) => {
    return await databases.listDocuments(
      DATABASE_ID,
      HELP_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );
  },
    updateHelpRequestStatus: async (docId, status) => {
    return await databases.updateDocument(
      DATABASE_ID,
      HELP_COLLECTION_ID,
      docId,
      { status }
    );
  },
};



export default dbService;

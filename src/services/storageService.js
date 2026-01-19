import { storage, ID } from "@/services/appwriteConfig";

const storageService = {
  uploadFile: async (file) => {
    const uploaded = await storage.createFile(
      import.meta.env.VITE_APPWRITE_BUCKET_ID,
      ID.unique(),
      file
    );

    return uploaded.$id;
  },

  getFilePreview: (fileId) => {
    return storage.getFilePreview(
      import.meta.env.VITE_APPWRITE_BUCKET_ID,
      fileId
    );
  },
};

export default storageService;

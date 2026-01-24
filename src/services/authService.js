import { ID } from "appwrite";
import { account } from "./appwriteConfig";

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

};
export default authService;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, User, LogOut, X } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import authService from "@/services/authService";
import { databases, Query } from "@/services/appwriteConfig";

const TopBar = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch MLA responses for user's requests
  const { data: notifications = [] } = useQuery({
    queryKey: ["user-notifications", user?.$id],
    enabled: !!user,
    queryFn: async () => {
      // Get user's help requests
      const helpRequests = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
        [Query.equal("userId", user.$id), Query.orderDesc("$createdAt")]
      );

      // Get MLA responses for those requests
      const allResponses = [];
      for (const request of helpRequests.documents) {
        const responses = await databases.listDocuments(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_MLA_HELP_RESPONSES_COLLECTION_ID,
          [Query.equal("helpRequestId", request.$id), Query.orderDesc("$createdAt")]
        );

        // Add request title to each response for context
        responses.documents.forEach(response => {
          allResponses.push({
            ...response,
            requestTitle: request.title,
            requestId: request.$id,
            isNew: !response.readByUser // Track if user has seen this
          });
        });
      }

      return allResponses.slice(0, 10); // Show latest 10
    },
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (responseId) => {
      await databases.updateDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_MLA_HELP_RESPONSES_COLLECTION_ID,
        responseId,
        { readByUser: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user-notifications"]);
    },
  });

  const handleLogout = async () => {
    await authService.logout();
    navigate("/");
  };

  const unreadCount = notifications.filter(n => n.isNew).length;

  return (
    <div className="h-16 bg-white border-b border-gray-200 shadow-sm px-6 flex items-center justify-between">
      {/* Left: App name/title (optional, can be empty since sidebar has logo) */}
      <div className="text-lg font-semibold text-gray-800">
        {/* Dashboard title can go here if needed */}
      </div>

      {/* Right: User info, notifications, logout */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.$id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${notification.isNew ? "bg-emerald-50" : ""
                        }`}
                      onClick={() => {
                        if (notification.isNew) {
                          markAsReadMutation.mutate(notification.$id);
                        }
                        navigate(`/dashboard/help-requests`);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bell className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 mb-1">
                            ✅ MLA Responded to your request
                          </p>
                          <p className="text-xs text-gray-600 mb-2">
                            "{notification.requestTitle}"
                          </p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {notification.responseMessage}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.$createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {notification.isNew && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">{profile?.name || "User"}</p>
            <p className="text-xs text-gray-500">{profile?.district || "District"}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Bell,
    FileText,
    Users,
    CheckCheck,
    Clock,
    MapPin,
    X,
    AlertCircle,
    Eye,
} from "lucide-react";
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} from "@/services/notificationService";

const MLANotifications = ({ userId, isOpen, onClose }) => {
    const queryClient = useQueryClient();

    // Fetch notifications
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ["mla-notifications", userId],
        queryFn: () => getNotifications(userId),
        enabled: !!userId && isOpen,
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    // Mark single as read
    const markReadMutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(["mla-notifications"]);
            queryClient.invalidateQueries(["mla-unread-count"]);
        },
    });

    // Mark all as read
    const markAllReadMutation = useMutation({
        mutationFn: () => markAllAsRead(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(["mla-notifications"]);
            queryClient.invalidateQueries(["mla-unread-count"]);
        },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const getTypeIcon = (type) => {
        switch (type) {
            case "ROAD_REPORT":
                return <FileText className="w-5 h-5 text-blue-600" />;
            case "HELP_REQUEST":
                return <Users className="w-5 h-5 text-orange-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case "ROAD_REPORT":
                return "Road Report";
            case "HELP_REQUEST":
                return "Help Request";
            default:
                return "Notification";
        }
    };

    const getTimeSince = (dateStr) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col z-10 animate-slide-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-500">
                    <div className="flex items-center gap-3">
                        <Bell className="w-6 h-6 text-white" />
                        <div>
                            <h2 className="text-lg font-bold text-white">Notifications</h2>
                            {unreadCount > 0 && (
                                <p className="text-xs text-red-100">
                                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllReadMutation.mutate()}
                                disabled={markAllReadMutation.isPending}
                                className="text-xs px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition font-medium flex items-center gap-1"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-200 border-t-red-600"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Bell className="w-12 h-12 mb-3" />
                            <p className="font-medium text-gray-600">No notifications yet</p>
                            <p className="text-sm text-gray-500 mt-1">
                                You'll be notified when citizens report issues
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.$id}
                                    className={`px-6 py-4 hover:bg-gray-50 transition cursor-pointer ${!notification.isRead ? "bg-blue-50/50 border-l-4 border-l-red-500" : ""
                                        }`}
                                    onClick={() => {
                                        if (!notification.isRead) {
                                            markReadMutation.mutate(notification.$id);
                                        }
                                    }}
                                >
                                    <div className="flex gap-3">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.type === "ROAD_REPORT"
                                                ? "bg-blue-100"
                                                : "bg-orange-100"
                                            }`}>
                                            {getTypeIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${notification.type === "ROAD_REPORT"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-orange-100 text-orange-700"
                                                    }`}>
                                                    {getTypeLabel(notification.type)}
                                                </span>
                                                {!notification.isRead && (
                                                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                                                )}
                                            </div>

                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>

                                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {notification.district}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {getTimeSince(notification.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default MLANotifications;

import { useState } from "react";
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Database,
    Mail,
    Globe,
    Save,
    RefreshCw
} from "lucide-react";

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        siteName: "Fix My District",
        siteDescription: "Citizen Engagement Platform",
        adminEmail: "admin@fixmydistrict.com",
        enableNotifications: true,
        enableEmailAlerts: true,
        autoApproveOfficials: false,
        maintenanceMode: false,
        maxUploadSize: "10",
        sessionTimeout: "30",
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
        setSaved(false);
    };

    const handleSave = () => {
        // Here you would typically save to database
        console.log("Saving settings:", settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <SettingsIcon className="w-7 h-7" />
                    System Settings
                </h1>
                <p className="text-gray-600 mt-1">
                    Configure system-wide settings and preferences
                </p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-slate-600" />
                        General Settings
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Site Name
                            </label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => handleChange("siteName", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Site Description
                            </label>
                            <textarea
                                value={settings.siteDescription}
                                onChange={(e) => handleChange("siteDescription", e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={settings.adminEmail}
                                onChange={(e) => handleChange("adminEmail", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-slate-600" />
                        Notification Settings
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Enable Notifications</p>
                                <p className="text-sm text-gray-600">Send notifications to users</p>
                            </div>
                            <button
                                onClick={() => handleChange("enableNotifications", !settings.enableNotifications)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableNotifications ? "bg-slate-600" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableNotifications ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Email Alerts</p>
                                <p className="text-sm text-gray-600">Send email notifications to admins</p>
                            </div>
                            <button
                                onClick={() => handleChange("enableEmailAlerts", !settings.enableEmailAlerts)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableEmailAlerts ? "bg-slate-600" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableEmailAlerts ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-slate-600" />
                        Security Settings
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Auto-Approve Officials</p>
                                <p className="text-sm text-gray-600">Automatically approve official registrations</p>
                            </div>
                            <button
                                onClick={() => handleChange("autoApproveOfficials", !settings.autoApproveOfficials)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoApproveOfficials ? "bg-slate-600" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoApproveOfficials ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Session Timeout (minutes)
                            </label>
                            <input
                                type="number"
                                value={settings.sessionTimeout}
                                onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                                min="5"
                                max="120"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* System Settings */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5 text-slate-600" />
                        System Settings
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Maintenance Mode</p>
                                <p className="text-sm text-gray-600">Disable public access to the system</p>
                            </div>
                            <button
                                onClick={() => handleChange("maintenanceMode", !settings.maintenanceMode)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode ? "bg-red-600" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Upload Size (MB)
                            </label>
                            <input
                                type="number"
                                value={settings.maxUploadSize}
                                onChange={(e) => handleChange("maxUploadSize", e.target.value)}
                                min="1"
                                max="100"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-6">
                    <div>
                        {saved && (
                            <p className="text-green-600 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                Settings saved successfully!
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reset
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;

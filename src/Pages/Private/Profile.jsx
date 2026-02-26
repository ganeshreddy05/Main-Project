import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databases, ID, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import useCity from "@/context/useCity";
import { statesData } from "@/states/states";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Save,
  Loader2,
  Edit3,
  X,
  CheckCircle,
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { updateCity } = useCity();
  const queryClient = useQueryClient();

  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  /* ---------------- FETCH PROFILE ---------------- */
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.$id],
    enabled: !!user,
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_USERS_COLLECTION_ID,
        [Query.equal("userId", user.$id)]
      );
      return res.documents[0] || null;
    },
  });

  /* ---------------- PREFILL FORM ---------------- */
  useEffect(() => {
    if (profile) {
      setPhone(profile.phone || "");
      setCity(profile.city || "");
      setState(profile.state || "");
      setDistrict(profile.district || "");
    }
  }, [profile]);

  /* ---------------- SAVE / UPDATE PROFILE ---------------- */
  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      const data = {
        userId: user.$id,
        name: user.name,
        email: user.email,
        phone,
        city,
        state,
        district,
      };

      if (profile) {
        return databases.updateDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_USERS_COLLECTION_ID,
          profile.$id,
          data
        );
      } else {
        return databases.createDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_USERS_COLLECTION_ID,
          ID.unique(),
          data
        );
      }
    },
    onSuccess: () => {
      alert("Profile saved successfully ✅");
      updateCity(city);
      queryClient.invalidateQueries(["profile"]);
      queryClient.invalidateQueries(["dashboard-road-reports"]);
      setIsEditing(false);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 flex items-center justify-center min-h-full">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
        {/* Profile Header with Gradient */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{user?.name || "Citizen"}</h1>
                <p className="text-green-200 text-lg">{user?.email}</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm font-medium"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  // Reset to original values
                  if (profile) {
                    setPhone(profile.phone || "");
                    setCity(profile.city || "");
                    setState(profile.state || "");
                    setDistrict(profile.district || "");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Profile Information</h2>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Name (Read-only) */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="text-gray-900 font-medium">{user?.name || "Not available"}</p>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Email Address</p>
                <p className="text-gray-900 font-medium">{user?.email || "Not available"}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{phone || "Not specified"}</p>
                )}
              </div>
            </div>

            {/* City */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">City</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{city || "Not specified"}</p>
                )}
              </div>
            </div>

            {/* State */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">State</p>
                {isEditing ? (
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setDistrict("");
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="">Select State</option>
                    {Object.keys(statesData).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">{state || "Not specified"}</p>
                )}
              </div>
            </div>

            {/* District */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">District</p>
                {isEditing ? (
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
                    disabled={!state}
                  >
                    <option value="">Select District</option>
                    {state &&
                      statesData[state]?.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">{district || "Not specified"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Account Status</h3>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Active Account
              </div>
              <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Role: Citizen
              </div>
            </div>
          </div>

          {/* Save Button (only in edit mode) */}
          {isEditing && (
            <div className="mt-6 pt-5 border-t border-gray-200">
              <button
                onClick={() => saveProfileMutation.mutate()}
                disabled={saveProfileMutation.isPending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveProfileMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

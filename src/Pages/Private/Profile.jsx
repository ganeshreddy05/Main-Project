import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databases, ID, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import useCity from "@/context/useCity";
import { statesData } from "@/states/states";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const { user } = useAuth();
  const { updateCity } = useCity();
  const queryClient = useQueryClient();

  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

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
        // UPDATE
        return databases.updateDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_USERS_COLLECTION_ID,
          profile.$id,
          data
        );
      } else {
        // CREATE
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
      updateCity(city); // update CityContext
      queryClient.invalidateQueries(["profile"]);
      // Invalidate dashboard queries to refresh reports
      queryClient.invalidateQueries(["dashboard-road-reports"]);
    },
  });

  if (isLoading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">My Profile</h2>

      {/* READ ONLY INFO */}
      <div className="space-y-2 mb-6">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      {/* EDITABLE FIELDS */}
      <div className="space-y-4">
        <Input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        {/* STATE SELECTOR */}
        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <select
            className="border p-3 rounded-xl w-full"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setDistrict(""); // Reset district when state changes
            }}
          >
            <option value="">Select State</option>
            {Object.keys(statesData).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* DISTRICT SELECTOR */}
        {state && (
          <div>
            <label className="block text-sm font-medium mb-2">District</label>
            <select
              className="border p-3 rounded-xl w-full"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">Select District</option>
              {statesData[state]?.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        <Button
          className="w-full bg-indigo-600"
          onClick={() => saveProfileMutation.mutate()}
          disabled={saveProfileMutation.isLoading}
        >
          {saveProfileMutation.isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databases, ID, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import  useCity  from "@/context/useCity";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const { user } = useAuth();
  const { updateCity } = useCity();
  const queryClient = useQueryClient();

  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

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
    },
  });

  if (isLoading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-xl bg-white p-6 rounded-xl shadow">
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

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { databases, ID, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import useCity from "@/context/useCity";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const CreateHelpRequest = () => {
  const { user } = useAuth();
  const { city } = useCity();
  const queryClient = useQueryClient();

  const [helptype, setHelptype] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);

  /* ---------------- GET USER LOCATION ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        alert("Location permission denied. Please allow location.");
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  /* ---------------- FETCH PROFILE (PHONE) ---------------- */
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.$id],
    enabled: !!user,
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_USERS_COLLECTION_ID,
        [Query.equal("userId", user.$id)]
      );
      return res.documents[0];
    },
  });

  /* ---------------- CREATE HELP REQUEST ---------------- */
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!city) throw new Error("City missing");
      if (!helptype) throw new Error("Help type missing");
      if (!profile?.phone) throw new Error("Phone missing in Profile");
      if (!location) throw new Error("Location not available");

      return databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
        ID.unique(),
        {
          city,
          helptype,
          description,
          status: "ACTIVE",
          userId: user.$id,

          // requester details (snapshot)
          requestName: user.name,
          requestEmail: user.email,
          requestPhone: profile.phone,

          // 📍 location data
          lat: location.lat,
          lng: location.lng,
         
        }
      );
    },
    onSuccess: () => {
      alert("Help request created successfully ✅");
      setHelptype("");
      setDescription("");
      queryClient.invalidateQueries(["help-requests"]);
      queryClient.invalidateQueries(["my-requests"]);
    },
    onError: (err) => alert(err.message),
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Request Help</h2>

      {/* Help type */}
      <select
        className="border p-2 w-full rounded mb-3"
        value={helptype}
        onChange={(e) => setHelptype(e.target.value)}
      >
        <option value="">Select Help Type</option>
        <option value="Petrol">Petrol</option>
        <option value="Hospital">Hospital</option>
        <option value="Breakdown">Breakdown</option>
        <option value="Other">Other</option>
      </select>

      {/* Description */}
      <Textarea
        placeholder="Describe the issue"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Location status */}
      <p className="text-sm text-gray-500 mt-2">
        {location
          ? `📍 Location detected (±${Math.round(location.accuracy)}m)`
          : "📍 Detecting location..."}
      </p>

      {/* Submit */}
      <Button
        className="mt-4 w-full"
        onClick={() => createMutation.mutate()}
        disabled={createMutation.isLoading || !location}
      >
        {createMutation.isLoading ? "Submitting..." : "Request Help"}
      </Button>
    </div>
  );
};

export default CreateHelpRequest;

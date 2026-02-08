import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { databases, storage, ID, Permission, Role } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const CreateRoadReport = ({ state, district, onSubmitted }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [condition, setCondition] = useState("");
  const [landmark, setLandmark] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // 📍 Capture location
  const captureLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationLoading(false);
      },
      () => {
        alert("Location permission denied");
        setLocationLoading(false);
      }
    );
  };

  // 🚀 Mutation
  const mutation = useMutation({
    mutationFn: async () => {
      if (!fromPlace || !toPlace || !condition || !location) {
        throw new Error("Please fill all fields and capture location");
      }

      let mediaURL = "";
      let mediaType = "";
      let mediaId = "";

      if (file) {
        const uploaded = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          ID.unique(),
          file
        );

        mediaId = uploaded.$id;
        mediaURL = storage.getFileView(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          uploaded.$id
        );
        mediaType = file.type.startsWith("video") ? "VIDEO" : "IMAGE";
      }

      const payload = {
        state,
        district,
        fromPlace,
        toPlace,
        condition,
        landmark,
        description,
        lat: location.lat,
        lng: location.lng,
        status: "ACTIVE",
        userId: user.$id,
        reporterName: user.name,
        likes: 0,
        mediaURL,
        mediaType,
        mediaId,
      };

      const res = await databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        ID.unique(),
        payload,
        [
          // Allow the creator to read, update, delete
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
          // Allow ALL authenticated users to read and update (so MLAs can respond)
          Permission.read(Role.users()),
          Permission.update(Role.users()),
        ]
      );

      return res; // IMPORTANT for spinner
    },

    onSuccess: () => {
      setFromPlace("");
      setToPlace("");
      setCondition("");
      setLandmark("");
      setDescription("");
      setFile(null);
      setLocation(null);

      // Invalidate all relevant queries
      queryClient.invalidateQueries(["road-reports"]);
      queryClient.invalidateQueries(["my-road-reports"]);
      queryClient.invalidateQueries(["dashboard-road-reports"]);
      // Invalidate MLA queries so reports show up immediately on MLA dashboard
      queryClient.invalidateQueries(["mla-road-reports"]);

      // notify parent (optional)
      if (typeof onSubmitted === "function") onSubmitted();
    },

    onError: (err) => {
      alert(err.message);
    },
  });

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-6 space-y-4">
      <h2 className="text-xl font-bold">
        Report Road in {district}, {state}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="From Place"
          value={fromPlace}
          onChange={(e) => setFromPlace(e.target.value)}
        />
        <Input
          placeholder="To Place"
          value={toPlace}
          onChange={(e) => setToPlace(e.target.value)}
        />
      </div>

      <select
        className="border p-3 rounded-xl w-full"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      >
        <option value="">Select Condition</option>
        <option value="GOOD">Good</option>
        <option value="BAD">Bad</option>
        <option value="UNDER_CONSTRUCTION">Under Construction</option>
        <option value="ACCIDENT">Accident</option>
      </select>

      <Input
        placeholder="Landmark (e.g., Near XYZ Mall)"
        value={landmark}
        onChange={(e) => setLandmark(e.target.value)}
      />

      {/* DESCRIPTION FIELD */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          📝 Description <span className="text-gray-500">(Optional but recommended)</span>
        </label>
        <textarea
          placeholder="Describe the road condition in detail: severity, traffic impact, hazards, any specific issues..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          💡 Tip: Include specific details like size of potholes, water logging depth, etc.
        </p>
      </div>

      <Input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <Button
        type="button"
        onClick={captureLocation}
        className="bg-blue-500 hover:bg-blue-600"
      >
        {locationLoading
          ? "Capturing..."
          : location
            ? "Location Captured ✅"
            : "Capture Location"}
      </Button>

      <Button
        onClick={() => mutation.mutate()}
        disabled={mutation.isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Report"
        )}
      </Button>
    </div>
  );
};

export default CreateRoadReport;

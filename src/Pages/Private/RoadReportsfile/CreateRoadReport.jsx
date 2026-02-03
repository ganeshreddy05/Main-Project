import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { databases, storage, ID } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const CreateRoadReport = ({ state, district }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [condition, setCondition] = useState("");
  const [landmark, setLandmark] = useState("");
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
        lat: location.lat,
        lng: location.lng,
        status: "ACTIVE",
        userId: user.$id,
        reporterName: user.name,
        likes: 0,
        likedBy: [],
        mediaURL,
        mediaType,
        mediaId,
      };

      const res = await databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        ID.unique(),
        payload
      );

      return res; // IMPORTANT for spinner
    },

    onSuccess: () => {
      setFromPlace("");
      setToPlace("");
      setCondition("");
      setLandmark("");
      setFile(null);
      setLocation(null);

      queryClient.invalidateQueries(["road-reports"]);
      queryClient.invalidateQueries(["my-road-reports"]);
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
        placeholder="Landmark"
        value={landmark}
        onChange={(e) => setLandmark(e.target.value)}
      />

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
        {mutation.isLoading ? (
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

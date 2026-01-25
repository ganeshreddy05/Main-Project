import { useState } from "react";
import { databases, storage, ID } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateRoadReport = ({ state, district }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [condition, setCondition] = useState("");
  const [landmark, setLandmark] = useState("");
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState(null);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Location permission denied"),
    );
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!location) throw new Error("Capture location first");

      let mediaURL = "";
      let mediaId = "";
      let mediaType = "";

      if (file) {
        const uploaded = await storage.createFile(
          import.meta.env.VITE_BUCKET_ID,
          ID.unique(),
          file,
        );

        mediaId = uploaded.$id;
        mediaURL = storage.getFileView(
          import.meta.env.VITE_BUCKET_ID,
          uploaded.$id,
        );
        mediaType = file.type.startsWith("video") ? "video" : "image";
      }

      return databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          reporterName: user.name,
          state,
          district,
          fromPlace,
          toPlace,
          condition,
          landmark,
          status: "ACTIVE",
          lat: location.lat,
          lng: location.lng,
          mediaURL,
          mediaId,
          mediaType,
          likes: 0,
          likedBy: [],
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["roadReports"]);
      alert("Road Report Submitted ✅");
    },
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-bold">
        Report Road in {district}, {state}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="From Place"
          className="border p-2 rounded-lg"
          onChange={(e) => setFromPlace(e.target.value)}
        />

        <input
          placeholder="To Place"
          className="border p-2 rounded-lg"
          onChange={(e) => setToPlace(e.target.value)}
        />
      </div>

      <select
        className="border p-2 rounded-lg w-full"
        onChange={(e) => setCondition(e.target.value)}
      >
        <option value="">Select Condition</option>
        <option value="BAD">Bad</option>
        <option value="UNDER_CONSTRUCTION">Under Construction</option>
        <option value="ACCIDENT">Accident</option>
        <option value="GOOD">Good</option>
      </select>

      <input
        placeholder="Landmark"
        className="border p-2 rounded-lg w-full"
        onChange={(e) => setLandmark(e.target.value)}
      />

      <input
        type="file"
        className="w-full"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={captureLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        {location ? "Location Captured ✅" : "Capture Location"}
      </button>

      <button
        onClick={() => mutation.mutate()}
        className="bg-indigo-600 text-white w-full py-2 rounded-xl hover:bg-indigo-700 transition"
      >
        {mutation.isLoading ? "Submitting..." : "Submit Report"}
      </button>
    </div>
  );
};

export default CreateRoadReport;

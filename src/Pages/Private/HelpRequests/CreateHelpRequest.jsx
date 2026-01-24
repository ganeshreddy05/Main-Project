import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { databases, storage, ID } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import useCity from "@/context/useCity";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const CreateRoadReport = () => {
  const { user } = useAuth();
  const { city, district, state } = useCity();
  const queryClient = useQueryClient();

  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [landmark, setLandmark] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Location permission denied")
    );
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!location) throw new Error("Capture location");
      if (!condition) throw new Error("Select condition");

      setLoading(true);

      let mediaURL = "";
      let mediaId = "";
      let mediaType = "";

      if (file) {
        const upload = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          ID.unique(),
          file
        );

        mediaId = upload.$id;
        mediaURL = storage.getFileView(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          upload.$id
        );
        mediaType = file.type.startsWith("video") ? "VIDEO" : "IMAGE";
      }

      return databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        ID.unique(),
        {
          state,
          district,
          city,
          fromPlace,
          toPlace,
          landmark,
          condition,
          description,
          status: "ACTIVE",
          lat: location.lat,
          lng: location.lng,
          mediaURL,
          mediaId,
          mediaType,
          likes: 0,
          likedBy: [],
          userId: user.$id,
          reporterName: user.name,
        }
      );
    },
    onSuccess: () => {
      setLoading(false);
      alert("Road Report Submitted ✅");
      queryClient.invalidateQueries(["road-reports"]);
    },
    onError: (err) => {
      setLoading(false);
      alert(err.message);
    },
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Report Road</h2>

      <Input placeholder="From Place" onChange={(e) => setFromPlace(e.target.value)} />
      <Input placeholder="To Place" className="mt-2" onChange={(e) => setToPlace(e.target.value)} />
      <Input placeholder="Landmark" className="mt-2" onChange={(e) => setLandmark(e.target.value)} />

      <select
        className="border p-2 w-full rounded mt-3"
        onChange={(e) => setCondition(e.target.value)}
      >
        <option value="">Select Condition</option>
        <option value="BAD">Bad Road</option>
        <option value="UNDER_CONSTRUCTION">Under Construction</option>
        <option value="ACCIDENT">Accident</option>
        <option value="GOOD">Good</option>
      </select>

      <Textarea
        placeholder="Description"
        className="mt-3"
        onChange={(e) => setDescription(e.target.value)}
      />

      <Input type="file" className="mt-3" onChange={(e) => setFile(e.target.files[0])} />

      <Button className="mt-3 w-full" onClick={getLocation}>
        Capture Location
      </Button>

      {location && <p className="text-green-600 mt-2">Location Captured ✔</p>}

      <Button
        className="mt-4 w-full"
        onClick={() => createMutation.mutate()}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Report"}
      </Button>
    </div>
  );
};

export default CreateRoadReport;

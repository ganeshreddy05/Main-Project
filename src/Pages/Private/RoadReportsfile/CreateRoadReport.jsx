import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoadReport, uploadRoadMedia } from "@/services/roadReportService";
import { useAuth } from "@/context/useAuth";
import useCity from "@/context/useCity";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const CreateRoadReport = () => {
  const { user } = useAuth();
  const { city } = useCity();
  const queryClient = useQueryClient();

  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [landmark, setLandmark] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Capture location
  const getLocation = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (err) => {
        alert("Location permission denied");
        setLoadingLocation(false);
      }
    );
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!location) throw new Error("Location missing");
      if (!district || !fromPlace || !toPlace || !condition)
        throw new Error("Fill all required fields");

      let mediaData = { mediaURL: "", mediaType: "", mediaId: "" };

      if (file) {
        mediaData = await uploadRoadMedia(file);
      }

      return createRoadReport({
        district,
        state,
        fromPlace,
        toPlace,
        landmark,
        condition,
        description,
        status: "ACTIVE",
        lat: location.lat,
        lng: location.lng,
        userId: user.$id,
        reporterName: user.name,
        city,
        likes: 0,
        likedBy: [],
        ...mediaData,
      });
    },
    onSuccess: () => {
      alert("Road Report Submitted ✅");
      queryClient.invalidateQueries(["road-reports"]);
      setFromPlace("");
      setToPlace("");
      setDistrict("");
      setState("");
      setLandmark("");
      setCondition("");
      setDescription("");
      setFile(null);
      setLocation(null);
    },
    onError: (err) => {
      console.error(err);
      alert(err.message);
    },
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">Report Road</h2>

      <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
      <Input placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
      <Input placeholder="From Place" value={fromPlace} onChange={(e) => setFromPlace(e.target.value)} />
      <Input placeholder="To Place" value={toPlace} onChange={(e) => setToPlace(e.target.value)} />

      <select
        className="border p-2 w-full rounded mt-2"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      >
        <option value="">Select Condition</option>
        <option value="VERY_BAD">Good</option>
        <option value="BAD">Bad</option>
        <option value="UNDER_CONSTRUCTION">Under Construction</option>
        <option value="ACCIDENT">Accident</option>
        <option value="FLOODED">Flooded</option>
      </select>

      <Input placeholder="Landmark" value={landmark} onChange={(e) => setLandmark(e.target.value)} />

      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <Button className="mt-3" onClick={getLocation}>
        {loadingLocation ? "Capturing..." : "Capture Location"}
      </Button>

      {location && (
        <p className="text-green-600 mt-2">
          Location Captured ✔ {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}

      <Button
        className="mt-4 w-full"
        disabled={mutation.isLoading}
        onClick={() => mutation.mutate()}
      >
        {mutation.isLoading ? "Submitting..." : "Submit Report"}
      </Button>
    </div>
  );
};

export default CreateRoadReport;

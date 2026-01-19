import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { databases, ID } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import useCity from "@/context/useCity";

const CreateRoadReport = () => {
  const { user } = useAuth();
  const { city } = useCity();
  const queryClient = useQueryClient();

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [condition, setCondition] = useState("");
  const [landmark, setLandmark] = useState("");
  const [location, setLocation] = useState(null);

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

  const mutation = useMutation({
    mutationFn: async () => {
      if (!location) throw new Error("Location missing");

      return databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        ID.unique(),
        {
          fromCity,
          toCity,
          district: city,
          condition,
          landmark,
          latitude: location.lat,
          longitude: location.lng,
          status: "ACTIVE",
          userId: user.$id,
        }
      );
    },
    onSuccess: () => {
      alert("Road report submitted ✅");
      queryClient.invalidateQueries(["road-reports"]);
      queryClient.invalidateQueries(["my-reports"]);
    },
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Create Road Report</h2>

      <input
        placeholder="From (City/Village)"
        className="border p-2 w-full mb-2"
        onChange={(e) => setFromCity(e.target.value)}
      />

      <input
        placeholder="To (City/Village)"
        className="border p-2 w-full mb-2"
        onChange={(e) => setToCity(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-2"
        onChange={(e) => setCondition(e.target.value)}
      >
        <option value="">Select Condition</option>
        <option value="GOOD">Good</option>
        <option value="BAD">Bad</option>
        <option value="VERY_BAD">Very Bad</option>
        <option value="DANGEROUS">Dangerous</option>
         <option value="UNDER_CONSTRUCTION">Under construction</option>
          <option value="FLOODED">Flooded</option>
           <option value="ACCIDENT">Accident</option>
      </select>

      <textarea
        placeholder="Landmark / Description"
        className="border p-2 w-full mb-2"
        onChange={(e) => setLandmark(e.target.value)}
      />

      <button
        className="bg-gray-200 w-full p-2 mb-2"
        onClick={getLocation}
      >
        Capture Location
      </button>

      <button
        className="bg-indigo-600 text-white w-full p-2 rounded"
        onClick={() => mutation.mutate()}
      >
        Submit Report
      </button>
    </div>
  );
};

export default CreateRoadReport;

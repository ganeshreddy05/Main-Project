import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { databases } from "@/services/appwriteConfig";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";

const HelpRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* -------- Fetch request -------- */
  const { data, isLoading } = useQuery({
    queryKey: ["help-request", id],
    queryFn: async () => {
      return databases.getDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
        id
      );
    },
  });

  /* -------- Resolve request -------- */
  const resolveMutation = useMutation({
    mutationFn: async () => {
      return databases.updateDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
        id,
        { status: "CLOSED" }
      );
    },
    onSuccess: () => {
      alert("Help request resolved 🙏");
      navigate("/dashboard/help-requests");
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (!data) return null;

  return (
    <div className="max-w-2xl bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700">
        Help Request Details
      </h2>

      {/* Details */}
      <p><strong>Name:</strong> {data.requestName}</p>
      <p><strong>Email:</strong> {data.requestEmail}</p>
      <p><strong>Phone:</strong> {data.requestPhone}</p>
      <p><strong>Help Type:</strong> {data.helptype}</p>
      <p><strong>Description:</strong> {data.description}</p>
      <p><strong>City:</strong> {data.city}</p>

      {/* Map */}
      {data.latitude && data.longitude && (
        <MapContainer
          center={[data.latitude, data.longitude]}
          zoom={15}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[data.latitude, data.longitude]}>
            <Popup>
              {data.requesterName}'s location
            </Popup>
          </Marker>
        </MapContainer>
      )}

      {/* Navigate */}
      <a
        href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-blue-600 underline"
      >
        <Button>Navigate</Button>
      </a>

      {/* Resolve */}
      <Button
        className="mt-4 bg-green-600"
        onClick={() => resolveMutation.mutate()}
      >
        Mark as Resolved
      </Button>
    </div>
  );
};

export default HelpRequestDetails;

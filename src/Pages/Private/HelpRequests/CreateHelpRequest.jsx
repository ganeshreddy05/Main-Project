import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { databases, storage, ID, Permission, Role } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, X } from "lucide-react";
import { HELP_CATEGORIES_ARRAY, VALIDATION_RULES } from "@/constants/helpRequestConstants";
import { notifyMLAsAboutReport } from "@/services/notificationService";

const CreateHelpRequest = ({ onSubmitted }) => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  // Form state
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [village, setVillage] = useState("");
  const [mandal, setMandal] = useState("");
  const [landmark, setLandmark] = useState("");

  // Community validation fields
  const [affectedPopulation, setAffectedPopulation] = useState("");
  const [communityImpact, setCommunityImpact] = useState("");

  const [file, setFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(true);

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

  // Get selected category details
  const selectedCategory = HELP_CATEGORIES_ARRAY.find(cat => cat.value === category);

  // 🚀 Mutation
  const mutation = useMutation({
    mutationFn: async () => {
      // Validation
      if (!profile?.state || !profile?.district) {
        throw new Error("Please complete your profile with State and District information");
      }

      if (!village || !mandal) {
        throw new Error("Please enter Village and Mandal");
      }

      if (!category || !title || !description || !location) {
        throw new Error("Please fill all required fields and capture location");
      }

      // Community validation
      const popNum = parseInt(affectedPopulation);
      if (!popNum || popNum < VALIDATION_RULES.MIN_AFFECTED_POPULATION) {
        throw new Error(`This appears to be a personal issue. Help Requests are for COMMUNITY problems affecting minimum ${VALIDATION_RULES.MIN_AFFECTED_POPULATION} families.`);
      }

      if (!communityImpact || communityImpact.length < VALIDATION_RULES.MIN_COMMUNITY_IMPACT_LENGTH) {
        throw new Error("Please describe how this issue affects the COMMUNITY (not just you personally)");
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

      // Auto-suggest priority based on category
      const priority = selectedCategory?.priority || "MEDIUM";

      const payload = {
        state: profile.state,
        district: profile.district,
        mandal: mandal.trim(),
        village: village.trim(),
        category,
        title: title.trim(),
        description: description.trim(),
        affectedPopulation: popNum,
        communityImpact: communityImpact.trim(),
        priority,
        lat: location.lat,
        lng: location.lng,
        landmark: landmark.trim(),
        status: "PENDING",
        userId: user.$id,
        reporterName: user.name,
        reporterPhone: profile?.phone || "",
        reporterEmail: user.email || "",
        likes: 0,
        mediaURL,
        mediaType,
        mediaId,
      };

      const res = await databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
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

      return res;
    },

    onSuccess: (data) => {
      // Reset form
      setCategory("");
      setTitle("");
      setDescription("");
      setVillage("");
      setMandal("");
      setLandmark("");
      setAffectedPopulation("");
      setCommunityImpact("");
      setFile(null);
      setLocation(null);

      // Invalidate queries
      queryClient.invalidateQueries(["help-requests"]);
      queryClient.invalidateQueries(["my-help-requests"]);
      queryClient.invalidateQueries(["dashboard-help-requests"]);

      // 🔔 Notify MLAs in this district
      notifyMLAsAboutReport({
        district: profile.district,
        type: "HELP_REQUEST",
        title: `New Help Request: ${title}`,
        message: `${user.name} reported a ${category} issue in ${village}, ${mandal}, ${profile.district}. Affected population: ${affectedPopulation} families.`,
        reportId: data.$id,
        reporterName: user.name,
      });

      alert("✅ Help Request submitted successfully!");

      if (typeof onSubmitted === "function") onSubmitted();
    },

    onError: (err) => {
      alert(err.message);
    },
  });

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-6 space-y-4">
      <h2 className="text-xl font-bold">
        Create Help Request for {profile?.district}, {profile?.state}
      </h2>

      {/* Guidelines Popup */}
      {showGuidelines && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 relative">
          <button
            onClick={() => setShowGuidelines(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            ⚠️ IMPORTANT GUIDELINES
          </h3>

          <div className="space-y-2 text-sm">
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <p className="font-semibold text-green-800">✅ DO Report:</p>
              <ul className="text-green-700 ml-4 mt-1 space-y-1">
                <li>• Community infrastructure issues</li>
                <li>• Problems affecting 10+ families</li>
                <li>• Public services (water, electricity, etc.)</li>
              </ul>
            </div>

            <div className="bg-red-50 p-3 rounded border border-red-200">
              <p className="font-semibold text-red-800">❌ Do NOT Report:</p>
              <ul className="text-red-700 ml-4 mt-1 space-y-1">
                <li>• Personal problems (jobs, loans, documents)</li>
                <li>• Individual family issues</li>
                <li>• Neighbor disputes</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Village and Mandal (Manual Entry) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Village / Town <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g., Kavadiguda"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Mandal <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g., Secunderabad"
            value={mandal}
            onChange={(e) => setMandal(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          className="border p-3 rounded-xl w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Issue Category</option>
          {HELP_CATEGORIES_ARRAY.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
        {selectedCategory && (
          <p className="text-xs text-gray-500 mt-1">
            {selectedCategory.description}
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Brief summary of the issue"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          📝 Detailed Description <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Describe the issue in detail: severity, impact, specific problems..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          required
        />
      </div>

      {/* COMMUNITY VALIDATION FIELDS */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            How many people/families are affected? <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            placeholder="Minimum 10 people"
            value={affectedPopulation}
            onChange={(e) => setAffectedPopulation(e.target.value)}
            min={10}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least {VALIDATION_RULES.MIN_AFFECTED_POPULATION} people to qualify as community issue
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Describe Community Impact <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="How does this affect your village/colony? How many families? What problems are people facing? (minimum 20 characters)"
            value={communityImpact}
            onChange={(e) => setCommunityImpact(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {communityImpact.length}/{VALIDATION_RULES.MIN_COMMUNITY_IMPACT_LENGTH} characters minimum
          </p>
        </div>
      </div>

      {/* Landmark */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Landmark (Optional)
        </label>
        <Input
          placeholder="e.g., Near Primary School"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
        />
      </div>

      {/* Photo/Video */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Photo / Video (Optional)
        </label>
        <Input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* Location */}
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

      {/* Submit */}
      <Button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Help Request"
        )}
      </Button>
    </div>
  );
};

export default CreateHelpRequest;

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { ArrowLeft, MapPin, Users, Calendar, MessageSquare, User } from "lucide-react";
import { HELP_CATEGORIES_ARRAY } from "@/constants/helpRequestConstants";

const HelpRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch help request
  const { data: request, isLoading: loadingRequest } = useQuery({
    queryKey: ["help-request", id],
    queryFn: async () => {
      return databases.getDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
        id
      );
    },
  });

  // Fetch MLA responses
  const { data: responses = [], isLoading: loadingResponses } = useQuery({
    queryKey: ["mla-help-responses", id],
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_MLA_HELP_RESPONSES_COLLECTION_ID,
        [Query.equal("helpRequestId", id), Query.orderDesc("$createdAt")]
      );
      return res.documents;
    },
  });

  if (loadingRequest || loadingResponses) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
      </div>
    );
  }

  if (!request) return null;

  const categoryInfo = HELP_CATEGORIES_ARRAY.find(
    (cat) => cat.value === request.category
  );

  const statusColors = {
    PENDING: "bg-orange-500 text-white",
    ACKNOWLEDGED: "bg-cyan-500 text-white",
    IN_PROGRESS: "bg-orange-400 text-white",
    RESOLVED: "bg-emerald-500 text-white",
    REJECTED: "bg-rose-500 text-white",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Back</span>
      </button>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{categoryInfo?.icon || "⚠️"}</span>
              <div>
                <p className="text-sm font-medium text-emerald-100">
                  {categoryInfo?.label || request.category}
                </p>
                <h1 className="text-2xl font-bold">{request.title}</h1>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[request.status] || statusColors.PENDING
                }`}
            >
              {request.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Location & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-900">
                  {request.village}, {request.mandal}
                </p>
                <p className="text-sm text-gray-600">{request.district}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">People Affected</p>
                <p className="font-semibold text-gray-900">
                  {request.affectedPopulation} people
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Reported On</p>
                <p className="font-semibold text-gray-900">
                  {new Date(request.$createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{request.description}</p>
          </div>

          {/* Community Impact */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-900 mb-2">
              Community Impact
            </h3>
            <p className="text-emerald-800 leading-relaxed">
              {request.communityImpact}
            </p>
          </div>

          {/* Media */}
          {request.mediaURL && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Photo Evidence</h3>
              {request.mediaType === "VIDEO" ? (
                <video
                  src={request.mediaURL}
                  controls
                  className="w-full rounded-lg border border-gray-200"
                />
              ) : (
                <img
                  src={request.mediaURL}
                  alt="Issue"
                  className="w-full rounded-lg border border-gray-200"
                />
              )}
            </div>
          )}

          {/* Reporter Info */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Reported by</p>
              <p className="font-semibold text-gray-900">
                {request.reporterName}
              </p>
              {request.reporterPhone && (
                <p className="text-sm text-gray-600">
                  {request.reporterPhone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MLA Responses */}
      {responses.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-purple-50 border-b border-purple-200 p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-gray-900">
                MLA Responses ({responses.length})
              </h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {responses.map((response) => (
              <div key={response.$id} className="p-6">
                {/* Response Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {response.mlaName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {response.mlaName}
                      </p>
                      <p className="text-sm text-gray-600">
                        MLA, {response.mlaConstituency}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[response.responseType] ||
                        statusColors.PENDING
                        }`}
                    >
                      {response.responseType}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(response.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Response Message */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                  <p className="text-gray-800 leading-relaxed">
                    {response.message}
                  </p>
                </div>

                {/* Action Taken */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Action Taken:
                  </p>
                  <p className="text-sm text-gray-600">
                    {response.actionTaken}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {response.estimatedDays && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Expected in {response.estimatedDays} days
                      </span>
                    </div>
                  )}
                  {response.followUpRequired && (
                    <div className="flex items-center gap-1 text-purple-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>Follow-up planned</span>
                    </div>
                  )}
                </div>

                {/* Follow-up Notes */}
                {response.followUpNotes && (
                  <div className="mt-3 bg-purple-50 border border-purple-200 rounded p-3">
                    <p className="text-sm font-semibold text-purple-900 mb-1">
                      Follow-up Notes:
                    </p>
                    <p className="text-sm text-purple-800">
                      {response.followUpNotes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Responses */}
      {responses.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No MLA responses yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Your MLA will respond to this request soon
          </p>
        </div>
      )}
    </div>
  );
};

export default HelpRequestDetails;

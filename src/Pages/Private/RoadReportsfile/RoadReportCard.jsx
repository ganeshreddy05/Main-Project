import { databases } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";

const RoadReportCard = ({ report }) => {
  const { user } = useAuth();

  const likeReport = async () => {
    if (report.likedBy.includes(user.$id)) return;

    await databases.updateDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
      report.$id,
      {
        likes: report.likes + 1,
        likedBy: [...report.likedBy, user.$id],
      }
    );
  };

  return (
    <div className="bg-indigo-50 p-4 rounded-xl shadow">
      <p><b>{report.fromPlace}</b> → {report.toPlace}</p>
      <p>Condition: {report.condition}</p>
      <p>Landmark: {report.landmark}</p>

      {report.mediaURL && (
        <img src={report.mediaURL} className="rounded-lg mt-2" />
      )}

      <button onClick={likeReport}>
        ❤️ {report.likes}
      </button>
    </div>
  );
};

export default RoadReportCard;

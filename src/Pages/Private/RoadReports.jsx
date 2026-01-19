import RoadReportList from "./RoadReportList";
import CreateRoadReport from "./CreateRoadReport";

const RoadReports = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-2">
        <RoadReportList />
      </div>

      {/* RIGHT */}
      <div>
        <CreateRoadReport />
      </div>
    </div>
  );
};

export default RoadReports;

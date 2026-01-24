import CreateRoadReport from "./createRoadReportCard";
import RoadReportList from "./RoadReportList";

const RoadReports = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <RoadReportList />
      <CreateRoadReport />
    </div>
  );
};

export default RoadReports;

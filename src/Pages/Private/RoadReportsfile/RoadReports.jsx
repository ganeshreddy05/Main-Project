import { useState } from "react";
import statesData from "@/states/states.js";

import CreateRoadReport from "./CreateRoadReport";


const RoadReports = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Road Reports</h1>

      {/* STATES */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Select State</h2>

        <div className="grid grid-cols-3 gap-4">
          {Object.keys(statesData).map((state) => (
            <button
              key={state}
              onClick={() => {
                setSelectedState(state);
                setSelectedDistrict("");
              }}
              className={`p-3 rounded-xl transition font-medium ${
                selectedState === state
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-100 hover:bg-indigo-200"
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* DISTRICTS */}
      {selectedState && (
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Select District</h2>

          <div className="grid grid-cols-4 gap-4">
            {statesData[selectedState].map((district) => (
              <button
                key={district}
                onClick={() => setSelectedDistrict(district)}
                className={`p-3 rounded-xl transition font-medium ${
                  selectedDistrict === district
                    ? "bg-green-600 text-white"
                    : "bg-green-100 hover:bg-green-200"
                }`}
              >
                {district}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FORM */}
      {selectedDistrict && (
        <CreateRoadReport
          state={selectedState}
          district={selectedDistrict}
        />
      )}

    </div>
  );
};

export default RoadReports;

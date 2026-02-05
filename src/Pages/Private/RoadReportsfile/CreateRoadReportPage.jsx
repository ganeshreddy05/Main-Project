import { useState } from "react";
import CreateRoadReport from "./CreateRoadReport";
import { statesData } from "@/states/states";
import { useAuth } from "@/context/useAuth";

const CreateRoadReportPage = () => {
    const { profile } = useAuth();
    const [state, setState] = useState(profile?.state || "");
    const [district, setDistrict] = useState(profile?.district || "");

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Report Road Condition</h1>

            {/* STATE SELECTOR */}
            <div className="bg-white p-5 rounded-2xl shadow">
                <h2 className="font-semibold mb-3">Select State</h2>
                <div className="grid grid-cols-3 gap-4">
                    {Object.keys(statesData).map((s) => (
                        <button
                            key={s}
                            onClick={() => {
                                setState(s);
                                setDistrict("");
                            }}
                            className={`p-3 rounded-xl transition font-medium ${state === s
                                ? "bg-indigo-600 text-white"
                                : "bg-indigo-100 hover:bg-indigo-200"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* DISTRICT SELECTOR */}
            {state && (
                <div className="bg-white p-5 rounded-2xl shadow">
                    <h2 className="font-semibold mb-3">Select District</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {statesData[state].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDistrict(d)}
                                className={`p-3 rounded-xl transition font-medium ${district === d
                                    ? "bg-green-600 text-white"
                                    : "bg-green-100 hover:bg-green-200"
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* FORM */}
            {district && <CreateRoadReport state={state} district={district} />}
        </div>
    );
};

export default CreateRoadReportPage;

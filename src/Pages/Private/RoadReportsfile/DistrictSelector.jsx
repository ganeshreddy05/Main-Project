const districts = ["Hyderabad", "Kurnool", "Guntur", "Warangal", "Nellore"];

const DistrictSelector = ({ selected, onSelect }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="font-bold mb-3">Select District</h2>

      <div className="grid grid-cols-2 gap-3">
        {districts.map((d) => (
          <button
            key={d}
            onClick={() => onSelect(d)}
            className={`p-3 rounded-xl text-white ${
              selected === d ? "bg-indigo-600" : "bg-indigo-400"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DistrictSelector;

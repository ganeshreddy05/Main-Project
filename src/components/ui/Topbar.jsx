import { Menu } from "lucide-react";

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="flex items-center gap-4 p-4 border-b bg-white">
      <button onClick={onMenuClick}>
        <Menu />
      </button>

      <h1 className="text-xl font-bold">Dashboard</h1>
    </header>
  );
};


export default Topbar;

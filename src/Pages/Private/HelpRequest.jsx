import CreateHelpRequest from "./CreateHelpRequest";
import HelpRequestList from "./HelpRequestList";

const HelpRequest = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left: Create own request */}
      <CreateHelpRequest />

      {/* Right: Other users requests */}
      <HelpRequestList />
    </div>
  );
};

export default HelpRequest;

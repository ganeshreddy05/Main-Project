import { useContext } from "react";
import CityContext from "./CityContext";

const useCity = () => {
  const context = useContext(CityContext);

  if (!context) {
    throw new Error("useCity must be used inside CityProvider");
  }

  return context;
};

export default useCity;

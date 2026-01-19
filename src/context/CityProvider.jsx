import { useEffect, useState } from "react";
import CityContext from "./CityContext";

const CityProvider = ({ children }) => {
  const [city, setCity] = useState(null);

  
  useEffect(() => {
    const savedCity = localStorage.getItem("city");
    if (savedCity) {
      setCity(savedCity);
    }
  }, []);

  const updateCity = (newCity) => {
    setCity(newCity);
    localStorage.setItem("city", newCity);
  };

  return (
    <CityContext.Provider value={{ city, updateCity }}>
      {children}
    </CityContext.Provider>
  );
};

export default CityProvider;

import React, { useState } from "react";
import "./App.css";
import SearchAppBar from "./components/SearchAppBar/SearchAppBar";
import ShowWindInfo from "./components/ShowWindInfo/ShowWindInfo";
import ShowCityInfo from "./components/ShowCityInfo/ShowCityInfo";
import ICityOption from "./interfaces/ICityOption";

function App() {
  const [currentCityData, setCurrentCityData] = useState<ICityOption>(); 

  return (
    <>
      <SearchAppBar onCityChange={setCurrentCityData} />
      <ShowCityInfo cityName={currentCityData?.cityData?.cityName} />
      <ShowWindInfo windSpeed={currentCityData?.cityData?.windSpeed} />
    </>
  );
}

export default App;

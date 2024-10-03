import React, { useState } from "react";
import "./App.css";
import SearchAppBar from "./components/SearchAppBar/SearchAppBar";
import ShowWindInfo from "./components/ShowWindInfo/ShowWindInfo";
import ShowCityInfo from "./components/ShowCityInfo/ShowCityInfo";
import ICityOption from "./interfaces/ICityOption";
import ShowErrorMessage from "./components/ShowErrorMessage/ShowErrorMessage";

function App() {
  const [currentCityData, setCurrentCityData] = useState<ICityOption>();
  const [error, setError] = useState<Error>();

  if (error) {
    return (
      <>
        <SearchAppBar onCityChange={setCurrentCityData} onError={setError} />
        <ShowErrorMessage />
      </>
    );
  } else {
    return (
      <>
        <SearchAppBar onCityChange={setCurrentCityData} onError={setError} />
        <ShowCityInfo cityName={currentCityData?.cityData?.cityName} />
        <ShowWindInfo windSpeed={currentCityData?.cityData?.windSpeed} />
      </>
    );
  }
}

export default App;

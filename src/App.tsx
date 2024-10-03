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

  const mainContent = (error?: Error) => {
    if (error) {
      return <ShowErrorMessage />;
    } else {
      return (
        <>
          <ShowCityInfo cityName={currentCityData?.cityData?.cityName} />
          <ShowWindInfo windSpeed={currentCityData?.cityData?.windSpeed} />
        </>
      );
    }
  };

  return (
    <>
      <SearchAppBar onCityChange={setCurrentCityData} onError={setError} />
      {mainContent(error)}
    </>
  );
}

export default App;

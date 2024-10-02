import React, { useEffect, useState } from "react";
import "./App.css";
import SearchAppBar from "./components/AppBar/AppBar";
import ShowWindInfo from "./components/ShowWindInfo/ShowWindInfo";
import ShowCityInfo from "./components/ShowCityInfo/ShowCityInfo";

function App() {
  const [currentCity, setCurrentCity] = useState("");
  const [currentWindSpeed, setCurrentWindSpeed] = useState();

  useEffect(() => {
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${currentCity}&count=1&language=ru&format=json`
    )
      .then((data) => data.json())
      .then((data) => {
        const latitude = data.results?.[0]?.latitude;
        const longitude = data.results?.[0]?.longitude;
        console.log("latitude", latitude);
        console.log("longitude", longitude);

        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=wind_speed_10m&forecast_days=0`
        )
          .then((data) => data.json())
          .then((data) => {
            setCurrentWindSpeed(data?.current?.wind_speed_10m || 0);
          });

        return { latitude: latitude, longitude: longitude };
      });
  }, [currentCity]);

  return (
    <>
      <SearchAppBar onSearch={setCurrentCity} />
      <ShowCityInfo cityName={currentCity} />
      <ShowWindInfo windSpeed={currentWindSpeed} />
    </>
  );
}

export default App;

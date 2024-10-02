import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { SearchStyled } from "../Styled/SearchStyled/SearchStyled";
import { SearchIconWrapperStyled } from "../Styled/SearchIconWrapperStyled/SearchIconWrapperStyled";
import SearchAppBarTitle from "./SearchAppBarTitle/SearchAppBarTitle";
import SearchAppBarAutocomplete from "./SearchAppBarAutocomplete/SearchAppBarAutocomplete";
import ICityOption from "../../interfaces/ICityOption";

function SearchAppBar({ onCityChange }: { onCityChange: Function }) {
  const [loading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState<string>("");
  const [cityOptions, setCityOptions] = useState<ICityOption[]>([]);

  useEffect(() => {
    if (!currentCity) return;

    setLoading(true);
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${currentCity}&count=100&language=ru&format=json`
    )
      .then((data) => data.json())
      .then((data) => {
        const cityResults = data?.results || [];
        const fetchWindSpeedPromises = cityResults.map((result: any) => {
          const { latitude, longitude } = result;
          return fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=wind_speed_10m&forecast_days=0`
          )
            .then((response) => response.json())
            .then((forecastData) => {
              const windSpeed = forecastData.current?.wind_speed_10m || "н/д";
              return {
                label: `${result.country ? result.country + ", " : ""}${
                  result.admin1 ? result.admin1 + ", " : ""
                }${result.admin2 ? result.admin2 + ", " : ""}${
                  result.admin3 ? result.admin3 + ", " : ""
                }${result.admin4 ? result.admin4 + ", " : ""}${
                  result.name
                } (Скорость ветра: ${windSpeed} км/ч)`,
                value: result.name,
                cityData: {
                  cityName: result.name,
                  windSpeed: windSpeed,
                },
                key: result?.id,
              };
            });
        });

        return Promise.all(fetchWindSpeedPromises);
      })
      .then((enrichedCityOptions) => {
        setCityOptions(enrichedCityOptions);
      })
      .catch((error) => {
        console.error("Ошибка получения данных:", error);
      })
      .finally(() => setLoading(false));
  }, [currentCity]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <SearchAppBarTitle title="Поиск города:" />
          <SearchStyled sx={{ flexGrow: 1 }}>
            <SearchIconWrapperStyled>
              <SearchIcon />
            </SearchIconWrapperStyled>
            <SearchAppBarAutocomplete
              options={cityOptions}
              loading={loading}
              onChange={(event, value: ICityOption, reason) => {
                if (reason === "selectOption") {
                  onCityChange(value ? value : "");
                }
              }}
              onInputChange={(event, value, reason) => setCurrentCity(value)}
            />
          </SearchStyled>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SearchAppBar;

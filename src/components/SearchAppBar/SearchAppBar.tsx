import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import { useEffect, useState } from "react";
import { SearchStyled } from "../Styled/SearchStyled/SearchStyled";
import { SearchIconWrapperStyled } from "../Styled/SearchIconWrapperStyled/SearchIconWrapperStyled";
import { InputTextFieldStyled } from "../Styled/InputTextFieldStyled/InputTextFieldStyled";
import SearchAppBarTitle from "./SearchAppBarTitle/SearchAppBarTitle";

function SearchAppBar({ onSearch }: { onSearch: Function }) {
  const [loading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState<any>();
  const [cityOptions, setCityOptions] = useState<any[]>([]);

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
                  latitude: result.latitude,
                  longitude: result.longitude,
                  label: result.name,
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
            <Autocomplete
              disablePortal
              options={cityOptions}
              loading={loading}
              loadingText="Идет загузка…"
              filterOptions={(x) => x}
              getOptionKey={(value) => value.key}
              noOptionsText="Нет городов по вашему запросу"
              renderInput={(params) => (
                <InputTextFieldStyled
                  placeholder="Начните вводить город или населенный пункт…"
                  {...params}
                />
              )}
              onChange={(event, value: any, reason) => {
                if (reason === "selectOption") {
                  onSearch(value ? value : "");
                }
              }}
              onInputChange={(event, value, reason) => {
                console.log(value);
                setCurrentCity(value);
              }}
            />
          </SearchStyled>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SearchAppBar;

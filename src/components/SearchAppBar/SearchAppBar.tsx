import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useMemo, useState } from "react";
import { SearchStyled } from "../Styled/SearchStyled/SearchStyled";
import { SearchIconWrapperStyled } from "../Styled/SearchIconWrapperStyled/SearchIconWrapperStyled";
import SearchAppBarTitle from "./SearchAppBarTitle/SearchAppBarTitle";
import SearchAppBarAutocomplete from "./SearchAppBarAutocomplete/SearchAppBarAutocomplete";
import ICityOption from "../../interfaces/ICityOption";
import useDebounce from "../../hooks/useDebounce";
import {
  BASE_GEOCODING_API_URL,
  BASE_METEO_API_URL,
} from "../../constants/baseURLs";
import {
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from "@mui/material/Autocomplete/Autocomplete";

function getLabel(result: any, windSpeed: string) {
  const parts = [
    result.country,
    result.admin1,
    result.admin2,
    result.admin3,
    result.admin4,
    result.name,
  ].filter(Boolean);
  return `${parts.join(", ")} (Скорость ветра: ${windSpeed} км/ч)`;
}

function getCitiesData(query: string) {
  return fetch(
    `${BASE_GEOCODING_API_URL}/search?name=${query}&count=100&language=ru&format=json`
  )
    .then((response) => response.json())
    .then((data) => {
      const cityResults = data?.results || [];
      const fetchWindSpeedPromises = cityResults.map((result: any) => {
        const { latitude, longitude } = result;
        return fetch(
          `${BASE_METEO_API_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=wind_speed_10m&forecast_days=0`
        )
          .then((response) => response.json())
          .then((forecastData) => {
            const windSpeed = forecastData.current?.wind_speed_10m || "н/д";
            return {
              label: getLabel(result, windSpeed),
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
    .catch((error) => Promise.reject(error));
}

function SearchAppBar({ onCityChange }: { onCityChange: Function }) {
  const [loading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState<string>("");
  const [cityOptions, setCityOptions] = useState<ICityOption[]>([]);

  const debouncedCurrentCity = useDebounce(currentCity, 500);

  const memoizedCityOptions = useMemo(() => cityOptions, [cityOptions]);

  function onCityOptionChange(
    event: React.SyntheticEvent<Element, Event>,
    value: ICityOption,
    reason: AutocompleteChangeReason
  ) {
    if (reason === "selectOption") {
      onCityChange(value);
    }
  }

  function onAutocompleteInputChange(
    event: React.SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) {
    if (value) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    setCurrentCity(value);
  }

  useEffect(() => {
    if (!debouncedCurrentCity) return;

    setLoading(true);
    getCitiesData(debouncedCurrentCity)
      .then((enrichedCityOptions) => {
        setCityOptions(enrichedCityOptions);
      })
      .catch((error) => {
        console.error("Ошибка получения данных:", error);
      })
      .finally(() => setLoading(false));
  }, [debouncedCurrentCity]);

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
              options={memoizedCityOptions}
              loading={loading}
              onChange={onCityOptionChange}
              onInputChange={onAutocompleteInputChange}
            />
          </SearchStyled>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SearchAppBar;

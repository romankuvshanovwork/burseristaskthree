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
import useDebounce from "../../hooks/useDebounce";
import {
  BASE_GEOCODING_API_URL,
  BASE_METEO_API_URL,
} from "../../constants/baseURLs";
import {
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from "@mui/material/Autocomplete/Autocomplete";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

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
  return axios
    .get(
      `${BASE_GEOCODING_API_URL}/search?name=${query}&count=100&language=ru&format=json`
    )
    .then((response) => {
      const cityResults = response.data?.results || [];

      const fetchWindSpeedPromises = cityResults.map((result: any) => {
        const { latitude, longitude } = result;

        return axios
          .get(
            `${BASE_METEO_API_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=wind_speed_10m&forecast_days=0`
          )
          .then((response) => {
            const windSpeed = response.data.current?.wind_speed_10m || "н/д";

            return {
              label: getLabel(result, windSpeed),
              value: result.name,
              cityData: {
                cityName: result.name,
                windSpeed: windSpeed,
              },
              key: result?.id,
            };
          })
          .catch((error) => {
            throw error;
          });
      });

      return Promise.all(fetchWindSpeedPromises);
    })
    .catch((error) => {
      throw error;
    });
}

async function getCitiesDataAsync(query: string) {
  const response = await axios.get(
    `${BASE_GEOCODING_API_URL}/search?name=${query}&count=100&language=ru&format=json`
  );
  const cityResults = response.data?.results || [];

  return await Promise.all(
    cityResults.map(async (cityResult: any) => {
      const { latitude, longitude } = cityResult;
      const response = await axios.get(
        `${BASE_METEO_API_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=wind_speed_10m&forecast_days=0`
      );
      const windSpeed = response.data.current?.wind_speed_10m || "н/д";

      return {
        label: getLabel(cityResult, windSpeed),
        value: cityResult.name,
        cityData: {
          cityName: cityResult.name,
          windSpeed: windSpeed,
        },
        key: cityResult?.id,
      };
    })
  );
}

function SearchAppBar({
  onCityChange,
  onError,
}: {
  onCityChange: Function;
  onError: Function;
}) {
  const [searchValueChanged, setSearchValueChanged] = useState(false);
  const [currentCity, setCurrentCity] = useState<string>("");

  const debouncedCurrentCity = useDebounce(currentCity, 500);

  const {
    data = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["cities", debouncedCurrentCity],
    queryFn: () => getCitiesData(debouncedCurrentCity),
    enabled: !!debouncedCurrentCity,
    staleTime: 1 * (60 * 1000),
    gcTime: 5 * (60 * 1000),
  });

  useEffect(() => {
    onError(error);
  }, [error, onError]);

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
      setSearchValueChanged(true);
    } else {
      setSearchValueChanged(false);
    }
    setCurrentCity(value);
  }

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
              options={data}
              loading={isLoading || searchValueChanged}
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

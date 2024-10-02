import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import TextField from "@mui/material/TextField/TextField";
import { useEffect, useState } from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: "25px",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: "25px",
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      "&:focus": {
        width: "100%",
      },
    },
  },
}));

const StyledInputTextFieldBase = styled(TextField)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-root": {
    padding: theme.spacing(0.25, 0.25, 0.25, 0),
    color: "white",
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      "&:focus": {
        width: "100%",
      },
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiAutocomplete-endAdornment button": {
    color: "white",
  },
}));

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
        const cityResults = data.results || [];
        const fetchWindSpeedPromises = cityResults.map((result: any) => {
          const { latitude, longitude } = result;
          return fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=wind_speed_10m&forecast_days=0`
          )
            .then((response) => response.json())
            .then((forecastData) => {
              const windSpeed = forecastData.current?.wind_speed_10m || "н/д";
              return {
                label: `${result.country ? result.country + "," : ""} ${
                  result.admin1 ? result.admin1 + "," : ""
                } ${result.admin2 ? result.admin2 + "," : ""} ${
                  result.admin3 ? result.admin3 + "," : ""
                } ${result.admin4 ? result.admin4 + "," : ""} ${
                  result.name
                } (Скорость ветра: ${windSpeed} км/ч)`,
                value: {
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
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 0,
              whiteSpace: "nowrap",
              display: { xs: "none", sm: "block" },
            }}
          >
            Поиск города:
          </Typography>
          <Search sx={{ flexGrow: 1 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <Autocomplete
              disablePortal
              options={cityOptions}
              loading={loading}
              filterOptions={(x) => x}
              noOptionsText="Нет городов по вашему запросу"
              renderInput={(params) => (
                <StyledInputTextFieldBase
                  placeholder="Начните вводить город или населенный пункт…"
                  {...params}
                />
              )}
              onChange={(event, value: any, reason) => {
                if (reason === "selectOption") {
                  onSearch(value ? value : "");
                }
              }}
              onInputChange={(event, value, reason) => setCurrentCity(value)}
            />
            {/* <StyledInputBase
              placeholder="Начните вводить город или населенный пункт…"
              inputProps={{ "aria-label": "search" }}
              onChange={(event) => onSearch(event.target.value)}
            /> */}
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SearchAppBar;

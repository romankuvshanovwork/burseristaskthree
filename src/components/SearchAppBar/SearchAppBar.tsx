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
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from "@mui/material/Autocomplete/Autocomplete";
import { useQuery } from "@tanstack/react-query";
import { getCitiesData } from "./utils/searchAppBarUtils";

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

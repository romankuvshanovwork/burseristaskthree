import * as React from "react";
import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from "@mui/material/Autocomplete/Autocomplete";
import { InputTextFieldStyled } from "../../Styled/InputTextFieldStyled/InputTextFieldStyled";
import ICityOption from "../../../interfaces/ICityOption";

function SearchAppBarAutocomplete({
  options,
  loading,
  onChange,
  onInputChange,
}: {
  options: ICityOption[];
  loading: boolean;
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: any,
    reason: AutocompleteChangeReason
  ) => void;
  onInputChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => void;
}) {
  return (
    <Autocomplete
      disablePortal
      options={options}
      filterOptions={(x) => x}
      getOptionKey={(value) => value.key}
      noOptionsText="Нет городов по вашему запросу"
      loading={loading}
      loadingText="Идет загузка…"
      renderInput={(params) => (
        <InputTextFieldStyled
          {...params}
          placeholder="Начните вводить город или населенный пункт…"
        />
      )}
      onChange={onChange}
      onInputChange={onInputChange}
    />
  );
}

export default SearchAppBarAutocomplete;

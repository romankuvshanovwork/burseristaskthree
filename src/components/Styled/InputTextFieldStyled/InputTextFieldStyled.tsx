import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField/TextField";

export const InputTextFieldStyled = styled(TextField)(({ theme }) => ({
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

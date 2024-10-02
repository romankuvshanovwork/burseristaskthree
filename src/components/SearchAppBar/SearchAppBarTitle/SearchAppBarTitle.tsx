import { Typography } from "@mui/material";

function SearchAppBarTitle({ title = "Поиск города:" }: { title?: string }) {
  return (
    <Typography
      variant="h6"
      component="div"
      sx={{
        flexGrow: 0,
        whiteSpace: "nowrap",
        display: { xs: "none", sm: "block" },
      }}
    >
      {title}
    </Typography>
  );
}

export default SearchAppBarTitle;

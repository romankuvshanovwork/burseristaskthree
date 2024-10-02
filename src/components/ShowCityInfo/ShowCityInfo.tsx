import React from "react";
import Box from "@mui/material/Box/Box";
import { Typography } from "@mui/material";

function ShowCityInfo({ cityName = "" }: { cityName?: string }) {
  console.log(
    "1 'ShowCITYInfo' rendered at: ",
    new Date().toLocaleTimeString()
  );

  return (
    <Box sx={{ marginX: "25px", marginY: "20px" }}>
      <Typography>Город: {cityName ? cityName : "Пока не введен"}</Typography>
    </Box>
  );
}

export default ShowCityInfo;

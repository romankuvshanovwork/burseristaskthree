import React from "react";
import Box from "@mui/material/Box/Box";

function ShowCityInfo({ cityName = "" }: { cityName?: string }) {
  console.log("'1 ShowCITYInfo' rendered at: ", new Date().toLocaleTimeString());

  return (
    <Box sx={{ marginX: "25px", marginY: "20px" }}>
      <p>Город: {cityName}</p>
    </Box>
  );
}

export default ShowCityInfo;

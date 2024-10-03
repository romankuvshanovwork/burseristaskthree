import React, { memo } from "react";
import Box from "@mui/material/Box/Box";
import { Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function ShowCityInfo({ cityName = "" }: { cityName?: string }) {
  // Можно посмотреть когда компонент ре-рендериться, чтобы увидеть эффект мемоизации
  console.log(
    "1 'ShowCITYInfo' rendered at: ",
    new Date().toLocaleTimeString()
  );

  return (
    <Box sx={{ marginX: "25px", marginTop: "25px", marginBottom: "20px" }}>
      <Typography variant="h5" sx={{ display: "flex", columnGap: "15px" }}>
        <LocationOnIcon />
        Выбранный город (или населенный пункт):{" "}
        {cityName ? cityName : "Пока не введен"}
      </Typography>
    </Box>
  );
}

export default memo(ShowCityInfo);

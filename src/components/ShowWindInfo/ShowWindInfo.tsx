import React, { memo } from "react";
import Box from "@mui/material/Box/Box";
import { Typography } from "@mui/material";

function windMessage(windSpeed: number | undefined) {
  if (windSpeed) {
    return `${windSpeed} м/c`;
  } else {
    return `Нельзя отобразить для незаданного города`;
  }
}

function workersNeededMessage(windSpeed: number | undefined) {
  if (windSpeed) {
    return `${Math.ceil(windSpeed / 1)} человек`;
  } else {
    return `Нельзя отобразить для незаданного города`;
  }
}

function ShowWindInfo({ windSpeed }: { windSpeed?: number }) {
  console.log(
    "2 'ShowWINDInfo' rendered at: ",
    new Date().toLocaleTimeString()
  );

  return (
    <Box sx={{ marginX: "25px", marginY: "20px" }}>
      <Typography>Скорость ветра: {windMessage(windSpeed)}</Typography>
      <Typography>
        Человек, необходимых для поддержания скважины:{" "}
        {workersNeededMessage(windSpeed)}
      </Typography>
    </Box>
  );
}

export default memo(ShowWindInfo);

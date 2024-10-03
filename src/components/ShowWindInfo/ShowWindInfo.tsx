import React, { memo } from "react";
import Box from "@mui/material/Box/Box";
import { Typography } from "@mui/material";
import AirIcon from "@mui/icons-material/Air";
import PeopleIcon from "@mui/icons-material/People";

function windMessage(windSpeed: number | undefined) {
  if (windSpeed) {
    return `${windSpeed} м/c`;
  } else {
    return `Нельзя отобразить для незаданного города`;
  }
}

function workersNeededMessage(windSpeed: number | undefined) {
  if (windSpeed) {
    return `${Math.ceil(windSpeed / 1)}`;
  } else {
    return `Нельзя отобразить для незаданного города`;
  }
}

function ShowWindInfo({ windSpeed }: { windSpeed?: number }) {
  // Можно посмотреть когда компонент ре-рендериться, чтобы увидеть эффект мемоизации
  console.log(
    "2 'ShowWINDInfo' rendered at: ",
    new Date().toLocaleTimeString()
  );

  return (
    <Box sx={{ marginX: "25px", marginY: "20px" }}>
      <Typography sx={{ display: "flex", columnGap: "15px" }}>
        <AirIcon />
        Скорость ветра: {windMessage(windSpeed)}
      </Typography>
      <Typography sx={{ display: "flex", columnGap: "15px" }}>
        <PeopleIcon />
        Человек, необходимых для поддержания скважины:{" "}
        {workersNeededMessage(windSpeed)}
      </Typography>
    </Box>
  );
}

export default memo(ShowWindInfo);

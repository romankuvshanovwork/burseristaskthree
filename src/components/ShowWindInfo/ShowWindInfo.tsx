import React, { memo } from "react";
import Box from "@mui/material/Box/Box";

function ShowWindInfo({ windSpeed = 5 }: { windSpeed?: number }) {
  console.log("'ShowWindInfo' rendered at: ", new Date().toLocaleTimeString());

  return (
    <Box sx={{ marginX: "25px", marginY: "20px" }}>
      <p>Скорость ветра в городе Тюмень: 5 м/c</p>
      <p>
        Человек необходимых для поддержания скважины в городе Тюмень: 5 человек
      </p>
    </Box>
  );
}

export default memo(ShowWindInfo);

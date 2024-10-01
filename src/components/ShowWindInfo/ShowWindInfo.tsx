import React, { memo } from "react";
import Box from "@mui/material/Box/Box";

function ShowWindInfo({ windSpeed = 5 }: { windSpeed?: number }) {
  console.log("'2 ShowWINDInfo' rendered at: ", new Date().toLocaleTimeString());

  return (
    <Box sx={{ marginX: "25px", marginY: "20px" }}>
      <p>Скорость ветра: {windSpeed} м/c</p>
      <p>
        Человек, необходимых для поддержания скважины:{" "}
        {Math.ceil(windSpeed / 1)} человек
      </p>
    </Box>
  );
}

export default memo(ShowWindInfo);

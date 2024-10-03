import React from "react";
import Box from "@mui/material/Box/Box";
import { Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

function ShowErrorMessage() {
  return (
    <Box sx={{ marginX: "25px", marginY: "20px" }}>
      <Typography color="error" sx={{ display: "flex", columnGap: "15px" }}>
        <ErrorIcon color="error" />
        Произошла ошибка. Пожалуйста, попробуйте ещё раз позднее. Или проверьте
        своё сетевое соединение.
      </Typography>
    </Box>
  );
}

export default ShowErrorMessage;

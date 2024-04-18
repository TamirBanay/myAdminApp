import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function BasicSpeedDial() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <Box sx={{ position: "fixed" }}>
      <SpeedDial
        color="red"
        onClick={scrollToTop}
        ariaLabel="SpeedDial basic example"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          opacity: 0.6,
          "&:hover": {
            opacity: 0.6,
          },
        }}
        icon={<KeyboardArrowUpIcon fontSize="large" />}
      ></SpeedDial>
    </Box>
  );
}

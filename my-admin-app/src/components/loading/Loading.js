import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Button loading variant="soft">
        Soft
      </Button>
    </Box>
  );
}

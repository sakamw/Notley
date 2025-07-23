import React from "react";
import { Box } from "@mui/material";

const CardsContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
      justifyContent: { xs: "center", sm: "flex-start" },
      mb: 3,
      width: "100%",
      maxWidth: "100vw",
      boxSizing: "border-box",
      overflowX: "hidden",
    }}
  >
    {children}
  </Box>
);

export default CardsContainer;

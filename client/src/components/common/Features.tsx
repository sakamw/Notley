import { Box, Typography, Container, Paper, Stack } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SearchIcon from "@mui/icons-material/Search";
import CloudSyncIcon from "@mui/icons-material/CloudSync";

function Features() {
  return (
    <Box
      id="features"
      py={10}
      bgcolor="background.default"
      sx={{ scrollMarginTop: { xs: "5.6rem", sm: "6.4rem" } }}
    >
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" fontWeight={700} mb={6}>
          Features
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="stretch"
          justifyContent="center"
        >
          <Paper elevation={2} sx={{ p: 4, textAlign: "center", flex: 1 }}>
            <NoteAddIcon
              sx={{ fontSize: 48, mb: 2, color: "secondary.main" }}
            />
            <Typography variant="h6" fontWeight={600} mb={1}>
              Smart Note Creation
            </Typography>
            <Typography sx={{ color: "#444444" }}>
              Quickly capture ideas, tasks, and inspiration with rich formatting
              and organization tools.
            </Typography>
          </Paper>
          <Paper elevation={2} sx={{ p: 4, textAlign: "center", flex: 1 }}>
            <SearchIcon sx={{ fontSize: 48, mb: 2, color: "success.main" }} />
            <Typography variant="h6" fontWeight={600} mb={1}>
              Instant Search
            </Typography>
            <Typography sx={{ color: "#444444" }}>
              Find any note instantly with powerful full-text search and smart
              filters.
            </Typography>
          </Paper>
          <Paper elevation={2} sx={{ p: 4, textAlign: "center", flex: 1 }}>
            <CloudSyncIcon
              sx={{ fontSize: 48, mb: 2, color: "warning.main" }}
            />
            <Typography variant="h6" fontWeight={600} mb={1}>
              Cloud Sync
            </Typography>
            <Typography sx={{ color: "#444444" }}>
              Access your notes anywhere, anytime, with secure cloud
              synchronization across devices.
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

export default Features;

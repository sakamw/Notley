import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useSidebar } from "../store/useStore";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";

interface Note {
  id: string;
  title: string;
  synopsis: string;
  tags: string[];
}

const TagNotes = () => {
  const { sidebarCollapsed } = useSidebar();
  const sidebarWidth = sidebarCollapsed ? 64 : 220;
  const { tag } = useParams<{ tag: string }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get("/entries");
        setNotes(
          res.data.filter((note: Note) =>
            note.tags
              .map((t) => t.trim().toLowerCase())
              .includes((tag || "").toLowerCase()),
          ),
        );
      } catch {
        setError("Failed to fetch notes.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [tag]);

  return (
    <Box
      sx={{
        mt: { xs: "56px", sm: "56px" },
        ml: { xs: 0, sm: `${sidebarWidth}px` },
        p: { xs: 1, sm: 3 },
        minHeight: "calc(100vh - 56px)",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={2} textAlign="center">
        Notes tagged: <span style={{ color: "#3d82f5" }}>#{tag}</span>
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%", maxWidth: 600 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <CircularProgress sx={{ mt: 8 }} />
      ) : notes.length === 0 ? (
        <Paper
          sx={{
            p: { xs: 2, sm: 4 },
            textAlign: "center",
            maxWidth: 500,
            borderRadius: 3,
            width: "100%",
          }}
        >
          <Typography variant="h6" color="text.secondary" mb={2}>
            No notes with this tag
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Notes you tag as <b>#{tag}</b> will appear here for quick reference.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Stack
            spacing={3}
            width="100%"
            maxWidth={600}
            direction="column"
            alignItems="center"
          >
            {notes.map((note) => (
              <Paper
                key={note.id}
                sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, width: "100%" }}
              >
                <Typography variant="h6">{note.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {note.synopsis}
                </Typography>
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                  {note.tags.map((t) => (
                    <Typography
                      key={t}
                      variant="caption"
                      sx={{
                        bgcolor: "#e3e8",
                        px: 1,
                        borderRadius: 1,
                        mb: 0.5,
                      }}
                    >
                      #{t}
                    </Typography>
                  ))}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default TagNotes;

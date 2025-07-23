import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  useTheme,
} from "@mui/material";
import ReactMarkdown from "react-markdown";

interface Note {
  title: string;
  synopsis: string;
  content: string;
  tags: string[];
}

const NoteView = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosInstance
      .get(`/entries/${id}`)
      .then((res) => setNote(res.data))
      .catch(() => setError("Failed to load note."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error || !note) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
      >
        <Typography color="error">{error || "Note not found."}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: "56px", display: "flex", justifyContent: "center", p: 2 }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          maxWidth: 700,
          width: "100%",
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={2}>
          {note.title}
        </Typography>
        {note.synopsis && (
          <Typography variant="subtitle1" color="text.secondary" mb={2}>
            {note.synopsis}
          </Typography>
        )}
        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
          {note.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ bgcolor: "#3d82f5", color: "#fff" }}
            />
          ))}
        </Stack>
        <Box
          sx={{
            fontSize: 16,
            color: theme.palette.mode === "dark" ? "#e0e0e0" : "#232c34",
            lineHeight: 1.7,
            wordBreak: "break-word",
            "& h1": {
              fontSize: "2rem",
              fontWeight: 600,
              margin: "1.2em 0 0.6em 0",
            },
            "& h2": {
              fontSize: "1.5rem",
              fontWeight: 500,
              margin: "1em 0 0.5em 0",
            },
            "& h3": {
              fontSize: "1.2rem",
              fontWeight: 500,
              margin: "0.8em 0 0.4em 0",
            },
            "& p": { margin: "0.5em 0" },
            "& ul, & ol": { margin: "0.5em 0 0.5em 1.5em" },
            "& code": {
              background: "#232c34",
              color: "#f8f8f2",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 14,
            },
          }}
        >
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </Box>
      </Paper>
    </Box>
  );
};

export default NoteView;

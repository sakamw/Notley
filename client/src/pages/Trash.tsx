import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useSidebar } from "../store/useStore";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface Note {
  id: string;
  title: string;
  synopsis: string;
  isDeleted: boolean;
}

const Trash = () => {
  const { sidebarCollapsed } = useSidebar();
  const sidebarWidth = sidebarCollapsed ? 64 : 220;
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchTrashedNotes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/entries/trash");
      setDeletedNotes(res.data);
    } catch (e: unknown) {
      const err = e as AxiosError<{ message?: string }>;
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch trashed notes.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedNotes();
  }, []);

  const handleRestore = async (id: string) => {
    setError("");
    setRestoringId(id);
    try {
      await axiosInstance.patch(`/entries/trash/${id}/restore`);
      setDeletedNotes((prev) => prev.filter((note) => note.id !== id));
      toast.success("Note restored successfully");
    } catch (e: unknown) {
      const err = e as AxiosError<{ message?: string }>;
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to restore note.");
      }
    } finally {
      setRestoringId(null);
    }
  };

  const handleDeletePermanently = async (id: string) => {
    setError("");
    try {
      await axiosInstance.delete(`/entries/trash/${id}`);
      setDeletedNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (e) {
      const err = e as AxiosError<{ message?: string }>;
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to permanently delete note.");
      }
    }
  };

  return (
    <Box
      sx={{
        mt: "56px",
        ml: { xs: 0, sm: `${sidebarWidth}px` },
        p: { xs: 2, sm: 4 },
        minHeight: "calc(100vh - 56px)",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={2}>
        Trash
      </Typography>
      <Alert severity="warning" sx={{ mb: 4, maxWidth: 600 }}>
        Items in trash will be permanently deleted after 30 days.
      </Alert>
      {error && (
        <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <CircularProgress sx={{ mt: 8 }} />
      ) : deletedNotes.length === 0 ? (
        <Paper
          sx={{ p: 4, textAlign: "center", maxWidth: 500, borderRadius: 3 }}
        >
          <Typography variant="h6" color="text.secondary" mb={2}>
            Nothing to show here
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You have no deleted notes. Deleted notes will appear here for 30
            days before being permanently removed.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3} width="100%" maxWidth={600}>
          {deletedNotes.map((note) => (
            <Paper
              key={note.id}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">{note.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {note.synopsis}
              </Typography>
              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleRestore(note.id)}
                  disabled={restoringId === note.id}
                >
                  {restoringId === note.id ? "Restoring..." : "Restore"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeletePermanently(note.id)}
                  disabled={restoringId === note.id}
                >
                  Delete Permanently
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Trash;

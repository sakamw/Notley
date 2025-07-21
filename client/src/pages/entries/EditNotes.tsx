import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSidebar, useBookmarks, useAuth } from "../../store/useStore";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";

interface Note {
  id: string;
  title: string;
  synopsis: string;
  tags: string[];
  isDeleted: boolean;
}

const EditNotes = () => {
  const navigate = useNavigate();
  const { sidebarCollapsed } = useSidebar();
  const sidebarWidth = sidebarCollapsed ? 64 : 220;
  const { isAuthenticated, user } = useAuth();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const openDeleteDialog = (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };
  const confirmDelete = async () => {
    if (noteToDelete) {
      try {
        await axiosInstance.delete(`/entries/${noteToDelete}`);
        setNotes((prev) => prev.filter((note) => note.id !== noteToDelete));
        toast.success("Note deleted successfully");
      } catch {
        toast.error("Failed to delete note");
      }
      closeDeleteDialog();
    }
  };

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    try {
      await axiosInstance.patch(`/entries/trash/${id}/restore`);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      toast.success("Note restored successfully");
    } catch {
      toast.error("Failed to restore note");
    } finally {
      setRestoringId(null);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    axiosInstance
      .get("/entries")
      .then((res) => setNotes(res.data))
      .catch(() => setError("Failed to fetch notes."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "calc(100vh - 56px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "56px",
          ml: { xs: 0, sm: `${sidebarWidth}px` },
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        sx={{
          height: "calc(100vh - 56px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "56px",
          ml: { xs: 0, sm: `${sidebarWidth}px` },
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  if (notes.length === 0) {
    return (
      <Box
        sx={{
          height: "calc(100vh - 56px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: "56px",
          ml: { xs: 0, sm: `${sidebarWidth}px` },
        }}
      >
        <Typography variant="h5" color="text.secondary" mb={2}>
          Nothing to see here
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/notes/new")}
        >
          New note
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 3 },
        mt: "56px",
        ml: { xs: 0, sm: `${sidebarWidth}px` },
      }}
    >
      <Stack spacing={3}>
        {notes.map((note) => (
          <Paper
            key={note.id}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              position: "relative",
            }}
          >
            <Typography variant="h6">{note.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {note.synopsis}
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/edit-note/${note.id}`)}
                disabled={note.isDeleted}
              >
                Edit note
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => openDeleteDialog(note.id)}
                disabled={note.isDeleted}
              >
                Delete note
              </Button>
              {note.isDeleted && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleRestore(note.id)}
                  disabled={restoringId === note.id}
                >
                  {restoringId === note.id ? "Restoring..." : "Restore"}
                </Button>
              )}
              {/* Bookmark button */}
              {isAuthenticated && user && (
                <Tooltip
                  title={
                    isBookmarked(user.id.toString(), note.id.toString())
                      ? "Remove bookmark"
                      : "Bookmark"
                  }
                >
                  <IconButton
                    onClick={() =>
                      isBookmarked(user.id.toString(), note.id.toString())
                        ? removeBookmark(user.id.toString(), note.id.toString())
                        : addBookmark(user.id.toString(), note.id.toString())
                    }
                    color="primary"
                    sx={{ ml: 1 }}
                  >
                    {isBookmarked(user.id.toString(), note.id.toString()) ? (
                      <Bookmark />
                    ) : (
                      <BookmarkBorder />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Note?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this note? It will appear in the
            trash.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditNotes;

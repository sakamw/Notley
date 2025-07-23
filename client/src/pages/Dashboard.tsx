import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useSidebar } from "../store/useStore";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useBookmarks, useAuth } from "../store/useStore";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import NoteCard from "../components/dashboard/NoteCard";
import CardsContainer from "../components/dashboard/CardsContainer";
import DeleteNoteDialog from "../components/dashboard/DeleteNoteDialog";

interface Note {
  id: string;
  title: string;
  synopsis: string;
  tags: string[];
  pinned: boolean;
}

const Dashboard = () => {
  const { sidebarCollapsed } = useSidebar();
  const sidebarWidth = sidebarCollapsed ? 64 : 220;
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { user } = useAuth();
  const theme = useTheme();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

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
      setError("");
      try {
        await axiosInstance.delete(`/entries/${noteToDelete}`);
        setNotes((prev) => prev.filter((note) => note.id !== noteToDelete));
      } catch {
        // error handling
      }
      closeDeleteDialog();
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get("/entries");
        setNotes(res.data);
      } catch {
        setError("Failed to fetch notes.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Pin/unpin handler
  const handlePin = async (noteId: string, pinned: boolean) => {
    setError("");
    try {
      await axiosInstance.patch(`/entries/${noteId}/pin`, { pinned });
      setNotes((prev) =>
        prev.map((note) => (note.id === noteId ? { ...note, pinned } : note)),
      );
      if (pinned) {
        toast.success("Note pinned");
      } else {
        toast.info("Note unpinned");
      }
    } catch {
      // error handling
    }
  };

  const handleBookmark = (noteId: string, bookmarked: boolean) => {
    setError("");
    const userId = user?.id?.toString() || "guest";
    if (bookmarked) {
      addBookmark(userId, noteId);
      toast.success("Note bookmarked");
    } else {
      removeBookmark(userId, noteId);
      toast.info("Bookmark removed");
    }
  };

  // Split notes into pinned and unpinned
  const pinnedNotes = notes.filter((n) => n.pinned);
  const unpinnedNotes = notes.filter((n) => !n.pinned);

  // Handler wrappers for NoteCard
  const handleEdit = (noteId: string) => navigate(`/edit-note/${noteId}`);
  const handleReadMore = (noteId: string) => navigate(`/note/${noteId}`);
  const userId = user?.id?.toString() || "guest";

  return (
    <Box
      sx={{
        mt: { xs: "56px", sm: "56px" },
        ml: { xs: 0, sm: `${sidebarWidth}px` },
        p: { xs: 0, sm: 3 },
        minHeight: "calc(100vh - 56px)",
        bgcolor: "background.default",
        width: "100vw",
        maxWidth: "100vw",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
        sx={{ textAlign: "center", width: "100%" }}
      >
        Your Notes
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%", maxWidth: 600 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <CircularProgress sx={{ mt: 8 }} />
      ) : pinnedNotes.length === 0 && unpinnedNotes.length === 0 ? (
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            display: "flex",
            justifyContent: "center",
            mt: 2,
            px: { xs: 1, sm: 0 },
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          <Paper
            sx={{
              p: { xs: 1, sm: 2, md: 4 },
              textAlign: "center",
              mb: 4,
              maxWidth: 500,
              borderRadius: 3,
              width: "100%",
              boxSizing: "border-box",
              overflowX: "hidden",
            }}
          >
            <Typography variant="h6" color="text.secondary" mb={2}>
              You haven't created any notes yet!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
              Start capturing your thoughts, ideas, and plans. Your notes will
              appear here.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/notes/new"
              sx={{ mt: 3 }}
            >
              Create your first note
            </Button>
          </Paper>
        </Box>
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <>
              <Typography
                variant="h6"
                fontWeight={600}
                mb={2}
                sx={{ color: "#3d82f5" }}
              >
                Pinned
              </Typography>
              <CardsContainer>
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onPin={handlePin}
                    onBookmark={handleBookmark}
                    isBookmarked={(id) => isBookmarked(userId, id)}
                    onEdit={handleEdit}
                    onDelete={openDeleteDialog}
                    onReadMore={handleReadMore}
                    theme={theme}
                  />
                ))}
              </CardsContainer>
            </>
          )}

          {unpinnedNotes.length > 0 && (
            <>
              <Typography
                variant="h6"
                fontWeight={600}
                mb={2}
                sx={{ color: "#888" }}
              >
                Others
              </Typography>
              <CardsContainer>
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onPin={handlePin}
                    onBookmark={handleBookmark}
                    isBookmarked={(id) => isBookmarked(userId, id)}
                    onEdit={handleEdit}
                    onDelete={openDeleteDialog}
                    onReadMore={handleReadMore}
                    theme={theme}
                  />
                ))}
              </CardsContainer>
            </>
          )}
        </>
      )}

      <DeleteNoteDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default Dashboard;

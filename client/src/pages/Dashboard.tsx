import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useSidebar } from "../store/useStore";
import { PushPin, PushPinOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { useBookmarks, useAuth } from "../store/useStore";
import { toast } from "react-toastify";

interface Note {
  id: string;
  title: string;
  synopsis: string;
  tags: string[];
  pinned: boolean;
}

const CardsContainer = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
      justifyContent: "flex-start",
      mb: 3,
      width: "100%",
      maxWidth: "100%",
    }}
  >
    {children}
  </Box>
);

const Dashboard = () => {
  const { sidebarCollapsed } = useSidebar();
  const sidebarWidth = sidebarCollapsed ? 64 : 220;
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { user } = useAuth();

  // Dialog state for delete
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
      } catch (e) {
        console.log(e);
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
    } catch (e) {
      console.log(e);
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

  const NoteCard = ({ note }: { note: Note }) => (
    <Box
      sx={{
        width: { xs: "100%", sm: "48%", md: "24%" },
        minWidth: 320,
        maxWidth: 420,
        mb: 2,
        flexGrow: 1,
      }}
    >
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          position: "relative",
          width: "100%",
          minHeight: 220,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Header row: title + actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              pr: 1,
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {note.title}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title={note.pinned ? "Unpin note" : "Pin note"}>
              <IconButton
                size="small"
                onClick={() => handlePin(note.id, !note.pinned)}
                color="primary"
              >
                {note.pinned ? <PushPin /> : <PushPinOutlined />}
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                isBookmarked(user?.id?.toString() || "guest", note.id)
                  ? "Remove bookmark"
                  : "Bookmark"
              }
            >
              <IconButton
                size="small"
                onClick={() =>
                  isBookmarked(user?.id?.toString() || "guest", note.id)
                    ? handleBookmark(note.id, false)
                    : handleBookmark(note.id, true)
                }
                color="primary"
              >
                {isBookmarked(user?.id?.toString() || "guest", note.id) ? (
                  <Bookmark />
                ) : (
                  <BookmarkBorder />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            minHeight: 60,
          }}
        >
          {note.synopsis}
        </Typography>

        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
          {note.tags.map((tag) => (
            <Typography
              key={tag}
              variant="caption"
              sx={{
                bgcolor: "#e3e8f0",
                px: 1,
                borderRadius: 1,
                mb: 0.5,
              }}
            >
              #{tag}
            </Typography>
          ))}
        </Stack>

        <Stack direction="row" spacing={1} mt="auto">
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: "#2563eb",
              color: "#fff",
              "&:hover": { bgcolor: "#1741a6" },
            }}
            onClick={() => navigate(`/note/${note.id}`)}
          >
            Read More
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => navigate(`/edit-note/${note.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => openDeleteDialog(note.id)}
          >
            Delete
          </Button>
        </Stack>
      </Paper>
    </Box>
  );

  return (
    <Box
      sx={{
        mt: { xs: "56px", sm: "56px" },
        ml: { xs: 0, sm: `${sidebarWidth}px` },
        p: { xs: 1, sm: 3 },
        minHeight: "calc(100vh - 56px)",
        bgcolor: "background.default",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Paper
            sx={{
              p: { xs: 2, sm: 4 },
              textAlign: "center",
              mb: 4,
              maxWidth: 500,
              borderRadius: 3,
              width: "100%",
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
                  <NoteCard key={note.id} note={note} />
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
                  <NoteCard key={note.id} note={note} />
                ))}
              </CardsContainer>
            </>
          )}
        </>
      )}

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

export default Dashboard;

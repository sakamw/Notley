import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useSidebar, useBookmarks, useAuth } from "../store/useStore";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Note {
  id: string;
  title: string;
  synopsis: string;
  isBookmarked?: boolean;
}

const Bookmarks = () => {
  const { sidebarCollapsed } = useSidebar();
  const sidebarWidth = sidebarCollapsed ? 64 : 220;
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { user } = useAuth();
  const { bookmarks } = useBookmarks();
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get("/entries");
        const allNotes: Note[] = res.data;
        if (user) {
          const userBookmarks = bookmarks[user.id.toString()] || [];
          setBookmarkedNotes(
            allNotes.filter((note) => userBookmarks.includes(note.id)),
          );
        } else {
          setBookmarkedNotes([]);
        }
      } catch {
        setError("Failed to fetch notes.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [user, bookmarks]);

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
        Bookmarks
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%", maxWidth: 600 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <CircularProgress sx={{ mt: 8 }} />
      ) : bookmarkedNotes.length === 0 ? (
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
            No bookmarks yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Notes you bookmark will appear here for quick access.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3} width="100%" maxWidth={600} direction="column">
          {bookmarkedNotes.map((note) => (
            <Paper
              key={note.id}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                width: "100%",
                position: "relative",
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                <Tooltip
                  title={
                    isBookmarked(user?.id?.toString() || "guest", note.id)
                      ? "Remove bookmark"
                      : "Bookmark"
                  }
                >
                  <IconButton
                    onClick={() => {
                      if (
                        isBookmarked(user?.id?.toString() || "guest", note.id)
                      ) {
                        removeBookmark(
                          user?.id?.toString() || "guest",
                          note.id,
                        );
                        toast.info("Bookmark removed");
                        navigate("/dashboard");
                      } else {
                        addBookmark(user?.id?.toString() || "guest", note.id);
                        toast.success("Note bookmarked");
                      }
                    }}
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
              <Typography variant="h6" fontWeight={600} mb={1}>
                {note.title}
              </Typography>
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
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Bookmarks;

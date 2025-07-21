import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputBase,
  Paper,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Public,
  Delete,
  MoreVert,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { usePublicNotes } from "../../store/useStore";
import { useAuth } from "../../store/useStore";
import { useBookmarks } from "../../store/useStore";
import { toast } from "react-toastify";

interface NoteEditorProps {
  mode: "new" | "edit";
  initialTitle?: string;
  initialSynopsis?: string;
  initialContent?: string;
  initialTags?: string[];
  onSave?: (data: {
    title: string;
    synopsis: string;
    content: string;
    tags: string[];
  }) => void;
  onDelete?: (data: {
    title: string;
    synopsis: string;
    content: string;
    tags: string[];
  }) => void;
  onPublish?: () => void;
  loading?: boolean;
  sidebarWidth?: number;
}

const NoteEditor = ({
  mode,
  initialTitle = "",
  initialSynopsis = "",
  initialContent = "",
  initialTags = [],
  onSave,
  onDelete,
  onPublish,
  loading = false,
  sidebarWidth = 220,
}: NoteEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [synopsis, setSynopsis] = useState(initialSynopsis);
  const [content, setContent] = useState(initialContent);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);
  const [publishDialog, setPublishDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const { user } = useAuth();
  const { addPublicNote } = usePublicNotes();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    setTitle(initialTitle);
    setSynopsis(initialSynopsis);
    setContent(initialContent);
    setTags(initialTags);
  }, [initialTitle, initialSynopsis, initialContent, initialTags]);

  const noteId = (initialTitle || title).replace(/\s+/g, "-").toLowerCase();

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: { xs: "auto", md: "calc(100vh - 56px - 16px)" },
        bgcolor: "background.default",
        p: 0,
        gap: { xs: 2, md: 2 },
        mt: { xs: "56px", md: "56px" },
        ml: { xs: 0, sm: `calc(${sidebarWidth}px + 16px)` },
        transition: "margin-left 0.2s cubic-bezier(.4,0,.2,1)",
        position: "relative",
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
        alignItems: { md: "center" },
        justifyContent: { md: "center" },
      }}
    >
      {/* Top-right menu bar */}
      <Paper
        elevation={4}
        sx={{
          flex: 1,
          p: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
          width: { xs: "100%", md: "100%" },
          maxWidth: { md: "700px" },
          height: { xs: "auto", md: "80vh" },
          boxSizing: "border-box",
          overflow: "auto",
          borderRadius: 3,
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.08)",
          background: "#fff",
          justifyContent: "flex-start",
        }}
      >
        {/* Menu bar always visible at the top-right */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            mb: 1,
          }}
        >
          {/* Bookmark button */}
          {user && (
            <IconButton
              onClick={() =>
                isBookmarked(user.id.toString(), noteId)
                  ? removeBookmark(user.id.toString(), noteId)
                  : addBookmark(user.id.toString(), noteId)
              }
              color="primary"
              sx={{ mr: 1 }}
            >
              {isBookmarked(user.id.toString(), noteId) ? (
                <Bookmark />
              ) : (
                <BookmarkBorder />
              )}
            </IconButton>
          )}
          <IconButton onClick={handleMenuOpen} sx={{ color: "#b0b8c1" }}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                setPublishDialog(true);
              }}
            >
              <Public fontSize="small" style={{ marginRight: 8 }} /> Publish
              note
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                setDeleteDialog(true);
              }}
              sx={{ color: "#e57373" }}
            >
              <Delete fontSize="small" style={{ marginRight: 8 }} /> Delete note
            </MenuItem>
          </Menu>
        </Box>
        {/* Publish Dialog */}
        <Dialog open={publishDialog} onClose={() => setPublishDialog(false)}>
          <DialogTitle>Make Note Public?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you want this note to be public? It will be visible in the
              public notes section on the landing page.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPublishDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPublishDialog(false);
                if (onPublish) onPublish();
                // Add to public notes
                if (user) {
                  addPublicNote({
                    title,
                    synopsis,
                    author: {
                      firstName: user.firstName,
                      avatar: user.avatar,
                    },
                  });
                }
                toast.success("Note published successfully!");
              }}
              color="primary"
              variant="contained"
            >
              Publish
            </Button>
          </DialogActions>
        </Dialog>
        {/* Delete Dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Delete Note?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDeleteDialog(false);
                if (onDelete) onDelete({ title, synopsis, content, tags });
              }}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        {/* Editor */}
        <InputBase
          placeholder="untitled note"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ fontSize: 24, fontWeight: 600, mb: 1, color: "text.primary" }}
          fullWidth
        />
        <InputBase
          placeholder="Add a synopsis (short summary for preview)"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          sx={{ fontSize: 16, mb: 2, color: "text.secondary" }}
          fullWidth
        />
        <Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ flexWrap: "wrap", mb: 1 }}
          >
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                size="small"
                sx={{ bgcolor: "#232c34", color: "#fff" }}
              />
            ))}
            <InputBase
              placeholder="add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ fontSize: 14, minWidth: 80, color: "primary.main" }}
              inputProps={{ "aria-label": "add a tag" }}
            />
            <IconButton
              size="small"
              onClick={handleAddTag}
              sx={{ color: "primary.main" }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
        <TextField
          multiline
          minRows={16}
          maxRows={32}
          placeholder="Write your note in markdown..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          sx={{ fontFamily: "monospace", bgcolor: "#f5f7fa", flex: 1 }}
        />
        <Stack
          direction="row"
          spacing={2}
          mt={2}
          sx={{
            position: { md: "sticky" },
            bottom: { md: 0 },
            bgcolor: { md: "#fff" },
            py: { md: 1 },
            zIndex: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSave && onSave({ title, synopsis, content, tags })}
            disabled={loading}
          >
            {mode === "edit" ? "Save Changes" : "Save"}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            disabled={loading}
            onClick={() => {
              if (mode === "new" && onDelete) {
                onDelete({ title, synopsis, content, tags });
              }
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Paper>
      {/* Preview */}
      <Paper
        elevation={4}
        sx={{
          flex: 1,
          p: { xs: 2, sm: 3 },
          minWidth: 0,
          overflow: "auto",
          bgcolor: "#232c34",
          color: "#fff",
          width: { xs: "100%", md: "100%" },
          maxWidth: { md: "500px" },
          mt: { xs: 2, md: 0 },
          height: { xs: "auto", md: "80vh" },
          boxSizing: "border-box",
          borderRadius: 3,
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
          Preview
        </Typography>
        <Typography variant="h5" sx={{ color: "#fff", mb: 1 }}>
          {title || "untitled note"}
        </Typography>
        {synopsis && (
          <Typography
            variant="subtitle1"
            sx={{ color: "#b0b8c1", mb: 2, fontStyle: "italic" }}
          >
            {synopsis}
          </Typography>
        )}
        <Stack direction="row" spacing={1} mb={2}>
          {tags.map((tag) => (
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
            color: "#e0e0e0",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {content ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            <Typography
              variant="body2"
              sx={{ color: "#b0b8c1", textAlign: "center" }}
            >
              Nothing to preview yet...
              <br />
              Start writing your note to see a live preview here!
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default NoteEditor;

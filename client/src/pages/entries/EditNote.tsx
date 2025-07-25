import NoteEditor from "../../components/entries/NoteEditor";
import { useSidebar } from "../../store/useStore";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import {
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";

interface Note {
  title: string;
  synopsis: string;
  content: string;
  tags: string[];
}

const EditNote = () => {
  const { id } = useParams<{ id: string }>();
  const { sidebarCollapsed } = useSidebar();
  const sidebarWidth = sidebarCollapsed ? 64 : 220;
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<Note | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const handleSave = async (data: {
    title: string;
    synopsis: string;
    content: string;
    tags: string[];
  }) => {
    if (!id) return;
    try {
      await axiosInstance.put(`/entries/${id}`, data);
      toast.success("Note updated successfully!");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to update note.");
    }
  };

  const handleCancel = (current: {
    title: string;
    synopsis: string;
    content: string;
    tags: string[];
  }) => {
    // Checking if any field has changed
    if (
      current.title === note.title &&
      current.synopsis === note.synopsis &&
      current.content === note.content &&
      JSON.stringify(current.tags) === JSON.stringify(note.tags)
    ) {
      navigate("/dashboard");
    } else {
      setConfirmOpen(true);
    }
  };
  const handleConfirmCancel = () => {
    setConfirmOpen(false);
    navigate("/dashboard");
  };
  const handleCloseDialog = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <NoteEditor
        mode="edit"
        initialTitle={note.title}
        initialSynopsis={note.synopsis}
        initialContent={note.content}
        initialTags={note.tags}
        sidebarWidth={sidebarWidth}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      <Dialog open={confirmOpen} onClose={handleCloseDialog}>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogContent>
          You have unsaved changes. Are you sure you want to leave? Your changes
          will be lost.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Stay
          </Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
          >
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditNote;

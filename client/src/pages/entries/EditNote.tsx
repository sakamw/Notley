import NoteEditor from "../../components/entries/NoteEditor";
import { useSidebar } from "../../store/useStore";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Box, CircularProgress, Typography } from "@mui/material";
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

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <NoteEditor
      mode="edit"
      initialTitle={note.title}
      initialSynopsis={note.synopsis}
      initialContent={note.content}
      initialTags={note.tags}
      sidebarWidth={sidebarWidth}
      onSave={handleSave}
      onDelete={handleCancel}
    />
  );
};

export default EditNote;

import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import { useSidebar } from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

interface Draft {
  id: string;
  title: string;
  synopsis: string;
  content: string;
  tags: string[];
}

const Drafts = () => {
  const { sidebarCollapsed } = useSidebar();
  const sidebarWidth = sidebarCollapsed ? 64 : 220;
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notelyDrafts") || "[]");
    setDrafts(stored);
  }, []);

  const handleEdit = (draft: Draft) => {
    localStorage.setItem("notelyDraftEdit", JSON.stringify(draft));
    navigate("/notes/new");
  };

  const handleDelete = (id: string) => {
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    localStorage.setItem("notelyDrafts", JSON.stringify(updated));
  };

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
        Drafts
      </Typography>
      {drafts.length === 0 ? (
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
              maxWidth: 500,
              borderRadius: 3,
              width: "100%",
            }}
          >
            <Typography variant="h6" color="text.secondary" mb={2}>
              No drafts yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Notes you save as drafts will appear here. Start a new note and
              click Cancel to save as a draft.
            </Typography>
          </Paper>
        </Box>
      ) : (
        <Stack spacing={3} width="100%" maxWidth={600} direction="column">
          {drafts.map((draft) => (
            <Paper
              key={draft.id}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box>
                <Typography variant="h6">
                  {draft.title || "Untitled draft"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {draft.synopsis}
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleEdit(draft)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(draft.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Drafts;

import { useEffect, useState } from "react";
import { Box, TextField, useTheme } from "@mui/material";
import { usePublicNotes } from "../../store/useStore";
import { useAuth } from "../../store/useStore";
import { toast } from "react-toastify";
import { useSummarization, SummaryDialog } from "../openai";
import {
  NoteActionsMenu,
  NoteHeader,
  NotePreview,
  ConfirmationDialogs,
  NoteActionButtons,
} from "./";

interface NoteEditorProps {
  mode: "new" | "edit";
  initialTitle?: string;
  initialSynopsis?: string;
  initialContent?: string;
  initialTags?: string[];
  entryId?: string;
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
  onCancel?: (data: {
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
  entryId,
  onSave,
  onDelete,
  onCancel,
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
  const [summaryDialog, setSummaryDialog] = useState(false);

  const { user } = useAuth();
  const { addPublicNote } = usePublicNotes();
  const theme = useTheme();

  // AI Summarization hook
  const { summarizing, generatedSummary, summarizeContent } =
    useSummarization();

  useEffect(() => {
    setTitle(initialTitle);
    setSynopsis(initialSynopsis);
    setContent(initialContent);
    setTags(initialTags);
  }, [initialTitle, initialSynopsis, initialContent, initialTags]);

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

  const handleSummarize = async () => {
    const result = await summarizeContent(content, entryId);
    if (result) {
      setSummaryDialog(true);
    }
  };

  const handleUseSummary = () => {
    setSynopsis(generatedSummary);
    setSummaryDialog(false);
    toast.success("Summary applied to synopsis!");
  };

  const handlePublishConfirm = () => {
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
  };

  const handleDeleteConfirm = () => {
    setDeleteDialog(false);
    if (onDelete) onDelete({ title, synopsis, content, tags });
  };

  const handleCancel = () => {
    if (mode === "edit") {
      if (typeof onCancel === "function") {
        onCancel({ title, synopsis, content, tags });
      } else if (typeof onDelete === "function") {
        onDelete({ title, synopsis, content, tags });
      }
    } else if (mode === "new" && typeof onDelete === "function") {
      onDelete({ title, synopsis, content, tags });
    }
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
        mt: { xs: "80px", md: "72px" },
        ml: { xs: 0, sm: `calc(${sidebarWidth}px + 16px)` },
        transition: "margin-left 0.2s cubic-bezier(.4,0,.2,1)",
        position: "relative",
        maxWidth: "100vw",
        overflow: "hidden",
        boxSizing: "border-box",
        alignItems: { md: "center" },
        justifyContent: { md: "center" },
        width: "100vw",
        px: { xs: 0.5, sm: 2, md: 0 },
      }}
    >
      {/* Editor Section */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 1, sm: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
          width: { xs: "100%", md: "100%" },
          maxWidth: { xs: "100vw", md: "700px" },
          height: { xs: "auto", md: "80vh" },
          boxSizing: "border-box",
          overflow: "auto",
          borderRadius: 3,
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.08)",
          background: theme.palette.background.paper,
          justifyContent: "flex-start",
        }}
      >
        {/* Note Actions Menu */}
        <NoteActionsMenu
          menuAnchor={menuAnchor}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
          onPublish={() => setPublishDialog(true)}
          onDelete={() => setDeleteDialog(true)}
          onSummarize={handleSummarize}
          content={content}
          summarizing={summarizing}
        />

        {/* Note Header */}
        <NoteHeader
          title={title}
          synopsis={synopsis}
          tags={tags}
          tagInput={tagInput}
          onTitleChange={setTitle}
          onSynopsisChange={setSynopsis}
          onTagInputChange={setTagInput}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onTagKeyDown={handleKeyDown}
        />

        {/* Content Editor */}
        <TextField
          multiline
          minRows={16}
          maxRows={32}
          placeholder="Write your note in markdown..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          sx={{
            fontFamily: "monospace",
            bgcolor: "transparent",
            color: theme.palette.text.primary,
            flex: 1,
            borderRadius: 0,
            px: 1,
            "& .MuiInputBase-input": {
              color: theme.palette.text.primary,
              backgroundColor: "transparent",
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "transparent",
              borderRadius: 0,
            },
          }}
        />

        {/* Action Buttons */}
        <NoteActionButtons
          mode={mode}
          loading={loading}
          onSave={() => onSave && onSave({ title, synopsis, content, tags })}
          onCancel={handleCancel}
        />
      </Box>

      {/* Preview Section */}
      <NotePreview
        title={title}
        synopsis={synopsis}
        content={content}
        tags={tags}
      />

      {/* Confirmation Dialogs */}
      <ConfirmationDialogs
        publishDialog={publishDialog}
        deleteDialog={deleteDialog}
        onPublishDialogClose={() => setPublishDialog(false)}
        onDeleteDialogClose={() => setDeleteDialog(false)}
        onPublishConfirm={handlePublishConfirm}
        onDeleteConfirm={handleDeleteConfirm}
      />

      {/* Summary Dialog */}
      <SummaryDialog
        open={summaryDialog}
        summary={generatedSummary}
        onClose={() => setSummaryDialog(false)}
        onUseSummary={handleUseSummary}
      />
    </Box>
  );
};

export default NoteEditor;

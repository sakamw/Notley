import React from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Button,
  Chip,
} from "@mui/material";
import {
  PushPin,
  PushPinOutlined,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";
import type { Theme } from "@mui/material/styles";

interface Note {
  id: string;
  title: string;
  synopsis: string;
  tags: string[];
  pinned: boolean;
}

interface NoteCardProps {
  note: Note;
  onPin: (noteId: string, pinned: boolean) => void;
  onBookmark: (noteId: string, bookmarked: boolean) => void;
  isBookmarked: (noteId: string) => boolean;
  onEdit: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onReadMore: (noteId: string) => void;
  theme: Theme;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPin,
  onBookmark,
  isBookmarked,
  onEdit,
  onDelete,
  onReadMore,
  theme,
}) => (
  <Box
    sx={{
      width: { xs: "100%", sm: "48%", md: "24%" },
      minWidth: 0,
      maxWidth: { xs: "100vw", sm: 420 },
      mb: 2,
      flexGrow: 1,
      boxSizing: "border-box",
      overflowX: "hidden",
      display: "flex",
      justifyContent: "center",
      mx: { xs: 1, sm: 2 },
    }}
  >
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        position: "relative",
        width: "100%",
        minHeight: 220,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflowX: "hidden",
        borderRadius: 3,
        boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
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
            color: "text.primary",
          }}
        >
          {note.title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={note.pinned ? "Unpin note" : "Pin note"}>
            <IconButton
              size="small"
              onClick={() => onPin(note.id, !note.pinned)}
              color="primary"
              sx={{ p: 0.5 }}
            >
              {note.pinned ? <PushPin /> : <PushPinOutlined />}
            </IconButton>
          </Tooltip>
          <Tooltip
            title={isBookmarked(note.id) ? "Remove bookmark" : "Bookmark"}
          >
            <IconButton
              size="small"
              onClick={() =>
                isBookmarked(note.id)
                  ? onBookmark(note.id, false)
                  : onBookmark(note.id, true)
              }
              color="primary"
              sx={{ p: 0.5 }}
            >
              {isBookmarked(note.id) ? <Bookmark /> : <BookmarkBorder />}
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
          color: "text.secondary",
        }}
      >
        {note.synopsis}
      </Typography>

      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        {note.tags.map((tag) => (
          <Chip
            key={tag}
            label={`#${tag}`}
            size="small"
            sx={{
              bgcolor: "#232c34",
              color: "#fff",
              fontWeight: 500,
              fontSize: 12,
              borderRadius: 1,
              mb: 0.5,
            }}
          />
        ))}
      </Stack>

      <Stack direction="row" spacing={1} mt="auto">
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#2563eb",
            color: "#fff",
            minWidth: 0,
            px: 2,
            fontSize: 13,
            borderRadius: 2,
            boxShadow: "none",
            textTransform: "none",
            "&:hover": { bgcolor: "#1741a6" },
          }}
          onClick={() => onReadMore(note.id)}
        >
          Read More
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          sx={{
            minWidth: 0,
            px: 2,
            fontSize: 13,
            borderRadius: 2,
            textTransform: "none",
          }}
          onClick={() => onEdit(note.id)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          sx={{
            minWidth: 0,
            px: 2,
            fontSize: 13,
            borderRadius: 2,
            textTransform: "none",
          }}
          onClick={() => onDelete(note.id)}
        >
          Delete
        </Button>
      </Stack>
    </Paper>
  </Box>
);

export default NoteCard;

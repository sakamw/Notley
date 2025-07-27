import {
  Box,
  Chip,
  IconButton,
  InputBase,
  Stack,
  useTheme,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface NoteHeaderProps {
  title: string;
  synopsis: string;
  tags: string[];
  tagInput: string;
  onTitleChange: (title: string) => void;
  onSynopsisChange: (synopsis: string) => void;
  onTagInputChange: (tagInput: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const NoteHeader = ({
  title,
  synopsis,
  tags,
  tagInput,
  onTitleChange,
  onSynopsisChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onTagKeyDown,
}: NoteHeaderProps) => {
  const theme = useTheme();

  return (
    <>
      <InputBase
        placeholder="untitled note"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        sx={{
          fontSize: 24,
          fontWeight: 600,
          mb: 1,
          color: theme.palette.text.primary,
          backgroundColor: "transparent",
          borderRadius: 0,
          px: 1,
        }}
        fullWidth
      />
      <InputBase
        placeholder="Add a synopsis (short summary for preview)"
        value={synopsis}
        onChange={(e) => onSynopsisChange(e.target.value)}
        sx={{
          fontSize: 16,
          mb: 2,
          color: theme.palette.text.primary,
          backgroundColor: "transparent",
          borderRadius: 0,
          px: 1,
        }}
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
              onDelete={() => onRemoveTag(tag)}
              size="small"
              sx={{ bgcolor: "#232c34", color: "#fff" }}
            />
          ))}
          <InputBase
            placeholder="add a tag"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={onTagKeyDown}
            sx={{
              fontSize: 14,
              minWidth: 80,
              color: theme.palette.text.primary,
              backgroundColor: "transparent",
              borderRadius: 0,
              px: 1,
            }}
            inputProps={{ "aria-label": "add a tag" }}
          />
          <IconButton
            size="small"
            onClick={onAddTag}
            sx={{ color: "primary.main" }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </>
  );
};

export default NoteHeader;

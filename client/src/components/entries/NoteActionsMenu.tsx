import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert, Public, Delete } from "@mui/icons-material";
import { SummarizeButton } from "../genai";

interface NoteActionsMenuProps {
  menuAnchor: HTMLElement | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onPublish: () => void;
  onDelete: () => void;
  onSummarize: () => void;
  content: string;
  summarizing: boolean;
}

const NoteActionsMenu = ({
  menuAnchor,
  onMenuOpen,
  onMenuClose,
  onPublish,
  onDelete,
  onSummarize,
  content,
  summarizing,
}: NoteActionsMenuProps) => {
  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        onClick={onMenuOpen}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 3,
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={onMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            onMenuClose();
            onPublish();
          }}
        >
          <Public fontSize="small" style={{ marginRight: 8 }} /> Publish note
        </MenuItem>
        <MenuItem
          onClick={() => {
            onMenuClose();
            onDelete();
          }}
          sx={{ color: "#e57373" }}
        >
          <Delete fontSize="small" style={{ marginRight: 8 }} /> Delete note
        </MenuItem>
        <SummarizeButton
          content={content}
          summarizing={summarizing}
          onSummarize={() => {
            onMenuClose();
            onSummarize();
          }}
        />
      </Menu>
    </Box>
  );
};

export default NoteActionsMenu;

import { Button, Stack } from "@mui/material";

interface NoteActionButtonsProps {
  mode: "new" | "edit";
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const NoteActionButtons = ({
  mode,
  loading,
  onSave,
  onCancel,
}: NoteActionButtonsProps) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      mt={2}
      sx={{
        position: { md: "sticky" },
        bottom: { md: 0 },
        bgcolor: "transparent",
        py: { md: 1 },
        zIndex: 2,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={onSave}
        disabled={loading}
      >
        {mode === "edit" ? "Save Changes" : "Save"}
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        disabled={loading}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </Stack>
  );
};

export default NoteActionButtons;

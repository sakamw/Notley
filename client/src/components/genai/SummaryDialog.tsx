import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface SummaryDialogProps {
  open: boolean;
  summary: string;
  onClose: () => void;
  onUseSummary: () => void;
}

const SummaryDialog = ({
  open,
  summary,
  onClose,
  onUseSummary,
}: SummaryDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Summary Generated</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Generated Summary:
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {summary}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onUseSummary} color="primary">
          Use Summary
        </Button>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SummaryDialog;

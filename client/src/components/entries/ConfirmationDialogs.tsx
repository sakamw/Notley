import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmationDialogsProps {
  publishDialog: boolean;
  deleteDialog: boolean;
  onPublishDialogClose: () => void;
  onDeleteDialogClose: () => void;
  onPublishConfirm: () => void;
  onDeleteConfirm: () => void;
}

const ConfirmationDialogs = ({
  publishDialog,
  deleteDialog,
  onPublishDialogClose,
  onDeleteDialogClose,
  onPublishConfirm,
  onDeleteConfirm,
}: ConfirmationDialogsProps) => {
  return (
    <>
      {/* Publish Dialog */}
      <Dialog open={publishDialog} onClose={onPublishDialogClose}>
        <DialogTitle>Make Note Public?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want this note to be public? It will be visible in the public
            notes section on the landing page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onPublishDialogClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={onPublishConfirm}
            color="primary"
            variant="contained"
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={onDeleteDialogClose}>
        <DialogTitle>Delete Note?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteDialogClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={onDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmationDialogs;

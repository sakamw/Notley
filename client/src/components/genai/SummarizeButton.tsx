import { MenuItem, CircularProgress, Typography } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

interface SummarizeButtonProps {
  content: string;
  summarizing: boolean;
  onSummarize: () => void;
}

const SummarizeButton = ({
  content,
  summarizing,
  onSummarize,
}: SummarizeButtonProps) => {
  const isDisabled = summarizing || !content || content.trim().length < 50;
  const isContentTooShort = !content || content.trim().length < 50;

  return (
    <MenuItem
      onClick={onSummarize}
      disabled={isDisabled}
      sx={{
        color: isContentTooShort ? "#666" : "#4caf50",
        opacity: isContentTooShort ? 0.6 : 1,
      }}
    >
      {summarizing ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        <AutoAwesome fontSize="small" style={{ marginRight: 8 }} />
      )}
      Summarize Note
      {isContentTooShort && (
        <Typography variant="caption" sx={{ ml: 1, fontSize: "0.7rem" }}>
          (min 50 chars)
        </Typography>
      )}
    </MenuItem>
  );
};

export default SummarizeButton;

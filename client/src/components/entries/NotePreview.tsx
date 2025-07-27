import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

interface NotePreviewProps {
  title: string;
  synopsis: string;
  content: string;
  tags: string[];
}

const NotePreview = ({ title, synopsis, content, tags }: NotePreviewProps) => {
  return (
    <Paper
      elevation={4}
      sx={{
        flex: 1,
        p: { xs: 1, sm: 2, md: 3 },
        minWidth: 0,
        overflow: "auto",
        bgcolor: "#232c34",
        color: "#fff",
        width: { xs: "100%", md: "100%" },
        maxWidth: { xs: "100vw", md: "700px" },
        mt: { xs: 2, md: 0 },
        height: { xs: "auto", md: "80vh" },
        boxSizing: "border-box",
        borderRadius: 3,
        boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
        display: "block",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
        Preview
      </Typography>
      <Typography variant="h5" sx={{ color: "#fff", mb: 1 }}>
        {title || "untitled note"}
      </Typography>
      {synopsis && (
        <Typography
          variant="subtitle1"
          sx={{ color: "#b0b8c1", mb: 2, fontStyle: "italic" }}
        >
          {synopsis}
        </Typography>
      )}
      <Stack direction="row" spacing={1} mb={2}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{ bgcolor: "#3d82f5", color: "#fff" }}
          />
        ))}
      </Stack>
      <Box
        sx={{
          fontSize: 16,
          color: "#e0e0e0",
          width: "100%",
          fontFamily: "inherit",
          lineHeight: 1.7,
          textAlign: "left",
          "& h1": {
            fontSize: "2rem",
            fontWeight: 600,
            margin: "1.2em 0 0.6em 0",
          },
          "& h2": {
            fontSize: "1.5rem",
            fontWeight: 500,
            margin: "1em 0 0.5em 0",
          },
          "& h3": {
            fontSize: "1.2rem",
            fontWeight: 500,
            margin: "0.8em 0 0.4em 0",
          },
          "& p": {
            margin: "0.5em 0",
          },
          "& ul, & ol": {
            margin: "0.5em 0 0.5em 1.5em",
          },
          "& code": {
            background: "#232c34",
            color: "#f8f8f2",
            padding: "2px 6px",
            borderRadius: 4,
            fontSize: 14,
          },
        }}
      >
        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <Typography
            variant="body2"
            sx={{ color: "#b0b8c1", textAlign: "center" }}
          >
            Nothing to preview yet...
            <br />
            Start writing your note to see a live preview here!
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default NotePreview;

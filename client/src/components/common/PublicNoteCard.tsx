import { Paper, Typography, Avatar, Stack } from "@mui/material";

interface PublicNoteCardProps {
  title: string;
  synopsis: string;
  author: {
    firstName: string;
    avatar?: string;
  };
}

const PublicNoteCard = ({ title, synopsis, author }: PublicNoteCardProps) => (
  <Paper
    sx={{
      p: 3,
      maxWidth: 600,
      width: "100%",
      borderRadius: 3,
      boxShadow: "0 .2rem 1.6rem 0 rgba(0,0,0,0.08)",
    }}
  >
    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
      <Avatar
        src={author.avatar}
        alt={author.firstName}
        sx={{ width: 40, height: 40 }}
      />
      <Typography fontWeight={600}>{author.firstName}</Typography>
    </Stack>
    <Typography variant="h6" fontWeight={700} mb={1}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {synopsis}
    </Typography>
  </Paper>
);

export default PublicNoteCard;

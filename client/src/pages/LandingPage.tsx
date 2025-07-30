import { Box, Typography, Stack } from "@mui/material";
import PublicNoteCard from "../components/common/PublicNoteCard";
import { usePublicNotes } from "../store/useStore";
import Hero from "../components/common/Hero";

function LandingPage() {
  const { publicNotes } = usePublicNotes();
  return (
    <>
      <Hero />
      {/* Public Notes Section */}
      <Box sx={{ py: 6, bgcolor: "background.default" }}>
        <Typography variant="h3" align="center" fontWeight={700} mb={4}>
          Public Notes
        </Typography>
        {publicNotes.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No public notes yet. Be the first to publish a note!
          </Typography>
        ) : (
          <Stack spacing={3} alignItems="center">
            {publicNotes.map((note) => (
              <PublicNoteCard
                key={note.id}
                title={note.title}
                synopsis={note.synopsis}
                author={note.author}
              />
            ))}
          </Stack>
        )}
      </Box>
    </>
  );
}

export default LandingPage;

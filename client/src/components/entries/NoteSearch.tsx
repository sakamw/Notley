import React, { useState, useRef } from "react";
import {
  Box,
  InputBase,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";

interface NoteResult {
  id: string;
  title: string;
}

const NoteSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NoteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length === 0) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(
          `/entries/search?q=${encodeURIComponent(value)}`
        );
        setResults(res.data || []);
        setOpen(true);
      } catch {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  const handleSelect = (id: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    navigate(`/note/${id}`);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <Box ref={anchorRef} sx={{ width: "100%", maxWidth: 480, minWidth: 220 }}>
      <Paper
        sx={{
          bgcolor: "background.paper",
          borderRadius: 1.5,
          px: 2,
          py: 0.5,
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
        elevation={2}
      >
        <SearchIcon sx={{ color: "#b0b8c1", mr: 1 }} />
        <InputBase
          placeholder="Search notes by title..."
          value={query}
          onChange={handleChange}
          sx={{ color: "text.primary", flex: 1, fontSize: 16 }}
          inputProps={{ "aria-label": "search notes by title" }}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
        />
        {loading && <CircularProgress size={18} sx={{ ml: 1 }} />}
      </Paper>
      <Popper
        open={open && results.length > 0}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            sx={{ mt: 1, maxHeight: 320, overflowY: "auto", width: "100%" }}
          >
            <List dense>
              {results.map((note) => (
                <ListItemButton
                  key={note.id}
                  onClick={() => handleSelect(note.id)}
                >
                  <ListItemText primary={note.title} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default NoteSearch;

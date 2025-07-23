import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SxProps, Theme } from "@mui/system";

interface ThemeOptionProps {
  value: string;
  onChange: (value: string) => void;
  sx?: SxProps<Theme>;
}

const ThemeOption = ({ value, onChange, sx }: ThemeOptionProps) => (
  <FormControl fullWidth sx={sx}>
    <InputLabel id="theme-select-label">Theme</InputLabel>
    <Select
      labelId="theme-select-label"
      value={value}
      label="Theme"
      onChange={(e) => onChange(e.target.value as string)}
    >
      <MenuItem value="system">System Default</MenuItem>
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
    </Select>
  </FormControl>
);

export default ThemeOption;

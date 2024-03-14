import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useRecoilState } from "recoil";
import { _timeToDesplayLogs } from "../../services/atom";

export default function BasicSelect() {
  const [timeToDesplayLogs, setTimeToDesplayLogs] =
    useRecoilState(_timeToDesplayLogs);

  const handleChange = (event) => {
    setTimeToDesplayLogs(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Time</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={timeToDesplayLogs}
          label="Time"
          onChange={handleChange}
        >
          <MenuItem value={"today"}>Today</MenuItem>
          <MenuItem value={"lastWeek"}>Last Week</MenuItem>
          <MenuItem value={"all"}>All</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

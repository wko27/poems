import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

import AdapterDateFns from '@mui/lab/AdapterDateFns';

import {
  LocalizationProvider,
  StaticDatePicker,
} from '@mui/lab';

export const DateSelector = (props) => {
  const {
    label,
    defaultDate,
    onChange,
  } = props;

  const [value, setValue] = useState(new Date(defaultDate));
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleChange = async (newValue) => {
    await setDialogOpen(false);
    await setValue(newValue);
    onChange(newValue.valueOf());
  };

  return (
    <div>
      <TextField
        label={label}
        type="text"
        fullWidth
        required
        disabled
        value={new Date(value).toLocaleDateString()}
        onClick={() => setDialogOpen(true)}
      />
      <Dialog
        open={isDialogOpen}
        aria-labelledby='date-selector'
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>
          Select a Date
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              orientation="landscape"
              openTo="day"
              value={value}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DateSelector;

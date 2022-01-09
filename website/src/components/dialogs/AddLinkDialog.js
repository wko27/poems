import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

import {
  DivColumn,
} from 'styles';

const AddLinkDialog = (props) => {
  const {
    onAdd,
    onCancel,
  } = props;

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleChangeTitle = (event) => setTitle(event.target.value);

  const handleChangeUrl = (event) => setUrl(event.target.value);

  const handleAdd = () => onAdd(title, url);

  return (
    <Dialog
      open={true}
      aria-labelledby='invalid-url'
      onClose={onCancel}
    >
      <DialogTitle>
        Add Link
      </DialogTitle>
      <DialogContent sx={{ height: '20vh' }}>
        <DivColumn>
          <TextField
            id="title"
            label="Title"
            type="text"
            value={title}
            autoFocus
            required
            onChange={handleChangeTitle}
            sx={{ minWidth: 200, m: 2 }}
          />
          <TextField
            id="url"
            label="URL"
            type="text"
            value={url}
            autoFocus
            required
            onChange={handleChangeUrl}
            sx={{ minWidth: 200, m: 2 }}
            onKeyDown={event => {
              // Note that this is invoked AFTER the onChange is fired so we capture the correct password
              if (event.key === 'Enter') {
                handleAdd();
              }
            }}
          />
        </DivColumn>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          color='primary'
          autoFocus
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          color='primary'
          autoFocus
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLinkDialog;

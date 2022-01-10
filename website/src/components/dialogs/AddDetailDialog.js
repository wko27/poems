import * as _ from 'lodash';

import { useState } from 'react';

import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

import * as PoemDetailTypes from 'types/poemDetailTypes';

const DETAIL_KEY_OPTIONS = _.keys(PoemDetailTypes.ALLOWED_TYPES);

const ValueForm = (props) => {
  const {
    detailKey,
    onChange,
  } = props;

  if (detailKey == null) {
    return null;
  }

  const {
    type,
    values,
  } = PoemDetailTypes.ALLOWED_TYPES[detailKey];

  switch (type) {
    case 'text':
      return (
        <TextField
          id="value"
          label="Value"
          type="text"
          autoFocus
          required
          onChange={event => onChange(event.target.value)}
          sx={{ minWidth: 200, m: 2 }}
        />
      );
    case 'enum':
      return (
        <Autocomplete
          disablePortal
          id="select-value"
          options={values}
          sx={{ minWidth: 200, m: 2 }}
          renderInput={(params) => <TextField {...params} label="Value" />}
          onChange={(event, value) => onChange(value)}
        />
      );
    default:
      throw Error(`Unsupported poem detail type ${type}`);
  }
}

const AddDetailDialog = (props) => {
  const {
    details,
    onAdd,
    onCancel,
  } = props;

  const [detailKey, setDetailKey] = useState();
  const [detailValue, setDetailValue] = useState();

  const existingDetailKeys = details.map(detail => detail[0]);
  
  const options = DETAIL_KEY_OPTIONS.filter(
    option => !_.includes(existingDetailKeys, option)
  );

  const handleChangeDetailKey = (event, value) => setDetailKey(value);

  const handleChangeDetailValue = (value) => setDetailValue(value);

  const handleAdd = () => {
    if (_.isEmpty(detailKey) || _.isEmpty(detailValue)) {
      return;
    }
    
    onAdd(detailKey, detailValue);
  }

  return (
    <Dialog
      open={true}
      aria-labelledby='invalid-url'
      onClose={onCancel}
    >
      <DialogTitle>
        Add Detail
      </DialogTitle>
      <DialogContent sx={{ height: '20vh' }}>
        <Autocomplete
          disablePortal
          id="select-key"
          options={options}
          sx={{ minWidth: 200, m: 2 }}
          renderInput={(params) => <TextField {...params} label="Detail" />}
          onChange={handleChangeDetailKey}
        />
        <ValueForm
          detailKey={detailKey}
          onChange={handleChangeDetailValue}
          onEnter={handleAdd}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          color='primary'
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

export default AddDetailDialog;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

const InvalidPermissionsDialog = (props) => {
  const {
    onClose,
  } = props;

  return (
    <Dialog
      open={true}
      aria-labelledby='invalid-url'
      onClose={onClose}
    >
      <DialogTitle>
        Invalid URL
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Please submit an email to support@wikimuse.org with a screenshot and explanation of how you arrived at this invalid link!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose()}
          color='primary'
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvalidPermissionsDialog;

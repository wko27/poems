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
    title,
    content,
    onClose,
  } = props;

  return (
    <Dialog
      open={true}
      aria-labelledby={title}
      onClose={onClose}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2">
          {content}
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

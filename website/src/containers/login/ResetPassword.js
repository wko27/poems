import styled from '@emotion/styled';

import {
  Box,
  InputAdornment,
  TextField,
} from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';

const Root = styled(Box)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing(2)};
  `
);

const ResetPassword = (props) => (
  <Root sx={{
    '& .MuiTextField-root': {
      m: 1,
    },
  }}>
    <TextField
      id="email"
      label="Email"
      type="email"
      fullWidth
      autoFocus
      required
      onChange={event => props.setEmail(event.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <EmailIcon />
          </InputAdornment>
        ),
      }}
    />
  </Root>
);

export default ResetPassword;

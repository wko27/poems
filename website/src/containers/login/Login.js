import styled from '@emotion/styled';

import {
  Box,
  InputAdornment,
  TextField,
} from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Root = styled(Box)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing(2)};
  `
);

const Login = (props) => (
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
    <TextField
      id="password"
      label="Password"
      type="password"
      fullWidth
      required
      onChange={event => props.setPassword(event.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <LockIcon />
          </InputAdornment>
        ),
      }}
      onKeyDown={event => {
        // Note that this is invoked AFTER the onChange is fired so we capture the correct password
        if (event.key === 'Enter') {
          props.onLogin();
        }
      }}
    />
  </Root>
);

export default Login;

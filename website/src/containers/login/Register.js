import styled from '@emotion/styled';

import {
  Box,
  InputAdornment,
  TextField,
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
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

const Register = (props) => (
  <Root sx={{
    '& .MuiTextField-root': {
      m: 1,
    },
  }}>
    <TextField
      id="username"
      label="Username"
      type="username"
      fullWidth
      autoFocus
      required
      defaultValue={props.username}
      onChange={event => props.setUsername(event.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <PersonIcon />
          </InputAdornment>
        ),
      }}
    />
    <TextField
      id="email"
      label="Email"
      type="email"
      fullWidth
      required
      defaultValue={props.email}
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
      defaultValue={props.password}
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
          props.onRegister();
        }
      }}
    />
  </Root>
);

export default Register;

import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';

import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';

import {
  checkLoggedIn,
  registerAccount,
  resetPassword,
  login,
  closeLogin,
} from 'features/userSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const REGISTER = 'REGISTER';
const LOGIN = 'LOGIN';
const RESET_PASSWORD = 'RESET_PASSWORD';

const AccountDialog = () => {
  const dispatch = useDispatch();

  // Fire a single check logged in once
  useEffect(() => dispatch(checkLoggedIn()), [dispatch]);

  const [formType, setFormType] = useState(LOGIN);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    isLoginOpen,
    isLoggedIn,
    accountError,
  } = useSelector((state) => state.user);

  const onLogin = () => {
    dispatch(login({
      email,
      password,
    }));
  };

  const onRegister = () => {
    dispatch(registerAccount({
      username,
      email,
      password,
    }));
  };

  const onResetPassword = () => {
    dispatch(resetPassword(email));
  };

  let title;
  let form;
  let buttons;
  switch (formType) {
    case REGISTER:
      title = "Create Account";
      form = (
        <Register
          username={username}
          email={email}
          password={password}
          setUsername={setUsername}
          setEmail={setEmail}
          setPassword={setPassword}
          onRegister={onRegister}
        />
      );
      buttons = (
        <>
          <Button onClick={() => setFormType(LOGIN)}>Go to Sign In</Button>
          <Button onClick={onRegister} variant='outlined'>Register</Button>
        </>
      );
      break;
    case LOGIN:
      title = "Sign In";
      form = (
        <Login
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onLogin={onLogin}
        />
      );
      buttons = (
        <>
          <Button onClick={() => setFormType(RESET_PASSWORD)}>Reset Password</Button>
          <Button onClick={() => setFormType(REGISTER)}>Create Account</Button>
          <Button onClick={onLogin} variant='outlined'>Login</Button>
        </>
      );
      break;
    case RESET_PASSWORD:
      title = "Reset Password";
      form = (
        <ResetPassword
          email={email}
          setEmail={setEmail}
          onResetPassword={onResetPassword}
        />
      );
      buttons = (
        <>
          <>
          <Button onClick={() => setFormType(LOGIN)}>Go to Sign In</Button>
          <Button onClick={onResetPassword} variant='outlined'>Reset Password</Button>
        </>
        </>
      );
      break;
  }

  return (
    <Dialog
      open={isLoginOpen && !isLoggedIn}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => dispatch(closeLogin())}
      aria-describedby="login-dialog"
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <FormControl error={accountError != null}>
          {form}
          <FormHelperText id="form-helper-text" sx={{ pl: 2, pr: 2, m: 0 }}>
            {accountError}
          </FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        {buttons}
      </DialogActions>
    </Dialog>
  );
};

export default AccountDialog;

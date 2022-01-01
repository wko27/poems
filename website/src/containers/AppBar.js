import React, { useState } from 'react';

import { useNavigate } from "react-router-dom";

import { styled } from '@mui/material/styles';

import { useSelector, useDispatch } from 'react-redux';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import HomeIcon from '@mui/icons-material/Home';
import AccountIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

import { openLogin, logout } from 'features/userSlice';

const AppBarButton = styled(Button)`
  text-transform: none;
`;

export default function SiteAppBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    dispatch(logout());
  };

  const handleLogin = () => dispatch(openLogin());

  const handleViewPoems = () => {
    handleProfileMenuClose();
    navigate('/profile/poems');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  const {
    isLoggedIn,
    username,
  } = useSelector((state) => state.user);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={handleGoToHome}>
            WikiMuse
          </Typography>
          {
            !isLoggedIn && (
              <Button
                color="inherit"
                onClick={handleLogin}
                endIcon={<LoginIcon />}
              >
                Login
              </Button>
            )
          }
          {
            isLoggedIn && (
              <>
                <AppBarButton
                  color="inherit"
                  endIcon={<AccountIcon />}
                  onClick={handleProfileMenuOpen}
                >
                  {username}
                </AppBarButton>
                <Menu
                  id="profile-menu-appbar"
                  anchorEl={profileMenuAnchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  open={Boolean(profileMenuAnchorEl)}
                  onClose={handleProfileMenuClose}
                >
                  <MenuList>
                    <MenuItem onClick={handleViewPoems}>
                      <ListItemIcon>
                        <HomeIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>View Poems</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            )
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}


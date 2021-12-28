import * as _ from 'lodash';

import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import PoemIcon from '@mui/icons-material/Article';

import PoemRenderer from '../viewer/PoemRenderer';

import {
  fetchUserPoems,
} from 'features/poemSlice';

const Contrived = (props) => {
  const {
    poemId,
  } = props;

  const userId = useSelector((state) => {
    return state.user.userId;
  });

  return userId;
}

const ProfilePoemViewer = (props) => {
  const navigate = useNavigate();

  const {
    poemId,
  } = props;

  const userId = useSelector((state) => {
    return state.user.userId;
  });

  const [userPoems, setUserPoems] = useState([]);

  const loadUserPoems = () => {
    if (userId) {
      async function loadUserPoemsAsync() {
        const fetchedUserPoems = await fetchUserPoems(userId);
        setUserPoems(fetchedUserPoems);
      };
      loadUserPoemsAsync(); 
    } else {
      navigate("/poems/search");
    }
  };

  useEffect(loadUserPoems, [userId]);

  const [elem, setElem] = useState(null);

  if (_.isEmpty(userPoems)) {
    return "No poems found";
  }

  return (
    <List>
      {
        userPoems.map((userPoem, idx) => {
          const {
            title,
            created,
          } = userPoem;

          return (
            <ListItem key={idx}>
              <ListItemIcon>
                <PoemIcon />
              </ListItemIcon>
              <ListItemText
                primary={title}
                secondary={`Created ${new Date(created)}`}
              />
            </ListItem>
          );
        })
      }
    </List>
    
  );
};

export default ProfilePoemViewer;

import React, { useState, useEffect } from 'react';

import styled from '@emotion/styled';

import Button from '@mui/material/Button';

import { useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux';

import Typography from '@mui/material/Typography';

import PoemList from 'components/list/PoemList';

import {
  PaperColumn,
} from 'styles';

import {
  fetchUserPoems,
  createPoem,
} from 'features/poemSlice';

const PoemListContainer = styled(PaperColumn)`
  width: 50vw,
`;

const ProfilePoemViewer = (props) => {
  const navigate = useNavigate();

  const {
    userId,
    username,
  } = useSelector((state) => state.user);

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

  const handleCreatePoem = async () => {
    const poemId = await createPoem(userId, username);
    navigate(`/poems/${poemId}/edit`);
  }

  useEffect(loadUserPoems, [userId, navigate]);

  return (
    <PaperColumn>
      <Button onClick={handleCreatePoem} variant='outlined'>Compose Poem</Button>
      <PoemListContainer>
        <Typography>
          My Poems
        </Typography>
        <PoemList
          poems={userPoems}
          emptyDisplayText='No poems found'
        />
      </PoemListContainer>
    </PaperColumn>
  );
};

export default ProfilePoemViewer;

import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";

import {
  Grid,
  Typography,
} from '@mui/material';

import {
  PaperColumn,
  DivColumn,
} from 'styles';

import TextView from 'components/viewer/TextView';

import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';

import {
  fetchPoem,
} from 'features/poemSlice';

const WelcomePoem = (props) => {
  const poemId = "welcome";

  const [poem, setPoem] = useState(null);

  const loadPoem = () => {
    async function loadPoemAsync() {
      const fetchedPoem = await fetchPoem(poemId);
      setPoem(fetchedPoem);
    };
    loadPoemAsync();
  };

  useEffect(loadPoem, [poemId]);

  return (
    <TextView
      content={poem == null ? "" : poem.content}
    />
  );
}

const Home = (props) => {
  const navigate = useNavigate();
  const handleCreate = () => navigate("/create");
  const handleSearch = () => navigate("/search");

  return (
    <DivColumn>
      <WelcomePoem />
      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ width: '20vw', mt: 4 }}>
        <Grid item xs={12} md={6} justifyContent="center" alignItems="center">
          <PaperColumn sx={(theme) => ({ height: '10vw', backgroundColor: theme.palette.primary.light })} onClick={handleSearch}>
            <Typography>
              Search
            </Typography>
            <SearchIcon />
          </PaperColumn>
        </Grid>
        <Grid item xs={12} md={6} justifyContent="center" alignItems="center">
          <PaperColumn sx={(theme) => ({ height: '10vw', backgroundColor: theme.palette.highlight.main })} onClick={handleCreate}>
            <Typography>
              Create
            </Typography>
            <CreateIcon />
          </PaperColumn>
        </Grid>
      </Grid>
    </DivColumn>
  );
};

export default Home;

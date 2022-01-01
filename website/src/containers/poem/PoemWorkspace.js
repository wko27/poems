import { useState } from 'react';

import { useParams, useNavigate } from "react-router-dom";

import {
  Box,
  Tab,
} from '@mui/material';

import {
  TabContext,
  TabList,
  TabPanel,
} from '@mui/lab';

import PoemEditor from 'containers/poem/PoemEditor';
import PoemViewer from 'containers/poem/PoemViewer';

const VIEW_TAB = "view";
const EDIT_TAB = "edit";

const PoemWorkspace = (props) => {
  const navigate = useNavigate();
  const {
    poemId,
    operation,
  } = useParams();

  const [tab, setTab] = useState(operation);

  const handleNewTab = (newTab) => {
    setTab(newTab);
    navigate(`/poems/${poemId}/${newTab}`);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList value={tab} onChange={(event, newTab) => handleNewTab(newTab)} aria-label="poem-workspace">
            <Tab label="View" value={VIEW_TAB} />
            <Tab label="Edit" value={EDIT_TAB} />
          </TabList>
        </Box>
        <TabPanel value={VIEW_TAB} index={0}>
          <PoemViewer
            poemId={poemId}
          />
        </TabPanel>
        <TabPanel value={EDIT_TAB} index={1}>
          <PoemEditor
            poemId={poemId}
            onInvalidPermissions={() => handleNewTab(VIEW_TAB)}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default PoemWorkspace;

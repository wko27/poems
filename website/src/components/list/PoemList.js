import * as _ from 'lodash';

import { useNavigate } from "react-router-dom";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import PoemIcon from '@mui/icons-material/Article';

const PoemList = (props) => {
  const navigate = useNavigate();

  const {
    poems,
    emptyDisplayText,
  } = props;

  const handleEdit = (poemId) => navigate(`/poems/${poemId}/edit`);

  if (_.isEmpty(poems)) {
    return (
      <Typography>
        {emptyDisplayText}
      </Typography>
    );
  }
  
  return (
    <List>
      {
        poems.map((poem, idx) => {
          const {
            poemId,
            title,
            created,
          } = poem;

          return (
            <ListItem
              key={idx}
              onClick={() => handleEdit(poemId)}
            >
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
}

export default PoemList;
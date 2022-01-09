import {
  Typography,
} from '@mui/material';

const InfoContainer = (props) => {
  const {
    creatorUsername,
    createdDate,
    author,
    authoredDate,
    onClick,
  } = props;

  const authored = (author == null)
    ? `Creator: ${creatorUsername}`
    : `Author: ${author}`;

  const written = (authoredDate == null)
    ? `Created: ${new Date(createdDate).toLocaleDateString()}`
    : `Authored: ${new Date(authoredDate).toLocaleDateString()}`;

  return (
    <div onClick={onClick}>
      <Typography variant='body1'>
        {authored}
      </Typography>
      <Typography variant='body1'>
        {written}
      </Typography>
    </div>
  );
};

export default InfoContainer;

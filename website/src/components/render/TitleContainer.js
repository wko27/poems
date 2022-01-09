import {
  Typography,
} from '@mui/material';

const TitleContainer = (props) => {
  const {
    title,
    titleFontSize,
    onClick,
  } = props;

  return (
    <Typography
      variant='h2'
      sx={{ fontSize: `${titleFontSize}rem` }}
      onClick={onClick}
    >
      {title}
    </Typography>
  );
};

export default TitleContainer;

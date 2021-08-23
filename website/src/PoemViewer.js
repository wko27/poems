import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import AssignIcon from '@material-ui/icons/ChevronRight';
import UnassignIcon from '@material-ui/icons/ChevronLeft';

import ParsedPoem from './ParsedPoem';

const ButtonControl = (props) => {
  const {
    classes,
    onForward,
    onBack,
    disableForward,
    disableBack,
  } = props;

  return (
    <div className={classes.buttonContainer}>
      <Button
        startIcon={<UnassignIcon style={{visibility: "hidden"}}/>}
        endIcon={<AssignIcon />}
        onClick={onForward}
        disabled={disableForward}
        
      >
        Next
      </Button>
      <Button
        startIcon={<UnassignIcon />}
        endIcon={<AssignIcon style={{visibility: "hidden"}}/>}
        onClick={onBack}
        disabled={disableBack}
      >
        Previous
      </Button>
    </div>
  );
}

const PoemViewer = (props) => {
  const {
    classes,
    title,
    context,
    links = [],
    content,
    annotations = [],
  } = props;

  const [showAnnotations, setShowAnnotations] = useState(false);
  const [selectedAnnotationIdx, setSelectedAnnotationIdx] = useState(null);

  const annotation = selectedAnnotationIdx == null ? null : annotations[selectedAnnotationIdx];

  const annotationDisplay = !showAnnotations
    ? (
      <Button onClick={() => {
      setShowAnnotations(true);
      setSelectedAnnotationIdx(0);
    }}>
      <Typography variant='h4'>
        Show Notes
      </Typography>
    </Button>
    )
    : (
      <>
        <Typography variant='h4'>
          Notes
        </Typography>
        <ButtonControl
          classes={classes}
          onForward={() => setSelectedAnnotationIdx(selectedAnnotationIdx + 1)}
          disableForward={!showAnnotations || selectedAnnotationIdx >= annotations.length - 1}
          onBack={() => setSelectedAnnotationIdx(selectedAnnotationIdx - 1)}
          disableBack={!showAnnotations || selectedAnnotationIdx <= 0}
        />
        <Paper className={classes.annotationExplanationContainer} variant='outlined'>
          <Typography variant='body'>
            {annotation == null ? null : annotation.explanation}
          </Typography>
        </Paper>
      </>
    );

  return (
    <div className={classes.container}>
      <div className={classes.poemContainer}>
        <Typography variant='h1'>
          {title}
        </Typography>
        <ParsedPoem
          content={content}
          annotation={annotation}
        />
      </div>
      <div className={classes.explanationContainer}>
        <Typography variant='h3'>
          Dedication
        </Typography>
        <Paper className={classes.contextContainer} variant='outlined'>
          <Typography variant='body'>
            {context}
          </Typography>
        </Paper>
        {
          links.length === 0 ? null : (
            <>
              <Typography variant='h3'>
                Links
              </Typography>
              <Paper className={classes.linksContainer} variant='outlined'>
                {
                  links.map((link) => {
                    const {
                      title,
                      url,
                    } = link;
                    
                    return (
                      <Link href={url} target='_blank'>
                        {title}
                      </Link>
                    );
                  })
                }
              </Paper>
            </>
          )
        }
        {annotationDisplay}
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    width: '100%',
    padding: theme.spacing(2),
  },
  poemContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  explanationContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'sticky',
    top: '150px',
    alignSelf: 'flex-start',
    minWidth: '25vw',
  },
  contextContainer: {
    maxWidth: '20vw',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  linksContainer: {
    maxWidth: '20vw',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  annotationExplanationContainer: {
    maxWidth: '20vw',
    padding: theme.spacing(2),
  },
});

export default withStyles(styles)(PoemViewer);

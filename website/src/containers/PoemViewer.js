import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';

import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ButtonControl from '../components/ButtonControl';
import ParsedPoem from './ParsedPoem';

const DescriptionContainer = (props) => {
  const {
    classes,
    author,
    created,
    meter,
    type,
    context,
    links = [],
  } = props;

  return (
    <div className={classes.descriptionContainer}>
      <div className={classes.containerWrapper}>
        <div className={classes.subcontainerHeader}>
          <Typography variant='h4'>
            Details
          </Typography>
        </div>
        <Paper className={classes.subcontainer} variant='outlined'>
          <Typography variant='body1'>
            {`Author: ${author}`}
          </Typography>
          <Typography variant='body1'>
            {`Written: ${created}`}
          </Typography>
          <Typography variant='body1'>
            {`Meter: ${meter}`}
          </Typography>
          <Typography variant='body1'>
            {`Type: ${type}`}
          </Typography>
        </Paper>
      </div>
      
      
      <div className={classes.containerWrapper}>
        <div className={classes.subcontainerHeader}>
          <Typography variant='h4'>
            Dedication
          </Typography>
        </div>
        <Paper className={classes.subcontainer} variant='outlined'>
          <Typography variant='body1'>
            {context}
          </Typography>
        </Paper>
      </div>

      {
        links.length === 0 ? null : (
          <div className={classes.containerWrapper}>
            <div className={classes.subcontainerHeader}>
              <Typography variant='h4'>
                Links
              </Typography>
            </div>
            <Paper className={classes.subcontainer} variant='outlined'>
              {
                links.map((link, idx) => {
                  const {
                    title,
                    url,
                  } = link;
                  
                  return (
                    <Link key={idx} href={url} target='_blank'>
                      {title}
                    </Link>
                  );
                })
              }
            </Paper>
          </div>
        )
      }
    </div>
  );
}

const PoemViewer = (props) => {
  const {
    classes,
    title,
    content,
    annotations = [],
  } = props;

  const [selectedAnnotationIdx, setSelectedAnnotationIdx] = useState(0);

  const annotation = selectedAnnotationIdx == null ? null : annotations[selectedAnnotationIdx];

  const annotationDisplay = (
    <div className={classes.annotationContainer}>
      <Typography variant='h4'>
        Notes
      </Typography>
      <ButtonControl
        classes={classes}
        onForward={() => setSelectedAnnotationIdx(selectedAnnotationIdx + 1)}
        disableForward={selectedAnnotationIdx >= annotations.length - 1}
        onBack={() => setSelectedAnnotationIdx(selectedAnnotationIdx - 1)}
        disableBack={selectedAnnotationIdx <= 0}
      />
      <Paper className={classes.annotationExplanationContainer} variant='outlined'>
        <Typography variant='body1'>
          {annotation == null ? null : annotation.explanation}
        </Typography>
      </Paper>
    </div>
  );

  return (
    <div className={classes.container}>
      <DescriptionContainer
        {...props}
      />
      <div className={classes.poemContainer}>
        <Typography variant='h1'>
          {title}
        </Typography>
        <ParsedPoem
          content={content}
          annotation={annotation}
        />
      </div>
      {annotationDisplay}
    </div>
  );
};

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
  },
  poemContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    top: '15vh',
    position: 'sticky',
    maxWidth: '20vw',
  },
  annotationContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20vw',
    top: '20vh',
    position: 'sticky',
    alignSelf: 'flex-start',
  },
  containerWrapper: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subcontainer: {
    margin: theme.spacing(2),    
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subcontainerHeader: {
    bottomMargin: theme.spacing(1),
  },
  annotationExplanationContainer: {
    width: '100%',
    padding: theme.spacing(2),
  },
});

export default withStyles(styles)(PoemViewer);

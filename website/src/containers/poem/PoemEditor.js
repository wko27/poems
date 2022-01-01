import * as _ from 'lodash';

import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import EditPoemRenderer from './EditPoemRenderer';

import InvalidPermissionsDialog from 'components/validation/InvalidPermissionsDialog';
import BlockingProgressIndicator from 'components/progress/BlockingProgressIndicator';

import {
  fetchPoem,
  updatePoemTitle,
  updatePoemDetails,
} from 'features/poemSlice';

const PoemEditor = (props) => {
  const {
    poemId,
    onInvalidPermissions,
  } = props;

  const [poem, setPoem] = useState(null);

  const userId = useSelector((state) => state.user.userId);

  const loadPoem = () => {
    async function loadPoemAsync() {
      const fetchedPoem = await fetchPoem(poemId);
      setPoem(fetchedPoem);
    };
    loadPoemAsync();
  };

  useEffect(loadPoem, [poemId]);

  if (poem === null) {
    return (<BlockingProgressIndicator/>);
  }

  const {
    creatorUserId,
    allowedEditors,
  } = poem;

  let {
    flags: {
      disallowEdit,
      disallowEditReason,
    } = {},
  } = poem;

  if (!disallowEdit
    && creatorUserId !== userId
    && !_.includes(allowedEditors || [], userId)) {
    disallowEdit = true;
    disallowEditReason = `You do not have edit permissions, please ask the creator for access`;
  }

  if (disallowEdit) {
    return (
      <InvalidPermissionsDialog
        title="Unable to Edit"
        content={disallowEditReason}
        onClose={onInvalidPermissions}
      />
    );
  }

  const handleUpdateTitle = (title, titleFontSize) => {
    updatePoemTitle(userId, poemId, title, titleFontSize);
    loadPoem();
  };

  const handleUpdateDetails = (details) => {
    updatePoemDetails(userId, poemId, details);
    loadPoem();
  };

  return (
    <EditPoemRenderer
      poem={poem}
      onUpdateTitle={handleUpdateTitle}
      onUpdateDetails={handleUpdateDetails}
    />
  );
};

export default PoemEditor;

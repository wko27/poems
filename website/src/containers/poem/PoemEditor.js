import * as _ from 'lodash';

import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import EditTextRenderer from 'components/render/EditTextRenderer';
import InvalidPermissionsDialog from 'components/validation/InvalidPermissionsDialog';
import BlockingProgressIndicator from 'components/progress/BlockingProgressIndicator';

import {
  fetchPoem,
  updatePoemTitle,
  updatePoemInfo,
  updatePoemDetails,
  updatePoemLinks,
  updatePoemContent,
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
    return (<BlockingProgressIndicator />);
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

  const handleUpdateInfo = (author, authoredDate) => {
    updatePoemInfo(userId, poemId, author, authoredDate);
    loadPoem();
  };

  const handleUpdateDetails = (details) => {
    updatePoemDetails(userId, poemId, details);
    loadPoem();
  };

  const handleUpdateLinks = (links) => {
    updatePoemLinks(userId, poemId, links);
    loadPoem();
  };

  const handleUpdateContent = (content) => {
    updatePoemContent(userId, poemId, content);
    loadPoem();
  };

  return (
    <EditTextRenderer
      poem={poem}
      onUpdateTitle={handleUpdateTitle}
      onUpdateInfo={handleUpdateInfo}
      onUpdateDetails={handleUpdateDetails}
      onUpdateLinks={handleUpdateLinks}
      onUpdateContent={handleUpdateContent}
    />
  );
};

export default PoemEditor;

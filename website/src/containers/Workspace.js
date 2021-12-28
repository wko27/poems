import PoemViewer from 'containers/PoemViewer';
import AccountDialog from 'containers/login/AccountDialog';

import {
  testPoem,
} from '../poems';

const Workspace = (props) => {
  const {
    title,
    author,
    dedicatedTo,
    created,
    meter,
    type,
    context,
    links,
    content,
    annotations,
  } = testPoem;

  return (
    <>
      <PoemViewer
        title={title}
        author={author}
        dedicatedTo={dedicatedTo}
        created={created}
        meter={meter}
        type={type}
        context={context}
        links={links}
        content={content}
        annotations={annotations}
      />
      <AccountDialog />
    </>
  );
};

export default Workspace;

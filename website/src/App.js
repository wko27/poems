import { ThemeProvider, createTheme } from '@mui/material/styles';

import PoemViewer from './containers/PoemViewer';

import {
  testPoem,
} from './poems';

const App = (props) => {
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

  const theme = createTheme({
    window: {
      width: "800px",
    },
    typography: {
      button: {
        textTransform: 'none',
      },
      fontFamily: [
        "Palanquin",
      ].join(","),
    },
  });

  return (
    <div className="App">
      <header className="App-header">
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
      </header>
    </div>
  );
};

export default App;

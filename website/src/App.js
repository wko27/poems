import { ThemeProvider, createTheme } from '@material-ui/core/styles';

import PoemViewer from './PoemViewer';

import {
  testPoem,
} from './poems';

const App = (props) => {
  const {
    title,
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

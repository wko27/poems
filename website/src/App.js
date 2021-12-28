import { ThemeProvider, createTheme } from '@mui/material/styles';

import AppBar from 'containers/AppBar';
import Workspace from 'containers/Workspace';

const App = (props) => {
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
      <AppBar />
      <ThemeProvider theme={theme}>
        <Workspace />
      </ThemeProvider>
    </div>
  );
};

export default App;

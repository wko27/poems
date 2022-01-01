import { ThemeProvider, createTheme } from '@mui/material/styles';

import { BrowserRouter } from "react-router-dom";

import AppBar from 'containers/AppBar';
import Workspace from 'containers/Workspace';
import AccountDialog from 'containers/login/AccountDialog';

import { yellow } from '@mui/material/colors';

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
    palette: {
      highlight: {
        main: yellow[500],
        light: yellow[100],
      },
    },
  });

  return (
    <div className="App">
      <BrowserRouter>
        <AppBar />
        <ThemeProvider theme={theme}>
          <Workspace />
          <AccountDialog />
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;

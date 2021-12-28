import { ThemeProvider, createTheme } from '@mui/material/styles';

import { BrowserRouter } from "react-router-dom";

import AppBar from 'containers/AppBar';
import Workspace from 'containers/Workspace';
import AccountDialog from 'containers/login/AccountDialog';

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

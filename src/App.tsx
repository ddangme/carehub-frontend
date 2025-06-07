import React from 'react';
import { Routes } from './routes';
import { SnackbarProvider } from 'notistack';
import { CareSubjectProvider } from './shared/contexts/CareSubjectContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <CareSubjectProvider>
          <div className="app">
            <Routes />
          </div>
        </CareSubjectProvider>
      </SnackbarProvider>
    </LocalizationProvider>
  );
}

export default App;
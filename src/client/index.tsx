import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import {
  Button,
  Container,
  CssBaseline,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
import * as color from '@material-ui/core/colors';
import { Autocomplete } from '@material-ui/lab';

import * as storage from './persistentStorage';

const theme = createMuiTheme({
  palette: { type: 'dark', primary: { main: color.lightBlue['300'] } },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {},
}));

const urlParams = new URLSearchParams(window.location.search);

const Index = () => {
  const classes = useStyles();

  const [name, setName] = useState(urlParams.get('name') || storage.getName());
  const [sessionId, setSessionId] = useState(
    urlParams.get('sessionId') || storage.getSession()
  );
  const [sessionIdInput, setSessionIdInput] = useState(sessionId);
  const [isSubmitAllowed, setSubmitAllowed] = useState(!!name && !!sessionId);

  const onNameChange = (event) => {
    const value = event.target.value;
    setName(value);
    setSubmitAllowed(!!value && !!sessionId);
  };

  const onSessionIdChange = (event, value) => {
    setSessionId(value);
    setSubmitAllowed(!!value && !!name);
  };
  const onSessionIdInputChange = (event, value) => {
    setSessionIdInput(value);
    setSubmitAllowed(!!value && !!name);
  };
  const onSessionIdBlur = (event) => {
    setSessionId(sessionIdInput);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    storage.setName(name);
    storage.addSession(sessionId);
    navigateToSession();
  };

  const navigateToSession = () => {
    if (name) {
      location.href = 'session.html';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xs">
        <div className={classes.paper}>
          <CssBaseline />
          <Typography component="h1" variant="h5">
            Join session
          </Typography>
          <form className={classes.form} onSubmit={onSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Your name"
              id="name"
              name="name"
              value={name}
              onChange={onNameChange}
              autoComplete="given-name"
              autoFocus
            />
            <Autocomplete
              options={storage.getSessions()}
              onBlur={onSessionIdBlur}
              value={sessionId}
              onChange={onSessionIdChange}
              inputValue={sessionIdInput}
              onInputChange={onSessionIdInputChange}
              fullWidth
              openOnFocus
              selectOnFocus
              freeSolo
              handleHomeEndKeys
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  required
                  label="Session ID"
                  id="sessionId"
                  name="sessionId"
                />
              )}
            />
            <Button
              disabled={!isSubmitAllowed}
              type="submit"
              fullWidth
              className={classes.submit}
            >
              Enter
            </Button>
          </form>
          <Link href="settings.html">Settings</Link>
        </div>
      </Container>
    </ThemeProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById('root'));

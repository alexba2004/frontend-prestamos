import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  TextField,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { access_token } = res.data;
      login(access_token);
      setLoading(false);
      nav('/');
    } catch (error) {
      console.error('Error during authentication:', error);
      setLoading(false);

      if (error.response && error.response.status === 403) {
        setSnackbarMessage(error.response.data.error);
      } else {
        setSnackbarMessage('Error durante la autenticación. Intenta de nuevo.');
      }
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 3, sm: 7 },
          width: '100%',
          maxWidth: 600,
          textAlign: 'center',
          margin: 'auto',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          Iniciar Sesión
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          gutterBottom
          sx={{ mb: 3 }}
        >
          Ingresa usando tu email y contraseña
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          {loading ? (
            <CircularProgress sx={{ my: 2 }} />
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: 2,
                height: 48,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              Iniciar sesión
            </Button>
          )}
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ backgroundColor: 'error.main' }}
      />
    </Box>
  );
};

export default Login;

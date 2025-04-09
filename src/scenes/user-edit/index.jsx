import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import Loader from '../../components/Loader';
import api from '../../services/apiService';
import editUserSchema from './editUserSchema';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import {
  useMediaQuery,
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
} from '@mui/material';
import { userStatusOptions, userTypeOptions } from '../../services/Titles';

const UserEdit = () => {
  const { idUser } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const nav = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/user/${idUser}`);
        setUserData(response.data);
      } catch (err) {
        setError('Error al cargar los datos del usuario.');
        setSnackbarMessage('Error al cargar los datos del usuario.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [idUser]);

  const handleEditSubmit = async (values) => {
    setLoading(true);
    try {
      await api.put(`/user/${idUser}`, values);
      setSnackbarMessage('Datos del usuario actualizados con éxito!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      setSnackbarMessage('Error al actualizar los datos del usuario.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader loading={loading} />;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px">
      <h1>Editar Usuario</h1>
      <Formik
        enableReinitialize
        initialValues={{
          first_name: userData?.first_name || '',
          last_name: userData?.last_name || '',
          middle_name: userData?.middle_name || '',
          user_type: userData?.user_type || '',
          username: userData?.username || '',
          email: userData?.email || '',
          password: '',
          phone_number: userData?.phone_number || '',
          status: userData?.status || '',
        }}
        validationSchema={editUserSchema}
        onSubmit={(values) => setOpenConfirmDialog(true)}
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              sx={{ '& > div': { gridColumn: isNonMobile ? undefined : 'span 2' } }}
            >
              <TextField
                fullWidth
                label="Nombre"
                name="first_name"
                value={values.first_name}
                onChange={handleChange}
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name}
              />
              <TextField
                fullWidth
                label="Apellido Paterno"
                name="last_name"
                value={values.last_name}
                onChange={handleChange}
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name}
              />
              <TextField
                fullWidth
                label="Apellido Materno"
                name="middle_name"
                value={values.middle_name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="phone_number"
                value={values.phone_number}
                onChange={handleChange}
                error={touched.phone_number && Boolean(errors.phone_number)}
                helperText={touched.phone_number && errors.phone_number}
              />
              <TextField
                fullWidth
                label="Tipo de Usuario"
                name="user_type"
                select
                value={values.user_type}
                onChange={handleChange}
                error={touched.user_type && Boolean(errors.user_type)}
                helperText={touched.user_type && errors.user_type}
              >
                {userTypeOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Estado"
                name="status"
                select
                value={values.status}
                onChange={handleChange}
                error={touched.status && Boolean(errors.status)}
                helperText={touched.status && errors.status}
              >
                {userStatusOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box
              display="flex"
              justifyContent="flex-end"
              mt={3}
            >
              <Button
                type="submit"
                color="primary"
                variant="contained"
              >
                Guardar Cambios
              </Button>
            </Box>
            <ConfirmationDialog
              open={openConfirmDialog}
              onClose={() => setOpenConfirmDialog(false)}
              onConfirm={() => handleEditSubmit(values)}
              title="Confirmar cambios"
              description="¿Estás seguro de que deseas guardar estos cambios?"
              confirmText="Confirmar"
              cancelText="Cancelar"
            />
          </form>
        )}
      </Formik>
      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={3000}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserEdit;

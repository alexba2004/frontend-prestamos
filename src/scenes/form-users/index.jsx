import { useState } from 'react';
import * as yup from 'yup';
import { Box, Button, TextField, MenuItem, useMediaQuery } from '@mui/material';
import { Formik } from 'formik';
import api from '../../services/apiService';
import { userStatusOptions, userTypeOptions } from '../../services/Titles';
import Loader from '../../components/Loader';
import Notification from '../../components/Notification';

const initialValues = {
  first_name: '',
  last_name: '',
  middle_name: '',
  user_type: '',
  username: '',
  email: '',
  password: '',
  phone_number: '',
  status: 'Active',
};

const validationSchema = yup.object().shape({
  first_name: yup.string().required('El nombre es obligatorio'),
  last_name: yup.string().required('El apellido paterno es obligatorio'),
  middle_name: yup.string(),
  user_type: yup
    .string()
    .oneOf(
      userTypeOptions.map((option) => option.value),
      'Tipo de usuario inválido'
    )
    .required('El tipo de usuario es obligatorio'),
  username: yup.string().required('El nombre de usuario es obligatorio'),
  email: yup.string().email('Correo inválido').required('El correo es obligatorio'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'Mínimo 6 caracteres'),
  phone_number: yup
    .string()
    .matches(/^[0-9]+$/, 'Solo números')
    .min(10, 'Mínimo 10 dígitos'),
  status: yup
    .string()
    .oneOf(
      userStatusOptions.map((option) => option.value),
      'Estado inválido'
    )
    .required('El estado es obligatorio'),
});

const UserForm = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  const isNonMobile = useMediaQuery('(min-width:600px)');

  const handleFormSubmit = async (values, actions) => {
    setLoading(true);
    try {
      await api.post('/users', values);
      setSnackbarMessage('Usuario creado con éxito!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      actions.resetForm({ values: initialValues });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      setSnackbarMessage(error.response?.data?.detail || 'Error al crear el usuario.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <h1>Registrar Usuario</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{ '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' } }}
            >
              <TextField
                fullWidth
                variant="filled"
                label="Nombre"
                name="first_name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.first_name}
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Apellido Paterno"
                name="last_name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.last_name}
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Apellido Materno"
                name="middle_name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.middle_name}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Nombre de Usuario"
                name="username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Correo Electrónico"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Contraseña"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Teléfono"
                name="phone_number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone_number}
                error={touched.phone_number && Boolean(errors.phone_number)}
                helperText={touched.phone_number && errors.phone_number}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Tipo de Usuario"
                name="user_type"
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.user_type}
                error={touched.user_type && Boolean(errors.user_type)}
                helperText={touched.user_type && errors.user_type}
                sx={{ gridColumn: 'span 2' }}
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
                variant="filled"
                label="Estado"
                name="status"
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.status}
                error={touched.status && Boolean(errors.status)}
                helperText={touched.status && errors.status}
                sx={{ gridColumn: 'span 2' }}
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
              justifyContent="end"
              mt="20px"
            >
              <Button
                type="submit"
                color="primary"
                variant="contained"
              >
                Registrar Usuario
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Notification
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setOpenSnackbar(false)}
      />
      <Loader loading={loading} />
    </Box>
  );
};

export default UserForm;

import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Box, Button, TextField, MenuItem, useMediaQuery } from '@mui/material';
import { Formik } from 'formik';
import api from '../../services/apiService';
import Loader from '../../components/Loader';
import Notification from '../../components/Notification';
import { loanStatusOptions } from '../../services/Titles';

const initialValues = {
  user_id: '',
  material_id: '',
  return_date: '',
  loan_status: 'Active',
};

const validationSchema = yup.object().shape({
  user_id: yup.string().required('El usuario es obligatorio'),
  material_id: yup.string().required('El material es obligatorio'),
  return_date: yup
    .date()
    .min(
      new Date(Date.now() + 24 * 60 * 60 * 1000),
      'La fecha de devolución no puede ser menor a mañana'
    )
    .required('La fecha de devolución es obligatoria'),
  loan_status: yup
    .string()
    .oneOf(
      loanStatusOptions.map((option) => option.value),
      'Estado inválido'
    )
    .required('El estado es obligatorio'),
});

const LoansForm = () => {
  const [users, setUsers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  const isNonMobile = useMediaQuery('(min-width:600px)');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, materialsRes] = await Promise.all([
          api.get('/users?status=Active'),
          api.get('/materials?status=Available'),
        ]);
        setUsers(usersRes.data);
        setMaterials(materialsRes.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (values, actions) => {
    setLoading(true);
    const payload = {
      ...values,
      loan_date: new Date().toISOString(),
      return_date: new Date(values.return_date).toISOString(),
    };

    try {
      await api.post('/loans', payload);
      setSnackbarMessage('Préstamo registrado con éxito!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      actions.resetForm({ values: initialValues });
    } catch (error) {
      console.error('Error al registrar el préstamo:', error);
      setSnackbarMessage(
        error.response?.data?.detail || 'Error al registrar el préstamo.'
      );
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <h1>Registrar Préstamo</h1>
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
                label="Usuario"
                name="user_id"
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.user_id}
                error={touched.user_id && Boolean(errors.user_id)}
                helperText={touched.user_id && errors.user_id}
                sx={{ gridColumn: 'span 2' }}
              >
                {users.map((user) => (
                  <MenuItem
                    key={user.id}
                    value={user.id}
                  >
                    {user.first_name} {user.last_name} ({user.user_type})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                label="Material"
                name="material_id"
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.material_id}
                error={touched.material_id && Boolean(errors.material_id)}
                helperText={touched.material_id && errors.material_id}
                sx={{ gridColumn: 'span 2' }}
              >
                {materials.map((material) => (
                  <MenuItem
                    key={material.material_id}
                    value={material.material_id}
                  >
                    {material.material_type} - {material.brand} ({material.model})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de devolución"
                name="return_date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.return_date}
                error={touched.return_date && Boolean(errors.return_date)}
                helperText={touched.return_date && errors.return_date}
                sx={{ gridColumn: 'span 2' }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Estado"
                name="loan_status"
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.loan_status}
                error={touched.loan_status && Boolean(errors.loan_status)}
                helperText={touched.loan_status && errors.loan_status}
                sx={{ gridColumn: 'span 2' }}
              >
                {loanStatusOptions.map((option) => (
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
                Registrar Préstamo
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

export default LoansForm;

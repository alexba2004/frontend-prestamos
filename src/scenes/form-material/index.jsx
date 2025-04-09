import { useState } from 'react';
import * as yup from 'yup';
import { Box, Button, TextField, MenuItem, useMediaQuery } from '@mui/material';
import { Formik } from 'formik';
import api from '../../services/apiService';
import { materialStatusOptions } from '../../services/Titles';
import Loader from '../../components/Loader';
import Notification from '../../components/Notification';

const initialValues = {
  material_type: '',
  brand: '',
  model: '',
  status: 'Available',
};

const validationSchema = yup.object().shape({
  material_type: yup.string().required('El tipo de material es obligatorio'),
  brand: yup.string().required('La marca es obligatoria'),
  model: yup.string().required('El modelo es obligatorio'),
  status: yup
    .string()
    .oneOf(
      materialStatusOptions.map((option) => option.value),
      'Estado inválido'
    )
    .required('El estado es obligatorio'),
});

const MaterialForm = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  const isNonMobile = useMediaQuery('(min-width:600px)');

  const handleFormSubmit = async (values, actions) => {
    setLoading(true);
    try {
      const response = await api.post('/materials', values);
      setSnackbarMessage('Material creado con éxito!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      actions.resetForm({ values: initialValues });
    } catch (error) {
      console.error('Error al crear el material:', error);
      setSnackbarMessage(error.response?.data?.detail || 'Error al crear el material');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <h1>Registrar Material</h1>
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
                label="Tipo de Material"
                name="material_type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.material_type}
                error={touched.material_type && Boolean(errors.material_type)}
                helperText={touched.material_type && errors.material_type}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Marca"
                name="brand"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.brand}
                error={touched.brand && Boolean(errors.brand)}
                helperText={touched.brand && errors.brand}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Modelo"
                name="model"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.model}
                error={touched.model && Boolean(errors.model)}
                helperText={touched.model && errors.model}
                sx={{ gridColumn: 'span 2' }}
              />

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
                {materialStatusOptions.map((option) => (
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
                Registrar Material
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

export default MaterialForm;

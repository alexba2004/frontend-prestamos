import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import Loader from '../../components/Loader';
import api from '../../services/apiService';
import { validationSchema } from './editMaterialSchema';
import { Box, Button, TextField, Snackbar, Alert, MenuItem } from '@mui/material';
import { materialStatusOptions } from '../../services/Titles';

const MaterialEdit = () => {
  const { idMaterial } = useParams();
  const [materialData, setMaterialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  const normalizeStatus = (status) => {
    const option = materialStatusOptions.find(
      (opt) =>
        opt.value.toLowerCase().replace(/\s+/g, '') ===
        status.toLowerCase().replace(/\s+/g, '')
    );
    return option ? option.value : '';
  };
  useEffect(() => {
    const fetchMaterialData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/material/${idMaterial}`);
        console.log(response.data);
        setMaterialData(response.data);
      } catch (err) {
        setError('Error al cargar los datos del material.');
        setSnackbarMessage('Error al cargar los datos del material.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterialData();
  }, [idMaterial]);

  const handleEditSubmit = async (values) => {
    setLoading(true);
    try {
      await api.put(`/material/${idMaterial}`, values);
      setSnackbarMessage('Material actualizado con éxito!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/materiales'), 2000);
    } catch (error) {
      setSnackbarMessage('Error al actualizar el material.');
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
      <h1>Editar Material</h1>
      <Formik
        enableReinitialize
        initialValues={{
          material_type: materialData?.material_type || '',
          brand: materialData?.brand || '',
          model: materialData?.model || '',
          status: materialData?.status || '',
          registration_date: materialData?.registration_date || '',
          update_date: materialData?.update_date || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleEditSubmit}
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(2, 1fr)"
            >
              <TextField
                fullWidth
                label="Tipo de Material"
                name="material_type"
                value={values.material_type}
                onChange={handleChange}
                error={touched.material_type && Boolean(errors.material_type)}
                helperText={touched.material_type && errors.material_type}
              />
              <TextField
                fullWidth
                label="Marca"
                name="brand"
                value={values.brand}
                onChange={handleChange}
                error={touched.brand && Boolean(errors.brand)}
                helperText={touched.brand && errors.brand}
              />
              <TextField
                fullWidth
                label="Modelo"
                name="model"
                value={values.model}
                onChange={handleChange}
                error={touched.model && Boolean(errors.model)}
                helperText={touched.model && errors.model}
              />
              <TextField
                fullWidth
                label="Estado"
                name="status"
                select
                value={normalizeStatus(values.status)}
                onChange={handleChange}
                error={touched.status && Boolean(errors.status)}
                helperText={touched.status && errors.status}
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
              <TextField
                fullWidth
                label="Fecha de Registro"
                name="registration_date"
                value={values.registration_date}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                label="Fecha de Actualización"
                name="update_date"
                value={values.update_date}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="end"
              mt="20px"
            >
              <Button
                type="submit"
                color="secondary"
                variant="contained"
              >
                Guardar Cambios
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={3000}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MaterialEdit;

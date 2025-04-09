import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import Loader from '../../components/Loader';
import api from '../../services/apiService';
import { validationSchema } from './editLoanSchema';
import { Box, Button, TextField, Snackbar, Alert, MenuItem } from '@mui/material';
import { loanStatusOptions } from '../../services/Titles';

const LoanEdit = () => {
  const { idLoan } = useParams();
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await api.get(`/loan/${idLoan}`);
        setLoanData(response.data);
      } catch (err) {
        setError('Error al cargar los datos del préstamo.');
        setSnackbarMessage('Error al cargar los datos del préstamo.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanData();
  }, [idLoan]);

  const handleEditSubmit = async (values) => {
    setLoading(true);
    try {
      await api.put(`/loan/${idLoan}`, { loan_status: values.loan_status });
      setSnackbarMessage('Estado del préstamo actualizado con éxito!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error al actualizar el préstamo:', error);
      setSnackbarMessage('Error al actualizar el estado del préstamo.');
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
      <h1>Editar Estado del Préstamo</h1>
      <Formik
        enableReinitialize
        initialValues={{
          loan_status: loanData?.loan_status || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleEditSubmit}
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="filled"
              label="Estado del préstamo"
              name="loan_status"
              value={values.loan_status}
              onChange={handleChange}
              select
              error={touched.loan_status && Boolean(errors.loan_status)}
              helperText={touched.loan_status && errors.loan_status}
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

export default LoanEdit;

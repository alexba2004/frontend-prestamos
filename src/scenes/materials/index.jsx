import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Header } from '../../components';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../services/apiService';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import Notification from '../../components/Notification';

const Materials = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const { data } = await api.get('/materials');
        setMaterials(data);
      } catch (error) {
        console.error('Error al obtener materiales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const goToMaterial = (id) => navigate(`/material-edit/${id}`);

  const handleConfirmDelete = async () => {
    if (!selectedMaterial) return;
    setIsDeleting(true);
    try {
      await api.delete(`/material/${selectedMaterial.material_id}`);
      setMaterials((prev) =>
        prev.filter((mat) => mat.material_id !== selectedMaterial.material_id)
      );
      setNotification({
        open: true,
        message: 'Material eliminado exitosamente',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error al eliminar el material:', error);
      setNotification({
        open: true,
        message: error.response?.data?.detail || 'Error al eliminar el material',
        severity: 'error',
      });
    } finally {
      setIsDeleting(false);
      setOpenDialog(false);
      setSelectedMaterial(null);
    }
  };

  const confirmDelete = (material) => {
    setSelectedMaterial(material);
    setOpenDialog(true);
  };

  const columns = [
    { field: 'material_id', headerName: 'ID', flex: 1 },
    { field: 'material_type', headerName: 'Tipo', flex: 1 },
    { field: 'brand', headerName: 'Marca', flex: 1 },
    { field: 'model', headerName: 'Modelo', flex: 1 },
    {
      field: 'status',
      headerName: 'Estado',
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor:
              params.value === 'Available'
                ? colors.greenAccent[500]
                : colors.redAccent[500],
            color: colors.gray[100],
            padding: '5px 10px',
            borderRadius: '4px',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'registration_date',
      headerName: 'Registro',
      flex: 1,
      valueGetter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
    },
    {
      field: 'update_date',
      headerName: 'Actualización',
      flex: 1,
      valueGetter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => (
        <Box
          display="flex"
          gap="10px"
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => goToMaterial(params.row.material_id)}
          >
            Ver
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => confirmDelete(params.row)}
          >
            Eliminar
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Materiales"
        subtitle="Gestión de materiales"
      />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': { border: 'none' },
          '& .MuiDataGrid-columnHeaders': { backgroundColor: colors.orange[500] },
          '& .MuiDataGrid-virtualScroller': { backgroundColor: colors.primary[400] },
          '& .MuiDataGrid-footerContainer': { backgroundColor: colors.orange[500] },
        }}
      >
        <DataGrid
          rows={materials}
          columns={columns}
          getRowId={(row) => row.material_id}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Seguro que deseas eliminar el material{' '}
            <strong>
              {selectedMaterial?.material_type} - {selectedMaterial?.brand}
            </strong>
            ? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            color="secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="primary"
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />

      <Loader loading={loading} />
    </Box>
  );
};

export default Materials;

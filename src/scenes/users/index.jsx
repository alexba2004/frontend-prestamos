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

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const goToUser = (id) => navigate(`/user-edit/${id}`);

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    try {
      await api.delete(`/user-edit/${selectedUser.id}`);
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
      setNotification({
        open: true,
        message: 'Usuario eliminado exitosamente',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      setNotification({
        open: true,
        message: error.response?.data?.detail || 'Error al eliminar el usuario',
        severity: 'error',
      });
    } finally {
      setIsDeleting(false);
      setOpenDialog(false);
      setSelectedUser(null);
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'first_name', headerName: 'Nombre', flex: 1 },
    { field: 'last_name', headerName: 'Apellido', flex: 1 },
    { field: 'username', headerName: 'Usuario', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'status',
      headerName: 'Estado',
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor:
              params.value === 'Active' ? colors.greenAccent[500] : colors.redAccent[500],
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
            onClick={() => goToUser(params.row.id)}
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
        title="Usuarios"
        subtitle="Gestión de usuarios"
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
          rows={users}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Seguro que deseas eliminar al usuario{' '}
            <strong>
              {selectedUser?.first_name} {selectedUser?.last_name}
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

export default Users;

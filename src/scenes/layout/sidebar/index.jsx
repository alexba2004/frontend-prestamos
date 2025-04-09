import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useContext, useState } from 'react';
import { tokens } from '../../../theme';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { MenuOutlined, PeopleAltOutlined, PersonOutlined, Inventory, CreditScore } from '@mui/icons-material';
import Item from './Item';
import { ToggledContext } from '../../../App';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: '100%',
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ':hover': { background: 'transparent' } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: '10px 0 20px 0',
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>

      <Box
        mb={5}
        pl={collapsed ? undefined : '5%'}
      >
        <Menu
          menuItemStyles={{
            button: {
              ':hover': {
                color: '#ff8533',
                background: 'transparent',
                transition: '.4s ease',
              },
            },
          }}
        ></Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: '15px 0 5px 20px' }}
        >
          {!collapsed ? 'Información' : ' '}
        </Typography>{' '}
        <Menu
          menuItemStyles={{
            button: {
              ':hover': {
                color: '#ff8533',
                background: 'transparent',
                transition: '.4s ease',
              },
            },
          }}
        >
          <Item
            title="Materiales"
            path="/materiales"
            colors={colors}
            icon={<Inventory />}
          />
          <Item
            title="Usuarios"
            path="/usuarios"
            colors={colors}
            icon={<PeopleAltOutlined />}
          />{' '}
          <Item
            title="Préstamos"
            path="/prestamos"
            colors={colors}
            icon={<CreditScore />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: '15px 0 5px 20px' }}
        >
          {!collapsed ? 'Opciones' : ' '}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ':hover': {
                color: '#ff8533',
                background: 'transparent',
                transition: '.4s ease',
              },
            },
          }}
        >
          <Item
            title="Crear material"
            path="/crear-material"
            colors={colors}
            icon={<Inventory />}
          />
          <Item
            title="Crear usuario"
            path="/crear-usuario"
            colors={colors}
            icon={<PersonOutlined />}
          />
          <Item
            title="Crear préstamo"
            path="/crear-prestamo"
            colors={colors}
            icon={<CreditScore />}
          />
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;

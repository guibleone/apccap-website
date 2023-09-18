import { useNavigate, Link } from "react-router-dom"
import { logout, reset } from '../../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { resetResume } from "../../features/resume/resumeSlice"
import { resetDocuments } from "../../features/documents/documentsSlice"
import { reset as resetAdmin } from "../../features/admin/adminSlice"
import { reset as resetProducts } from "../../features/products/productsSlice"
import { reset as resetSpreadsheet } from "../../features/spreadSheet/spreadSheetSlice"
import { Button, Container, Box, Typography, CssBaseline, Avatar, Grid, Menu, Tooltip, IconButton, MenuItem, Divider } from '@mui/material'
import { useMediaQuery } from "@mui/material"
import NavMenu from "./NavMenu"
import ButtonChangeRole from "../ChangeRole/ButtonChangeRole"
import { useState } from "react"


function Navbar() {

  const { user } = useSelector(state => state.auth)

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogout = () => {
    dispatch(resetResume())
    dispatch(logout())
    dispatch(reset())
    dispatch(resetDocuments())
    dispatch(resetAdmin())
    dispatch(resetProducts())
    dispatch(resetSpreadsheet())
    navigate('/')
  }

  const matches = useMediaQuery('(max-width:800px)')


  if (matches) {

    return (

      <Box sx={
        {
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px',
        }

      }>

        <NavMenu />

      </Box>
    )

  }

  const linkStyle = {
    color: 'inherit',
    fontFamily: 'Roboto',
    fontSize: '1rem',
    '&:hover': {
      color: '#00B2A9',
    },
    textDecoration: 'none',
  }



  return (

    <Box sx={{
      backgroundColor: '#ffffff',
    }}>

      <Container maxWidth='lg' sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #e0e0e0',

      }}>

        <Link to="/"> <img width={100} src={require('../../imgs/logo-apccap.png')} alt="Logo" /></Link>

        <Box sx={
          {
            display: 'flex',
            gap: '15px',
          }
        }>
          <Link style={linkStyle} to="/rastreabilidade">Rastreabilidade</Link>

          <Link style={linkStyle} to="/festival-cachaca">Festival da Cachaça</Link>

          <Link style={linkStyle} to="/quem-somos">Quem Somos</Link>
          <Link style={linkStyle} to="/blog">Blog</Link>
        </Box>

        {!user ?
          (
            <Box sx={
              {
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                gap: '10px',
              }
            }>
              <Link style={linkStyle} to="/entrar">Entrar</Link>
              <Link style={linkStyle} to="/registrar">Registrar</Link>
            </Box>
          )
          :
          (
            <Box sx={
              {
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
              }
            }>


              <Tooltip title="Configurações da Conta">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >

                  <Avatar src={user.pathFoto ? user.pathFoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
                    sx={{ width: 36, height: 36 }} />

                </IconButton>
              </Tooltip>

            </Box>
          )
        }

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >


          <MenuItem onClick={handleClose} component={Link} to="/meu-perfil">

            <Avatar src={(user && user.pathFoto) ? user.pathFoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
              sx={{ width: 36, height: 36 }} />


            Meu Perfil
            
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleClose} >
            {user && (
              ((user.role !== 'admin') || user.oldRole)
                ? <ButtonChangeRole />
                : null
            )}
          </MenuItem>

          <MenuItem onClick={handleClose} >
            <Button fullWidth variant="outlined" color="error" sx={
              {

              }
            } onClick={onLogout}>Sair</Button>

          </MenuItem>



        </Menu>





      </Container>

    </Box >

  )
}

export default Navbar
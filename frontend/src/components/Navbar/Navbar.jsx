import { useNavigate, Link } from "react-router-dom"
import { logout, reset } from '../../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { resetResume } from "../../features/resume/resumeSlice"
import { resetDocuments } from "../../features/documents/documentsSlice"
import { reset as resetAdmin } from "../../features/admin/adminSlice"
import { reset as resetProducts } from "../../features/products/productsSlice"
import { reset as resetSpreadsheet } from "../../features/spreadSheet/spreadSheetSlice"
import { Button, Container, Box, Typography, CssBaseline, Avatar, Grid } from '@mui/material'
import { useMediaQuery } from "@mui/material"
import NavMenu from "./NavMenu"


function Navbar() {

  const { user } = useSelector(state => state.auth)

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

              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', position: 'relative' }}>

                <Link sx={
                  {
                    color: 'inherit',
                    textDecoration: 'none',
                  }
                } to="/meu-perfil">

                  <Avatar src={user.pathFoto ? user.pathFoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
                    sx={{ width: 36, height: 36 }} />

                </Link>
                <Button variant="outlined" color="error" sx={
                  {
                    color: 'inherit',
                    textDecoration: 'none',
                    margin: '0px 10px',
                  }
                } onClick={onLogout}>Sair</Button>


              </Box>
            </Box>
          )
        }
      </Container>

    </Box>

  )
}

export default Navbar
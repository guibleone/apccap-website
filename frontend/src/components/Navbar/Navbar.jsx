import { useNavigate } from "react-router-dom"
import { logout, reset } from '../../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import './Styles.css'
import { resetResume } from "../../features/resume/resumeSlice"
import { resetDocuments } from "../../features/documents/documentsSlice"
import { Button, Link, Container, Box, Typography, CssBaseline, Avatar } from '@mui/material'
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
    navigate('/')
  }

  const matches = useMediaQuery('(max-width:800px)')


  if(matches) 
  {

    return(
    
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


  return (
    
    <Container>

      <CssBaseline />

      <Box sx={
        {
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'space-around',
          padding: '10px',
        }
      }>

        <Link sx={
          {
            color: 'inherit',
            textDecoration: 'none',
          }
        } href="/"><Typography variant="h4" component="div" >Apccap</Typography></Link>

        <Box sx={
          {
            display: 'flex',
            gap: '15px',
          }
        }>
          <Link sx={
            {
              color: 'inherit',
              textDecoration: 'none',
            }
          } href="/rastreabilidade">Rastreabilidade</Link>

          <Link sx={
            {
              color: 'inherit',
              textDecoration: 'none',

            }
          } href="/">Festival do Café</Link>
          
          <Link sx={
            {
              color: 'inherit',
              textDecoration: 'none',

            }
          } href="/">Quem Somos</Link>
          <Link sx={
            {
              color: 'inherit',
              textDecoration: 'none',

            }
          } href="/blog">Blog</Link>
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
              <Link sx={
                {
                  color: 'inherit',
                  textDecoration: 'none',
                }
              } href="/entrar">Entrar</Link>
              <Link sx={
                {
                  color: 'inherit',
                  textDecoration: 'none',
                }
              } href="/registrar">Registrar</Link>
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
                } href="/meu-perfil">

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
      </Box>
    </Container>

  )
}

export default Navbar
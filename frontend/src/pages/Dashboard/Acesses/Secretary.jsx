import { Box, Container, Typography, Button, Grid, Divider, Modal, useMediaQuery, CircularProgress, Alert } from '@mui/material'
import ReunionPaginationSecretary from '../../../components/Pagination/ReunionsSecretary'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addReunionAta, deleteReunionAta, getReunions, reset, signAta } from '../../../features/reunion/reunionSlice'
import { AiFillBook, AiFillWarning, AiOutlineDropbox } from 'react-icons/ai'
import { useDropzone } from 'react-dropzone'
import { styleError, styleSuccess } from '../../toastStyles'
import { toast } from 'react-toastify'
import ButtonChangeRole from '../../../components/ChangeRole/ButtonChangeRole'
import Reunion from '../../../components/Reunions/Reunion'
import { colors } from '../../colors'
import { BsArrowUpRight } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

export default function Secretary() {
  const [openAta, setOpeneAta] = useState(false)
  const matches = useMediaQuery('(min-width:600px)');
  const navigate = useNavigate()

  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.reunions)
  const { user } = useSelector((state) => state.auth)

  if (isLoading) {

    return <Box sx={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.main_white,
        minHeight: '100vh'
      }
    }>
      <CircularProgress sx={
        {
          marginBottom: '100px',
        }
      } size={100} />
    </Box>

  }


  return (

    <Box sx={{
      backgroundColor: colors.main_white,
      minHeight: '100vh',
    }}>

      <Container maxWidth='xl' >
        <Grid container spacing={2} pb={5}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '72px 0',
              gap: '10px'
            }}>
              <h3 className='semi-bold black'>
                Credencial
              </h3>
              <h1 className='black semi-bold'>
                Secretário
              </h1>
              <h5 className='black regular'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente at voluptatem beatae aut! Fugiat reprehenderit quasi ut nam, adipisci eaque et dolorem officia eveniet repudiandae! Inventore saepe expedita vero minus.
              </h5>
              <button onClick={() => navigate('/meu-perfil')} className='button-purple' style={{ width: '182px' }}>
                Meus Dados <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom' }} />
              </button>
            </Box>
          </Grid>

        </Grid>


        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={6}>
            <Typography variant='h6'>Relatórios de Transparência</Typography>
          </Grid>
        </Grid>


      </Container >

    </Box>
  )
}

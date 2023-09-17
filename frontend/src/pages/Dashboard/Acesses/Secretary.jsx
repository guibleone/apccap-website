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

export default function Secretary() {
  const [openAta, setOpeneAta] = useState(false)
  const matches = useMediaQuery('(min-width:600px)');

  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.reunions)
  const { user } = useSelector((state) => state.auth)



  if (isLoading) {

    return <Box sx={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
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
    <Container>
      <Box>
        <Typography variant='h5'>Bem vindo de volta, Secretário (a)</Typography>
        <Typography variant='p'>Você pode fazer os relatórios da associção.</Typography>
      </Box>


      <Divider sx={{ my: 2 }} />


      <Reunion />

      <Divider sx={{ my: 2 }} />


      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={6}>
          <Typography variant='h6'>Relatórios de Transparência</Typography>
        </Grid>
      </Grid>


    </Container >
  )
}

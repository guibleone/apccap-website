import { Box, Container, Typography, Button, Grid, Divider, Modal, useMediaQuery, CircularProgress, Alert } from '@mui/material'
import ReunionPaginationSecretary from '../../../components/Pagination/ReunionsSecretary'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addReunionAta, deleteReunionAta, getReunions, reset, signAta } from '../../../features/reunion/reunionSlice'
import { AiFillBook, AiFillWarning, AiOutlineDropbox, AiOutlineEdit } from 'react-icons/ai'
import { useDropzone } from 'react-dropzone'
import { styleError, styleSuccess } from '../../toastStyles'
import { toast } from 'react-toastify'
import ButtonChangeRole from '../../../components/ChangeRole/ButtonChangeRole'
import Reunion from '../../../components/Reunions/Reunion'
import { colors } from '../../colors'
import { BsArrowUpRight } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'

export default function Secretary() {
  const [openAta, setOpeneAta] = useState(false)
  const matches = useMediaQuery('(min-width:600px)');
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.reunions)
  const { user } = useSelector((state) => state.auth)
  const { reunionData } = useSelector((state) => state.reunions)

  // pegar reuniões
  useEffect(() => {

    dispatch(getReunions(user.token))

  }, [])

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
              gap: '36px'
            }}> <Box sx={{
              display: 'flex',
              flexDirection: 'column',
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
              </Box>
              <button onClick={() => navigate('/meu-perfil')} className='button-purple' style={{ width: '182px' }}>
                Meus Dados <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom' }} />
              </button>
            </Box>
          </Grid>

        </Grid>

        <Grid container rowSpacing={4} >
          <Grid item xs={12} md={12}>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '36px'
            }}>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <h3 className='black semi-bold'>
                  Reuniões convocadas
                </h3>

              </Box>
            </Box>
          </Grid>

          <Grid item >
            {(reunionData && reunionData.length === 0) && (
              <h3 className='regular black'>
                Nenhuma reunião convocada.
              </h3>
            )}
          </Grid>

          {reunionData && reunionData.length >= 1 &&
            reunionData.filter((reunion) => reunion).slice(0, 4).map((reunion) => (
              <Grid item xs={12} md={3} pr={matches ? 2 : 0} key={reunion._id}>
                <Box sx={{
                  backgroundColor: colors.main_grey,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <h4 className='semi-bold black'>
                      {reunion.date}
                    </h4>
                    <AiOutlineEdit size={25} />

                  </Box>

                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                  }}>
                    <h4 className='semi-bold black'>{reunion.title}</h4>
                    <Link className='regular black italic' to={`/reuniao/${reunion._id}`}>
                      <h5>Ver Reunião</h5>
                    </Link>
                  </Box>
                </Box>
              </Grid>
            ))}



          <Grid item xs={12} md={12}>
            {(reunionData && reunionData.length > 4) && (
              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <Link style={{ color: '#000', margin: '15px 0' }} to='/reunioes'> Ver Tudo</Link>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={6} lg={6}>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '36px'
            }}>
              
              <h3 className='black semi-bold'>
                Relatórios de transparência
              </h3>

            </Box>
          </Grid>

        </Grid>



        <Grid container spacing={2}>
          
        </Grid>


      </Container >

    </Box>
  )
}

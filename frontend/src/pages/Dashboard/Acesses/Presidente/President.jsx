import { Box, Container, Grid,  useMediaQuery, Modal } from '@mui/material'
import { useState, useEffect } from 'react'
import UsersPagination from '../../../../components/Pagination/Users'
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux';
import { resetEmailStatus } from '../../../../features/admin/adminSlice';
import { styleError, styleSuccess } from '../../../toastStyles'
import { Link, useNavigate } from 'react-router-dom';
import {  getReunions, reset, } from '../../../../features/reunion/reunionSlice';
import { BsArrowUpRight, BsPlusCircle } from 'react-icons/bs'
import { colors } from '../../../colors';
import { AiOutlineEdit } from 'react-icons/ai';
import ConvocarReunion from './ConvocarReunion';
registerLocale('pt-BR', ptBR)
setDefaultLocale('ptBR')

export default function President() {

  const matches = useMediaQuery('(min-width:600px)');

  // redux
  const { emailStatus } = useSelector((state) => state.admin)
  const { user, isLoading: isLoadingAuth } = useSelector((state) => state.auth)
  const { reunionData, isSuccess, isError, message: messageReunion } = useSelector((state) => state.reunions)


  const [users, setUsers] = useState([])

  // modal

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  // redux
  const dispatch = useDispatch()
  const navigate = useNavigate()


  // pegar reuniões
  useEffect(() => {

    dispatch(getReunions(user.token))

  }, [])

  // toast
  useEffect(() => {

    if (emailStatus.isSuccess) {
      toast.success(emailStatus.message, styleSuccess)
    }

    if (emailStatus.isError) {
      toast.error(emailStatus.message, styleError)
    }

    dispatch(resetEmailStatus())

  }, [emailStatus.isSuccess, emailStatus.isError])


  useEffect(() => {

    if (isError) {
      toast.error(messageReunion, styleError)
    }

    if (isSuccess) {
      toast.success(messageReunion, styleSuccess)
    }

    dispatch(reset())


  }, [isError, isSuccess, messageReunion])



  return (
    <Box sx={{
      backgroundColor: colors.main_white,
      minHeight: '100vh',
    }}>
      <Container maxWidth='xl'>
        <Grid container spacing={2} pb={5}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '72px 0',
              gap: '36px'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <h3 className='semi-bold black'>
                  Credencial
                </h3>
                <h1 className='black semi-bold'>
                  Presidente
                </h1>
                <h5 className='black regular' style={{
                  textAlign: 'justify'
                }}>
                Como presidente, desfrute de um controle completo: gerencie e convoque reuniões estratégicas, além de administrar facilmente a participação dos nossos valiosos produtores associados. Sua plataforma exclusiva para liderança eficaz na APCCAP.
                </h5>
              </Box>
              <button onClick={() => navigate('/meu-perfil')} className='button-purple' style={{ width: '182px' }}>
                Meus Dados <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom' }} />
              </button>
            </Box>
          </Grid>

        </Grid>

        <Grid container rowSpacing={2} >
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
                <button onClick={handleOpen} className='button-white-bottom-border'>
                  Nova Convocação <BsPlusCircle size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} />
                </button>

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


        </Grid>
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


        <Grid container rowSpacing={2} >
          <Grid item xs={12} md={12}>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '72px 0 20px 0',
              gap: '36px'
            }}>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <h3 className='black semi-bold'>
                  Gerenciar Produtores
                </h3>
              </Box>
            </Box>
          </Grid>


          {(users && users?.todos?.length === 0) ? (
            <Grid item >
              <h3 className='regular black'>
                Nenhum produtor credenciado.
              </h3>
            </Grid>
          ) : (
            <>

              {(users && users?.todos?.map((user) => (

                <Grid item xs={12} md={3} pr={matches ? 2 : 0} key={user._id}>
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
                        {user.dados_pessoais.name}
                      </h4>
                      <AiOutlineEdit size={25} />

                    </Box>

                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px'
                    }}>
                      <h4 className='semi-bold black'>{user.role === 'produtor_associado' ? 'Produtor Associado' : user.role}</h4>
                      <Link className='regular black italic' to={`/usuario-credenciado/${user._id}`}>
                        <h5>Ver Produtor</h5>
                      </Link>
                    </Box>
                  </Box>
                </Grid>

              ))
              )}
            </>
          )}



          <Grid item xs={12} md={12} pb={10}>
            {(users && users?.todos?.length >= 4) && (
              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <Link style={{ color: '#000', margin: '15px 0' }} to='/produtores'> Ver Tudo</Link>
              </Box>
            )}
          </Grid>

          <UsersPagination setUsersData={(u) => setUsers(u)} role={['produtor', 'produtor_associado']} invisible={true} pages={4} />

        </Grid>

      </Container >

      <Modal open={open} onClose={handleOpen} >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: matches ? '50vw' : '90vw',
          height: matches ? '80vh' : '70vh',
          backgroundColor: colors.main_white,
          padding: '24px',
          overflowY: 'scroll'
        }}>
          <ConvocarReunion onClose={handleOpen} />
        </Box>
      </Modal>

    </Box>


  )
}

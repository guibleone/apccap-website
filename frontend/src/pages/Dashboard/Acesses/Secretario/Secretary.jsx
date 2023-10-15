import { Box, Container, Typography, Button, Grid, Divider, Modal, useMediaQuery, CircularProgress, Alert } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addReunionAta, deleteReunionAta, getReunions, reset, signAta } from '../../../../features/reunion/reunionSlice'
import { addRelatory, reset as resetRelatory } from '../../../../features/relatorys/relatorysSlice'
import { AiFillBook, AiFillWarning, AiOutlineDelete, AiOutlineDownload, AiOutlineDropbox, AiOutlineEdit, AiOutlineFile } from 'react-icons/ai'
import { useDropzone } from 'react-dropzone'
import { styleError, styleSuccess } from '../../../toastStyles'
import { toast } from 'react-toastify'
import ButtonChangeRole from '../../../../components/ChangeRole/ButtonChangeRole'
import Reunion from '../../../../components/Reunions/Reunion'
import { colors } from '../../../colors'
import { BsArrowUpRight, BsDownload, BsPlusCircle } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import RelatorysPagination from '../../../../components/Pagination/Relatorys'
import { deleteRelatory } from '../../../../features/relatorys/relatorysSlice'

export default function Secretary() {
  const [openAta, setOpeneAta] = useState(false)
  const matches = useMediaQuery('(min-width:600px)');
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.reunions)
  const { isSuccess: isSuccessRelatory, isError: isErrorRelatory, message: messageRelatory, isLoading: isLoadingRelatory } = useSelector((state) => state.relatorys)
  const { user } = useSelector((state) => state.auth)
  const { reunionData } = useSelector((state) => state.reunions)

  const [relatorys, setRelatorys] = useState(null)

  // ref do input file
  const fileInputRef = useRef(null);

  // função para abrir o input file
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const [selectedFile, setSelectedFile] = useState(null); // armazena o arquivo selecionado

  // função para pegar o arquivo selecionado
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  // função para enviar a planilha
  const handleSubmit = (e) => {
    e.preventDefault()

    const data = {
      path: fileInputRef.current?.files[0],
      token: user.token
    }

    dispatch(addRelatory(data))
  }


  // pegar reuniões
  useEffect(() => {

    dispatch(getReunions(user.token))

  }, [user.token])


  useEffect(() => {

    if (isSuccessRelatory) {
      toast.success(messageRelatory, styleSuccess)
    }
    if (isErrorRelatory) {
      toast.error(messageRelatory, styleSuccess)
    }

    dispatch(resetRelatory())

  }
    , [isSuccessRelatory])

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

        <Grid container rowSpacing={5} pb={10} >
          <Grid item xs={12} md={12} >

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

          <Grid item xs={12} sm={12} lg={12} pb={4}>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '36px'
            }}>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: !matches ? 'column' : 'row',
                alignItems: 'center',

              }}>
                <h3 className='black semi-bold'>
                  Todos relatórios de transparência
                </h3>
                <Box sx={{
                  display: 'flex',
                  flexDirection: !matches ? 'column' : 'row',
                  gap: '10px'
                }}>
                  <input
                    style={{ display: 'none' }}
                    accept='.pdf, .csv'
                    type='file'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <button onClick={handleButtonClick} className='button-white-bottom-border' style={{ width: '220px' }}>
                    {selectedFile ? <>{selectedFile.name.slice(0, 10)} ... <AiOutlineEdit size={25} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /> </> : <>Novo Relatório <BsPlusCircle size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /></>}
                  </button>
                  <button onClick={handleSubmit} className='button-purple' style={{ marginLeft: '10px', backgroundColor: isLoadingRelatory && colors.main_white }}>
                    {isLoadingRelatory ? <CircularProgress color="success" style={{ padding: '5px' }} /> : <> <BsDownload size={20} style={{ verticalAlign: 'bottom', marginRight: '5px' }} /> Adicionar</>}
                  </button>
                </Box>

              </Box>
              {(relatorys && relatorys.length === 0) && (
                <h3 className='regular black'>
                  Nenhum relatório adicionado.
                </h3>
              )}

            </Box>

          </Grid>

          <Grid container columnSpacing={'30px'} rowSpacing={'15px'}>

            {relatorys && relatorys.map((relatory) => (
              <Grid item xs={12} md={2} key={relatory._id} >

                <button className='button-documentos' >
                  <Box className={'button-text'} >
                    <AiOutlineFile size={18} style={{ verticalAlign: 'center', marginRight: '12px' }} />
                    <h4 className='black regular'>
                      {relatory.title.length > 10 ? relatory.title.slice(0, 10) + '...' : relatory.title}
                    </h4>

                  </Box>
                  <Box className='documento-actions' >
                    <AiOutlineDownload onClick={() => window.location.href = `${relatory.path}`} style={{ color: '#057305' }} size={22} />
                    <AiOutlineDelete onClick={() => {
                      const data = {
                        id: relatory._id,
                        token: user.token
                      }
                      dispatch(deleteRelatory(data))
                    }} style={{ color: '#BF232C' }} size={22} />
                  </Box>
                </button>

              </Grid>

            ))}
            <Grid item xs={12} md={12}>
              {(relatorys && relatorys.length >= 6) && (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}>
                  <Link style={{ color: '#000', margin: '15px 0' }} to='/relatorios'> Ver Tudo</Link>
                </Box>
              )}
            </Grid>

          </Grid>

          <RelatorysPagination setRelatorysData={(relatory) => setRelatorys(relatory)} invisible={true} />


        </Grid>


      </Container >

    </Box>
  )
}

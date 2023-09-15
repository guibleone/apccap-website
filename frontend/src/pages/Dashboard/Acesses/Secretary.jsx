import { Box, Container, Typography, Button, Grid, Divider, Modal, useMediaQuery, CircularProgress } from '@mui/material'
import ReunionPaginationSecretary from '../../../components/Pagination/ReunionsSecretary'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addReunionAta, deleteReunionAta, getReunions, reset } from '../../../features/reunion/reunionSlice'
import { AiFillBook, AiFillWarning, AiOutlineDropbox } from 'react-icons/ai'
import { useDropzone } from 'react-dropzone'
import { styleError, styleSuccess } from '../../toastStyles'
import { toast } from 'react-toastify'

export default function Secretary() {
  const [openAta, setOpeneAta] = useState(false)
  const [openRepprove, setOpenRepprove] = useState(false)

  const matches = useMediaQuery('(min-width:600px)');

  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.reunions)
  const { user } = useSelector((state) => state.auth)

  const handleOpenAta = () => setOpeneAta(!openAta)
  const handleOpenRepprove = () => setOpenRepprove(!openRepprove)

  const style = matches ? {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,

  } : {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,

  }

  const dispatch = useDispatch()
  const [reunions, setReunions] = useState([])


  const [file, setFile] = useState(null)
  const [id, setId] = useState(null)

  // on drop arquivos
  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {

    if (rejectedFiles.length > 0) {
      // Handle files with invalid extensions here
      console.error('Arquivos inválidos', rejectedFiles);
      return;
    }

    setFile(acceptedFiles)
  }, []);

  // configurações do dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf',
    multiple: false,
  });

  const handleAddAta = () => {

    if (!file) return toast.error('Selecione um arquivo', styleError)

    const reunionData = {
      id,
      ata: file[0],
      token: user.token
    }

    dispatch(addReunionAta(reunionData))

    handleOpenAta()

    setFile(null)
    setId(null)

  }

  const handleDeleteAta = (id) => {

    const reunionData = {
      id,
      token: user.token
    }

    dispatch(deleteReunionAta(reunionData))

  }

  useEffect(() => {

    dispatch(getReunions(user.token))

  }, [])

  useEffect(() => {

    if (isError) {
      toast.error(message, styleError)
    }

    if (isSuccess) {
      toast.success(message, styleSuccess)
    }

    dispatch(reset())


  }, [])


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

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} lg={12}>
          <Typography variant='h6'>Reuniões Concluídas</Typography>
        </Grid>

        {reunions && reunions.length > 0 ?
          reunions
            .map((reunion, index) => (
              <Grid item sm={12} lg={3} key={index}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Typography variant='h6'>{reunion.title}</Typography>
                  <Typography variant='h7'>Data: {reunion.date}</Typography>
                  <Typography variant='h7'>Tipo: {reunion.type}</Typography>
                  <Box sx={{ display: 'flex', gap: '10px' }}>
                    {reunion.ata && reunion.ata.path ?
                      <>
                        <Button variant='outlined' color='warning' href={reunion.ata && reunion.ata.path} target='_blank' >Visualizar</Button>
                        <Button variant='outlined' color='success' onClick={() => {handleDeleteAta(reunion._id)}} >Deletar</Button>
                      </>
                      :
                      <Button variant='outlined' color='success' onClick={() => { handleOpenAta(); setFile(null); setId(reunion._id) }} >Adicionar Ata</Button>
                    }
                  </Box>
                </Box>

              </Grid>
            ))
          : <Typography variant='h7'>Nenhuma reunião marcada</Typography>}

      </Grid>

      <ReunionPaginationSecretary setReunionData={(r) => setReunions(r)} />


      <Divider sx={{ my: 2 }} />


      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={6}>
          <Typography variant='h6'>Relatórios de Transparência</Typography>
        </Grid>
      </Grid>

      <Modal
        open={openAta}
        onClose={handleOpenRepprove}
      >
        <Box sx={style}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant="h6" >Selecione um documento </Typography>
              <AiFillBook size={30} />
            </Box>



            <Box sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
              p: 1,
              border: isDragActive ? '1px solid #E4E3E3' : '',
              borderRadius: '5px',
              boxShadow: isDragActive ? '0px 0px 5px 0px rgba(0,0,0,0.75)' : '',
            }} {...getRootProps()}>
              <input multiple {...getInputProps()} />
              <Button variant='outlined' color='success'><AiOutlineDropbox size={80} /> </Button>
              <Typography textAlign={'center'} variant='p'>Arraste e solte o arquivo ou clique para selecionar</Typography>
            </Box>

            {file && <Typography textAlign={'center'} variant='p'>Arquivo selecionado: {file[0].name}</Typography>}

            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button color='error' variant='outlined' onClick={handleOpenAta}>Cancelar</Button>

              <Button
                disabled={isLoading}
                color="success"
                variant='outlined'
                onClick={handleAddAta}
              >
                {isLoading ? <CircularProgress color="success" size={24} /> : 'Adicionar'}
              </Button>

            </Box>
          </Box>
        </Box>
      </Modal>


    </Container>
  )
}

import { useCallback, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addDocument, deleteDocument, downloadDocument } from "../../features/documents/documentsSlice"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { resetDocuments } from "../../features/documents/documentsSlice"
import { Button, Typography, Box, Stack, CircularProgress, Grid, Divider, Alert } from '@mui/material';
import { FaDownload, FaTrash } from 'react-icons/fa'
import { styleError, styleSuccess } from '../toastStyles'
import { useDropzone } from "react-dropzone"
import { AiOutlineDropbox } from "react-icons/ai"

function Documents() {

  const { user } = useSelector((state) => state.auth)
  const { documents } = useSelector((state) => state.documents)

  const dispatch = useDispatch()

  // informação do documento
  const [documentData, setDocumentData] = useState({
    name: '',
    path: '',
    type: '',
    user: user._id,
    token: user.token
  })

  // estados do documento
  const { isError, isLoading, isSuccess, message } = useSelector((state) => state.documents)

  const [types, setTypes] = useState([])


  const handleDocument = (type) => {

    if (type && documentData.name && documentData.path) {
      dispatch(addDocument({ ...documentData, type }));
    }
    else {
      toast.error('Selecione um arquivo', styleError)
    }

    setDocumentData({ ...documentData, name: '', path: '', type: '' })
  };

  // on drop arquivos
  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {

    if (rejectedFiles.length > 0) {
      // Handle files with invalid extensions here
      toast.error('Arquivos inválidos', rejectedFiles);
      return;
    }

    setDocumentData({ ...documentData, name: acceptedFiles[0].name, path: acceptedFiles[0] })

  }, []);

  // configurações do dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf',
    multiple: true,
  });

  useEffect(() => {
    if (documents && isError) {
      toast.error(message, styleError)
    }

    dispatch(resetDocuments())

  }, [isError, isSuccess, message, documents, dispatch])

  useEffect(() => {
    if (documents && documents.length > 0) {
      setTypes(documents.map((document) => document.type))
    }

  }, [documents]);

  useEffect(() => {
    console.log(types);
  }, [types]);

  if (isLoading) {
    return <Box sx={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }>
      <CircularProgress sx={
        {
          margin: '100px',
        }
      } size={100} />
    </Box>
  }

  return (
    <Box sx={
      {
        marginBottom: '20px',
        gap: '5px'
      }
    }>

      <Typography variant='h5' textAlign={'center'} >Documentos</Typography>

      <Grid container spacing={2} sx={{marginTop:'20px'}}>

        <Grid item xs={12} sm={6} lg={2.5}>
          {types.includes('cnpj_cpf') ?
            <>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                p: 1,
                borderRadius: '5px',
              }}>
                <Typography textAlign={'center'} variant='h7'>Cartão de CNPJ e CPF</Typography>
                <Alert color='success'>Adicionado</Alert>
              </Box>
            </> :
            <>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px',
                p: 1,
                border: isDragActive ? '1px solid #E4E3E3' : '',
                borderRadius: '5px',
                boxShadow: isDragActive ? '0px 0px 5px 0px rgba(0,0,0,0.75)' : '',
                minHeight: '220px',
              }} {...getRootProps()}>
                <Typography textAlign={'center'} variant='h7'>Cartão de CNPJ e CPF</Typography>
                <input {...getInputProps()} />
                <Button variant='outlined' color='success'><AiOutlineDropbox size={80} /> </Button>
                <Typography textAlign={'center'} variant='p'>Arraste e solte os arquivos ou clique para selecionar</Typography>
              </Box>

              <Button fullWidth variant='outlined' onClick={() => handleDocument('cnpj_cpf')} color='warning'>Adicionar</Button>
              
            </>
          }

        </Grid>

        <Divider sx={{margin:'0 20px'}} orientation="vertical" flexItem />

        <Grid item xs={12} sm={6} lg={2.5}>
          {types.includes('mapa') ?
            <>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                p: 1,
                borderRadius: '5px',
              }}>
                <Typography textAlign={'center'} variant='h7'>MAPA</Typography>
                <Alert color='success'>Adicionado</Alert>
              </Box>
            </> :
            <>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px',
                p: 1,
                border: isDragActive ? '1px solid #E4E3E3' : '',
                borderRadius: '5px',
                boxShadow: isDragActive ? '0px 0px 5px 0px rgba(0,0,0,0.75)' : '',
                minHeight: '220px',
              }} {...getRootProps()}>
                <Typography textAlign={'center'} variant='h7'>MAPA</Typography>
                <input {...getInputProps()} />
                <Button variant='outlined' color='success'><AiOutlineDropbox size={80} /> </Button>
                <Typography textAlign={'center'} variant='p'>Arraste e solte os arquivos ou clique para selecionar</Typography>
              </Box>
              <Button fullWidth variant='outlined' onClick={() => handleDocument('mapa')} color='warning'>Adicionar</Button>

            </>}
        </Grid>

        <Divider sx={{margin:'0 20px'}} orientation="vertical" flexItem />

        <Grid item xs={12} sm={6} lg={2.5}>
          {types.includes('art') ?
            <>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                p: 1,
                borderRadius: '5px',
              }}>
                <Typography textAlign={'center'} variant='h7'>ART</Typography>
                <Alert color='success'>Adicionado</Alert>
              </Box>
            </> :
            <>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px',
                p: 1,
                border: isDragActive ? '1px solid #E4E3E3' : '',
                borderRadius: '5px',
                boxShadow: isDragActive ? '0px 0px 5px 0px rgba(0,0,0,0.75)' : '',
                minHeight: '220px',
              }} {...getRootProps()}>
                <Typography textAlign={'center'} variant='h7'>ART</Typography>
                <input {...getInputProps()} />
                <Button variant='outlined' color='success'><AiOutlineDropbox size={80} /> </Button>
                <Typography textAlign={'center'} variant='p'>Arraste e solte os arquivos ou clique para selecionar</Typography>
              </Box>
              <Button fullWidth variant='outlined' onClick={() => handleDocument('art')} color='warning'>Adicionar</Button>

            </>}

        </Grid>

        <Divider sx={{margin:'0 20px'}} orientation="vertical" flexItem />

        <Grid item xs={12} sm={6} lg={2.5}>
          {types.includes('parecer') ?
            <>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                p: 1,
                borderRadius: '5px',
              }}>
                <Typography textAlign={'center'} variant='h7'>Parecer Técnico</Typography>
                <Alert color='success'>Adicionado</Alert>
              </Box>
            </> :
            <>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px',
                p: 1,
                border: isDragActive ? '1px solid #E4E3E3' : '',
                borderRadius: '5px',
                boxShadow: isDragActive ? '0px 0px 5px 0px rgba(0,0,0,0.75)' : '',
                minHeight: '220px',
              }} {...getRootProps()}>
                <Typography textAlign={'center'} variant='h7'>Parecer Técnico</Typography>
                <input {...getInputProps()} />
                <Button variant='outlined' color='success'><AiOutlineDropbox size={80} /> </Button>
                <Typography textAlign={'center'} variant='p'>Arraste e solte os arquivos ou clique para selecionar</Typography>
              </Box>

              <Button fullWidth variant='outlined' onClick={() => handleDocument('parecer')} color='warning'>Adicionar</Button>

            </>}
        </Grid>

      </Grid>


      

    </Box >
  )
}

export default Documents
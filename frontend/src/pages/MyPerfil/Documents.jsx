import { useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addDocument, deleteDocument, downloadDocument } from "../../features/documents/documentsSlice"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { resetDocuments } from "../../features/documents/documentsSlice"
import { Button, Typography,Box, Stack, CircularProgress } from '@mui/material';
import { FaDownload, FaTrash } from 'react-icons/fa'

function Documents() {

  const { user } = useSelector((state) => state.auth)
  const { documents } = useSelector((state) => state.documents)

  const dispatch = useDispatch()

  // informação do documento
  const [documentData, setDocumentData] = useState({
    name: '',
    path: '',
    user: user._id,
    token: user.token
  })

  // estados do documento
  const { isError, isLoading, isSuccess, message } = useSelector((state) => state.documents)

  // referência do input file
  const fileInputRef = useRef(null)

  // função para pegar o arquivo
  const onChange = () => {
    setDocumentData({ ...documentData, name: fileInputRef.current.files[0].name, path: fileInputRef.current.files[0] })
  }

  // função para enviar o arquivo
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addDocument(documentData))

  }

  useEffect(() => {
    if (documents && isError) {
      toast.error(message)
    }

    dispatch(resetDocuments())

  }, [isError, isSuccess, message, documents, dispatch])


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
      }
    }>

      <Typography sx={
        {
          marginBottom: '20px',

        }} variant='h5' >Documentos</Typography>

      <form onSubmit={handleSubmit}>
        <input onChange={onChange} type="file" ref={fileInputRef} />
        <Button sx={{margin:'10px 0'}} type="submit" variant="contained" color="primary">Adicionar</Button>
      </form>

        {documents && documents.length > 0 ? (<Box sx={
          {
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }
        }>

          {documents.map((document) => (
            
            <div key={document._id}>
              <Stack spacing={1} direction="row" alignItems="center">
              <p>{document.name}</p>
              <Button variant="contained" color="success" onClick={() => dispatch(downloadDocument(document))}><FaDownload /> </Button>
              <Button variant="contained" color="error" onClick={() => dispatch(deleteDocument({ document: document._id }))}><FaTrash /> </Button>
              </Stack>
            </div>
            
          ))
          }
        </Box>) : (
            <Typography sx={
              {
                marginBottom: '20px',
      
              }} variant='h5' >Adicione algum documento</Typography>
        )}

     
    </Box>
  )
}

export default Documents
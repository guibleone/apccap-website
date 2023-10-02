import { Alert, Box, Button, CircularProgress, Container, Divider, Grid, Modal, Typography, useMediaQuery } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserData, resetEmailStatus, sendProductRelatoryEmail } from '../../../../../features/admin/adminSlice'
import { AiFillWarning, AiOutlineDelete, AiOutlineDownload, } from 'react-icons/ai'
import { addRelatorysProducts, approveProductRelatory, deleteRelatorysProducts, getSingleProduct, repproveProductRelatory } from '../../../../../features/products/productsSlice'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../../../../toastStyles'
import { FcPrivacy } from 'react-icons/fc'
import { colors } from '../../../../colors'


export default function SingleUserProduct() {
  const dispatch = useDispatch()

  const { productData, isLoading } = useSelector((state) => state.products)
  const { userData, isSuccess, isError, message, emailStatus } = useSelector((state) => state.admin)
  const { user } = useSelector((state) => state.auth)

  const { id } = useParams()

  const matches = useMediaQuery('(min-width:800px)')

  const fileInput = useRef(null)

  const [openApprove, setOpenApprove] = useState(false)
  const [openRepprove, setOpenRepprove] = useState(false)
  const [type, setType] = useState('')

  const handleOpenApprove = () => setOpenApprove(!openApprove)
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

  // informação do documento
  const [documentData, setDocumentData] = useState({
    type: '',
    path: '',
    id,
    token: user.token
  })

  const onChange = (e) => {
    setDocumentData({ ...documentData, type: e.target.name, path: fileInput.current.files[0] })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!documentData.path) return toast.error('Selecione um arquivo', styleError)

    dispatch(addRelatorysProducts(documentData))
  }

  const handleDelete = () => {

    const data = {
      id,
      token: user.token,
      type
    }

    dispatch(deleteRelatorysProducts(data))
  }

  const approveRelatory = () => {
    const data = {
      id,
      token: user.token,
      type
    }

    const emailData = {
      email: userData.email,
      result: 'APROVADO',
      type: type,
      produto: productData.name
    }

    dispatch(approveProductRelatory(data)) && dispatch(sendProductRelatoryEmail(emailData))

    setOpenApprove(false)
  }

  const repproveRelatory = () => {

    const data = {
      id,
      token: user.token,
      type
    }

    const emailData = {
      email: userData.email,
      result: 'REPROVADO',
      type: type,
      produto: productData.name
    }

    dispatch(repproveProductRelatory(data)) && dispatch(sendProductRelatoryEmail(emailData))

    setOpenRepprove(false)

  }

  useEffect(() => {

    dispatch(getSingleProduct(id))

  }, []);

  useEffect(() => {

    if (productData.producer) {
      dispatch(getUserData({ id: productData.producer, token: user.token }))
    }

  }, [productData]);

  useEffect(() => {

    if (isError && !emailStatus.isError) {
      toast.error(message, styleError)
    }

    if (isSuccess && !emailStatus.isSuccess) {
      toast.success(message, styleSuccess)
    }

    if (emailStatus.isError) {
      toast.error('Erro ao enviar email', styleError)
    }

    if (emailStatus.isSuccess) {
      toast.success('Email enviado com sucesso', styleSuccess)
    }

    dispatch(resetEmailStatus())

  }, [isError, isSuccess, emailStatus.isError, emailStatus.isSuccess])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);


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
      backgroundColor:colors.main_white,
      minHeight: '100vh',
  }}>
  <Container maxWidth='lg'>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} lg={3} >
          <Typography variant='h5'>Informações do Produto</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px'}}>
            <Typography variant='p'><strong>Nome:</strong> {productData.name}</Typography>
            <Typography variant='p'><strong>Descrição:</strong> {productData.description}</Typography>
            <Typography variant='p'><strong>Produtor:</strong> {userData.dados_pessoais.name}</Typography>
            <Typography variant='p'><strong>Selos Pedidos:</strong> {productData.selo && productData.selo.quantity}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} lg={3} >
          <Typography variant='h5'>Documentos</Typography>

          <Box sx={{ height: '80px', paddingRight:1 }}>
            {productData.relatorys && productData.relatorys.length > 0 ? productData.relatorys.map((doc) => (
              <>
                <Box key={doc._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='p' noWrap>{doc.name}</Typography>
                  <Button variant='outlined' color="success" href={doc.path} download={doc.name}><AiOutlineDownload /></Button>
                </Box>

                <Divider sx={{ margin: '5px 0' }} />
              </>
            )) : <Typography variant='p'>Nenhum documento enviado</Typography>}

          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ margin: '20px 0' }} />

      <Typography textAlign={'center'} variant='h5'>Etapas da Análise</Typography>

      <Grid container spacing={2} sx={{ marginTop: '20px', marginBottom: '40px' }} >

        <Grid item xs={12} sm={12} lg={3.9} >

          <form name="analise_pedido" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

              <Typography variant='h6'>Análise do pedido</Typography>
              <Typography variant='p'>Parecer sobre os documentos do produtor</Typography>

              {productData.analise && !productData.analise.analise_pedido.path ? (
                <>
                  <input onChange={onChange} type="file" name="analise_pedido" ref={fileInput} />
                  <Button type="submit" variant="outlined" color="primary">Adicionar</Button>
                </>) : (
                <>
                  {productData.analise && productData.analise.analise_pedido.status === 'pendente' &&
                    <Box sx={{ display: 'flex', gap: '5px' }}>
                      <Button color="success" href={productData.analise && productData.analise.analise_pedido.path}><AiOutlineDownload size={25} /></Button>
                      <Button onClick={() => handleDelete('analise_pedido')} color="error"><AiOutlineDelete size={25} /></Button>
                    </Box>
                  }

                  {productData.analise && (
                    <>
                      {productData.analise.analise_pedido.status === 'pendente' &&
                        <Box sx={{ display: 'flex', gap: '5px' }}>
                          <Button onClick={() => { handleOpenRepprove(); setType('analise_pedido'); }} color='error'>Reprovar</Button>
                          <Button onClick={() => { handleOpenApprove(); setType('analise_pedido'); }} color='success'>Aprovar</Button>
                        </Box>
                      }

                      {productData.analise.analise_pedido.status === 'reprovado' &&
                        <Alert severity="error">Relatório reprovado pela direção</Alert>
                      }

                      {productData.analise.analise_pedido.status === 'aprovado' &&
                        <Alert severity="success">Análise de relatório concluída</Alert>
                      }
                    </>
                  )}
                </>

              )}
            </Box>
          </form>


        </Grid>

        <Divider orientation="vertical" flexItem={matches} />

        <Grid item xs={12} sm={12} lg={3.9} >
          <form name='vistoria' onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

              <Typography variant='h6'>Vistoria</Typography>
              <Typography variant='p'>Parecer do técnico sobre a cadeia produtiva</Typography>

              {(productData.analise && productData.analise.vistoria.path === '') ?
                (productData.analise && productData.analise.analise_pedido.status !== 'aprovado') ? (<FcPrivacy size={35} />) : (
                  <>
                    <input onChange={onChange} type="file" name="vistoria" id="vistoria" ref={fileInput} />
                    <Button type="submit" variant="outlined" color="primary">Adicionar</Button>
                  </>
                )
                : (
                  <>
                    {productData.analise && productData.analise.vistoria.status === 'pendente' &&
                      <Box sx={{ display: 'flex', gap: '5px' }}>
                        <Button color="success" href={productData.analise && productData.analise.vistoria.path}><AiOutlineDownload size={25} /></Button>
                        <Button onClick={() => handleDelete('vistoria')} color="error"><AiOutlineDelete size={25} /></Button>
                      </Box>
                    }
                    {productData.analise && (
                      <>
                        {productData.analise.vistoria.status === 'pendente' &&
                          <Box sx={{ display: 'flex', gap: '5px' }}>
                            <Button onClick={() => { handleOpenRepprove(); setType('vistoria'); }} color='error'>Reprovar</Button>
                            <Button onClick={() => { handleOpenApprove(); setType('vistoria'); }} color='success'>Aprovar</Button>
                          </Box>
                        }

                        {productData.analise.vistoria.status === 'reprovado' &&
                          <Alert severity="error">Relatório reprovado pela direção</Alert>
                        }

                        {productData.analise.vistoria.status === 'aprovado' &&
                          <Alert severity="success">Análise de relatório concluída</Alert>
                        }
                      </>
                    )}
                  </>
                )}
            </Box>
          </form>
        </Grid>

        <Divider orientation={matches ? 'vertical' : ''} flexItem={matches} />

        <Grid item xs={12} sm={12} lg={3.8} >
          <form name="analise_laboratorial" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

              <Typography variant='h6'>Análise Laboratorial</Typography>
              <Typography variant='p'>Parecer do laboratório credenciado</Typography>

              {productData.analise && !productData.analise.analise_laboratorial.path ?
                (productData.analise.analise_pedido.status !== 'aprovado' || productData.analise.vistoria.status !== 'aprovado') ? (<FcPrivacy size={35} />) : (
                  <>
                    <input onChange={onChange} type="file" name="analise_laboratorial" ref={fileInput} />
                    <Button type="submit" variant="outlined" color="primary">Adicionar</Button>
                  </>
                ) : (
                  <>
                    {productData.analise && productData.analise.analise_laboratorial.status === 'pendente' &&
                      <Box sx={{ display: 'flex', gap: '5px' }}>
                        <Button color="success" href={productData.analise && productData.analise.analise_laboratorial.path}><AiOutlineDownload size={25} /></Button>
                        <Button onClick={() => handleDelete('analise_laboratorial')} color="error"><AiOutlineDelete size={25} /></Button>
                      </Box>
                    }

                    {productData.analise && (
                      <>
                        {productData.analise.analise_laboratorial.status === 'pendente' &&
                          <Box sx={{ display: 'flex', gap: '5px' }}>
                            <Button onClick={() => { handleOpenRepprove(); setType('analise_laboratorial'); }} color='error'>Reprovar</Button>
                            <Button onClick={() => { handleOpenApprove(); setType('analise_laboratorial'); }} color='success'>Aprovar</Button>
                          </Box>
                        }

                        {productData.analise.analise_laboratorial.status === 'reprovado' &&
                          <Alert severity="error">Relatório reprovado pela direção</Alert>
                        }

                        {productData.analise.analise_laboratorial.status === 'aprovado' &&
                          <Alert severity="success">Análise de relatório concluída</Alert>
                        }
                      </>
                    )}
                  </>
                )}
            </Box>
          </form>
        </Grid>
      </Grid>


      <Modal
        open={openApprove}
        onClose={handleOpenApprove}
      >
        <Box sx={style}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant="h6" >Tem certeza ? </Typography>
              <AiFillWarning color='red' size={30} />
            </Box>

            <Typography variant="h7" > Essa ação é permanente. </Typography>
            <Typography color='error' variant="p" > Será enviado um email ao produtor.</Typography>

            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button color='error' variant='contained' onClick={handleOpenApprove}>Cancelar</Button>

              <Button
                disabled={isLoading}
                color="success"
                variant='contained'
                onClick={approveRelatory}
              >
                {isLoading ? <CircularProgress color="success" size={24} /> : 'Aprovar'}
              </Button>

            </Box>
          </Box>
        </Box>
      </Modal>


      <Modal
        open={openRepprove}
        onClose={handleOpenRepprove}
      >
        <Box sx={style}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant="h6" >Tem certeza ? </Typography>
              <AiFillWarning color='red' size={30} />
            </Box>

            <Typography variant="h7" > Essa ação é permanente. </Typography>
            <Typography color='error' variant="p" > Será enviado um email ao produtor.</Typography>

            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button color='error' variant='contained' onClick={handleOpenRepprove}>Cancelar</Button>

              <Button
                disabled={isLoading}
                color="success"
                variant='contained'
                onClick={repproveRelatory}
              >
                {isLoading ? <CircularProgress color="success" size={24} /> : 'Reprovar'}
              </Button>

            </Box>
          </Box>
        </Box>
      </Modal>

    </Container>
    </Box>

  )
}

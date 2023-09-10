import { Alert, Box, Button, CircularProgress, Container, Divider, Grid, Typography, useMediaQuery } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  sendProductRelatoryEmail } from '../../../../../features/admin/adminSlice'
import { AiOutlineDelete, AiOutlineDownload, } from 'react-icons/ai'
import { addRelatorysProducts, approveProductRelatory, deleteRelatorysProducts, getSingleProduct, repproveProductRelatory } from '../../../../../features/products/productsSlice'
import { toast } from 'react-toastify'
import { styleError } from '../../../../toastStyles'
import { FcPrivacy } from 'react-icons/fc'


export default function SingleUserProduct() {
  const dispatch = useDispatch()

  const { productData, isLoading } = useSelector((state) => state.products)

  const { id } = useParams()

  const matches = useMediaQuery('(min-width:800px)')

  const fileInput = useRef(null)


  const { userData } = useSelector((state) => state.admin)
  const { user } = useSelector((state) => state.auth)


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

  const handleDelete = (type) => {

    const data = {
      id,
      token: user.token,
      type
    }

    dispatch(deleteRelatorysProducts(data))
  }

  const approveRelatory = (type) => {
    const data = {
      id,
      token: user.token,
      type
    }

    dispatch(approveProductRelatory(data))

    const emailData = {
      email: userData.email,
      result: 'APROVADO',
      type: type,
      produto: productData.name
    }

    dispatch(sendProductRelatoryEmail(emailData))


  }

  const repproveRelatory = (type) => {
    const data = {
      id,
      token: user.token,
      type
    }

    dispatch(repproveProductRelatory(data))

    const emailData = {
      email: userData.email,
      result: 'REPROVADO',
      type: type,
      produto: productData.name
    }

    dispatch(sendProductRelatoryEmail(emailData))

  }

  useEffect(() => {

    dispatch(getSingleProduct(id))

  }, [id, dispatch]);

  if (isLoading) {
    return <Box sx={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
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
    <Container sx={{ minHeight: '100vh' }}>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} lg={3} >
          <Typography variant='h5'>Documentos</Typography>

          <Box sx={{ height: '80px' }}>
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
                     <Box sx={{ display: 'flex', gap:'5px' }}>
                      <Button color="success" href={productData.analise && productData.analise.analise_pedido.path}><AiOutlineDownload size={25} /></Button>
                      <Button onClick={() => handleDelete('analise_pedido')} color="error"><AiOutlineDelete size={25} /></Button>
                    </Box>
                  }

                  {productData.analise && (
                    <>
                      {productData.analise.analise_pedido.status === 'pendente' &&
                        <Box sx={{ display: 'flex', gap:'5px' }}>
                          <Button onClick={() => repproveRelatory('analise_pedido')} variant='outlined' color='error'>Reprovar</Button>
                          <Button onClick={() => approveRelatory('analise_pedido')} variant='outlined' color='success'>Aprovar</Button>
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
                       <Box sx={{ display: 'flex', gap:'5px' }}>
                        <Button color="success" href={productData.analise && productData.analise.vistoria.path}><AiOutlineDownload size={25} /></Button>
                        <Button onClick={() => handleDelete('vistoria')} color="error"><AiOutlineDelete size={25} /></Button>
                      </Box>
                    }
                    {productData.analise && (
                      <>
                        {productData.analise.vistoria.status === 'pendente' &&
                           <Box sx={{ display: 'flex', gap:'5px' }}>
                            <Button onClick={() => repproveRelatory('vistoria')} variant='outlined' color='error'>Reprovar</Button>
                            <Button onClick={() => approveRelatory('vistoria')} variant='outlined' color='success'>Aprovar</Button>
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
                       <Box sx={{ display: 'flex', gap:'5px' }}>
                        <Button color="success" href={productData.analise && productData.analise.analise_laboratorial.path}><AiOutlineDownload size={25} /></Button>
                        <Button onClick={() => handleDelete('analise_laboratorial')} color="error"><AiOutlineDelete size={25} /></Button>
                      </Box>
                    }

                    {productData.analise && (
                      <>
                        {productData.analise.analise_laboratorial.status === 'pendente' &&
                           <Box sx={{ display: 'flex', gap:'5px' }}>
                            <Button onClick={() => repproveRelatory('analise_laboratorial')} variant='outlined' color='error'>Reprovar</Button>
                            <Button onClick={() => approveRelatory('analise_laboratorial')} variant='outlined' color='success'>Aprovar</Button>
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

    </Container>

  )
}

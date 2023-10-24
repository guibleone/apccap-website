import { Alert, Box, Button, CircularProgress, Container, Divider, Grid, Dialog, TextField, Typography, useMediaQuery, DialogContent } from '@mui/material'
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
      email: userData.dados_pessoais.email,
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
      email: userData.dados_pessoais.email,
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


  if (isLoading || !productData) {

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
      <Container maxWidth='xl'>

        <Grid container spacing={2} pt={!matches ? 9 : 2} >


          <Grid item xs={12} md={4}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>

              <h3 style={{
                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                textAlign: matches ? 'left' : 'center'
              }} >
                Propriedade
              </h3>

              <div>
                <label style={{ fontWeight: 600 }}>Nome </label>
                <h4 className='regular black'>
                  {userData?.propriedade?.nome_propriedade}
                </h4>
              </div>

              <div>
                <label style={{ fontWeight: 600 }}>Área Total </label>
                <h4 className='regular black'>
                  {userData?.propriedade?.area_total}
                </h4>
              </div>


              <div>
                <label style={{ fontWeight: 600 }}>CPF do proprietário </label>
                <h4 className='regular black'>
                  {userData?.propriedade?.cpfProprietario}
                </h4>
              </div>


              <div>
                <label style={{ fontWeight: 600 }}>Endereço </label>
                <h4 className='regular black'>
                  {userData?.propriedade?.logradouro_propriedade} , {userData?.propriedade?.numero_propriedade} <br />
                  {userData?.propriedade?.cidade_propriedade} / {userData?.propriedade?.estado_propriedade}
                </h4>
              </div>

              <div>
                <label style={{ fontWeight: 600 }}>Telefone</label>
                <h4 className='regular black'>
                  {userData?.propriedade?.telefone_propriedade}
                </h4>
              </div>

              <div>
                <label style={{ fontWeight: 600 }}>Celular</label>
                <h4 className='regular black'>
                  {userData?.propriedade?.celular_propriedade}
                </h4>
              </div>

            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>

              <h3 style={{
                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                textAlign: matches ? 'left' : 'center'
              }} >
                Informações do produto
              </h3>


              <div>
                <label style={{ fontWeight: 600 }}>Nome </label>
                <h4 className='regular black'>
                  {productData?.name}
                </h4>
              </div>

              <div>
                <label style={{ fontWeight: 600 }}>Descrição </label>
                <h4 className='regular black'>
                  {productData?.description}
                </h4>
              </div>

              <div>
                <label style={{ fontWeight: 600 }}>Selos pedidos </label>
                <h4 className='regular black'>
                  {productData?.selo?.quantity}
                </h4>
              </div>

            </Box>

          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>

              <h3 style={{
                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                textAlign: matches ? 'left' : 'center'
              }} >
                Documentos
              </h3>

              <Box >
                {productData?.relatorys && productData?.relatorys.length > 0 ? productData?.relatorys.map((doc) => (
                  <>
                    <Box key={doc._id} sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px' }}>
                      <h4 className='regular black'>{doc.name}</h4>
                      <Button variant='outlined' color="success" href={doc.path} download={doc.name}><AiOutlineDownload /></Button>
                    </Box>

                    <Divider sx={{ margin: '5px 0' }} />
                  </>
                )) : <h4 >Nenhum documento enviado</h4>}

              </Box>

            </Box>

          </Grid>



        </Grid>



        <Grid container spacing={2} sx={{ marginTop: '20px', paddingBottom:'72px'}} >
          <Grid item xs={12} sm={12} lg={12} pb={4} >
            <h3 style={{
              fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
              textAlign: matches ? 'left' : 'center'
            }} >
              Etapas da análise
            </h3>
          </Grid>
          <Grid item xs={12} sm={12} lg={3.9} >
            <form name="analise_pedido" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                <h3 >Análise do pedido</h3>
                <h4 style={{ textAlign: 'center' }} className="regular black">Parecer sobre os documentos do produtor</h4>
                {productData?.analise && !productData?.analise?.analise_pedido?.path ? (
                  <>
                    <TextField size="small" type='file' onChange={onChange} name="analise_pedido" inputRef={fileInput} />
                    <button type="submit" className="button-purple">Adicionar</button>
                  </>
                ) : (
                  <>
                    {productData?.analise && productData?.analise?.analise_pedido?.status === 'pendente' &&
                      <Box sx={{ display: 'flex', gap: '5px' }}>
                        <Button color="success" href={productData?.analise?.analise_pedido?.path}><AiOutlineDownload size={25} /></Button>
                        <Button onClick={() => handleDelete('analise_pedido')} color="error"><AiOutlineDelete size={25} /></Button>
                      </Box>
                    }
                    {productData?.analise && (
                      <>
                        {productData?.analise?.analise_pedido?.status === 'pendente' &&
                          <Box sx={{ display: 'flex', gap: '5px' }}>
                            <Button onClick={() => { handleOpenRepprove(); setType('analise_pedido'); }} color='error'>Reprovar</Button>
                            <Button onClick={() => { handleOpenApprove(); setType('analise_pedido'); }} color='success'>Aprovar</Button>
                          </Box>
                        }
                        {productData?.analise?.analise_pedido?.status === 'reprovado' &&
                          <Alert severity="error">Relatório reprovado pela direção</Alert>
                        }
                        {productData?.analise?.analise_pedido?.status === 'aprovado' &&
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
                <h3 >Vistoria</h3>
                <h4 style={{ textAlign: 'center' }} className="regular black" >Parecer do técnico sobre a cadeia produtiva</h4>

                {(productData?.analise?.vistoria?.path === '') ? (
                  (productData?.analise?.analise_pedido?.status !== 'aprovado') ? (<FcPrivacy size={35} />) : (
                    <>
                      <TextField size="small" onChange={onChange} type="file" name="vistoria" id="vistoria" inputRef={fileInput} />
                      <button type="submit" className="button-purple">Adicionar</button>
                    </>
                  )
                ) : (
                  <>
                    {productData?.analise && productData?.analise?.vistoria?.status === 'pendente' &&
                      <Box sx={{ display: 'flex', gap: '5px' }}>
                        <Button color="success" href={productData?.analise?.vistoria?.path}><AiOutlineDownload size={25} /></Button>
                        <Button onClick={() => handleDelete('vistoria')} color="error"><AiOutlineDelete size={25} /></Button>
                      </Box>
                    }
                    {productData?.analise && (
                      <>
                        {productData?.analise?.vistoria?.status === 'pendente' &&
                          <Box sx={{ display: 'flex', gap: '5px' }}>
                            <Button onClick={() => { handleOpenRepprove(); setType('vistoria'); }} color='error'>Reprovar</Button>
                            <Button onClick={() => { handleOpenApprove(); setType('vistoria'); }} color='success'>Aprovar</Button>
                          </Box>
                        }
                        {productData?.analise?.vistoria?.status === 'reprovado' &&
                          <Alert severity="error">Relatório reprovado pela direção</Alert>
                        }
                        {productData?.analise?.vistoria?.status === 'aprovado' &&
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
              <Box sx={{
                display: 'flex', flexDirection: 'column', gap: '5px', alignItems:

                  'center'
              }}>
                <h3 >Análise Laboratorial</h3>
                <h4 style={{ textAlign: 'center' }} className="regular black" >Parecer do laboratório credenciado</h4>
                {productData?.analise && !productData?.analise?.analise_laboratorial?.path ?
                  (productData?.analise?.analise_pedido?.status !== 'aprovado' || productData?.analise?.vistoria?.status !== 'aprovado') ? (<FcPrivacy size={35} />) : (
                    <>
                      <TextField size="small" onChange={onChange} type="file" name="analise_laboratorial" inputRef={fileInput} />
                      <button type="submit" className="button-purple">Adicionar</button>
                    </>
                  ) : (
                    <>
                      {productData?.analise && productData?.analise?.analise_laboratorial?.status === 'pendente' &&
                        <Box sx={{ display: 'flex', gap: '5px' }}>
                          <Button color="success" href={productData?.analise?.analise_laboratorial?.path}><AiOutlineDownload size={25} /></Button>
                          <Button onClick={() => handleDelete('analise_laboratorial')} color="error"><AiOutlineDelete size={25} /></Button>
                        </Box>
                      }

                      {productData?.analise && (
                        <>
                          {productData?.analise?.analise_laboratorial?.status === 'pendente' &&
                            <Box sx={{ display: 'flex', gap: '5px' }}>
                              <Button onClick={() => { handleOpenRepprove(); setType('analise_laboratorial'); }} color='error'>Reprovar</Button>
                              <Button onClick={() => { handleOpenApprove(); setType('analise_laboratorial'); }} color='success'>Aprovar</Button>
                            </Box>
                          }

                          {productData?.analise?.analise_laboratorial?.status === 'reprovado' &&
                            <Alert severity="error">Relatório reprovado pela direção</Alert>
                          }

                          {productData?.analise?.analise_laboratorial?.status === 'aprovado' &&
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

        <Dialog
          open={openApprove}
          onClose={handleOpenApprove}
        >
          <DialogContent>
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
                <button className='button-white' onClick={handleOpenApprove}>Cancelar</button>

                <button
                  disabled={isLoading}
                  className='button-purple'
                  onClick={approveRelatory}
                >
                  {isLoading ? <CircularProgress color="success" size={24} /> : 'Aprovar'}
                </button>

              </Box>
            </Box>
          </DialogContent>
        </Dialog>


        <Dialog
          open={openRepprove}
          onClose={handleOpenRepprove}
        >
          <DialogContent>
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
                <button  className='button-white' o onClick={handleOpenRepprove}>Cancelar</button>

                <button
                  disabled={isLoading}
                  className='button-purple'
                  onClick={repproveRelatory}
                >
                  {isLoading ? <CircularProgress color="success" size={24} /> : 'Reprovar'}
                </button>

              </Box>
            </Box>
          </DialogContent>
        </Dialog>

      </Container>
    </Box>

  )
}

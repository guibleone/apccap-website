import { Box, Button, Container, Typography, CircularProgress, TextField, useMediaQuery, Divider, Alert, Select, MenuItem, InputLabel, FormControl, Grid, Card, CardMedia, CardContent, CardActions, Modal } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, deleteProduct, addProduct, getSelos, clear, addSelo, addSelosPayed, reset } from '../../features/products/productsSlice'
import Selo from '../../components/Stripe/Selo'
import ProductsPagination from '../../components/Pagination/Products'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AiFillRedEnvelope, AiFillWarning, AiOutlineDropbox, AiOutlineEdit } from 'react-icons/ai'
import { BiFile, BiTrashAlt } from 'react-icons/bi'
import { styleError, styleSuccess } from '../toastStyles'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { associateProducer } from '../../features/auth/authSlice'
import ButtonChangeRole from '../../components/ChangeRole/ButtonChangeRole'
import { colors } from '../colors'
import { BsArrowUpRight } from 'react-icons/bs'

function RegisterProduct() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoading: isLoadingAuth } = useSelector(state => state.auth)

  const { isLoading, isError, message, isSuccess, isSuccessSelos, selos } = useSelector(state => state.products)
  const { payments } = useSelector(state => state.payments)

  const [openViewDocuments, setOpenViewDocuments] = useState(false)
  const handleOpenViewDocuments = () => setOpenViewDocuments(!openViewDocuments)

  const matches = useMediaQuery('(max-width:600px)')

  const [inputData, setFormData] = useState({
    name: '',
    quantity: '',
    description: '',
  })

  const { name, quantity, description } = inputData

  const [productsData, setProductsData] = useState([])

  const style = !matches ? {
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

  useEffect(() => {
    if (user.role === 'produtor' || user.role === 'produtor_associado') {

      dispatch(reset())
      dispatch(getProducts())
    }

  }, [user])


  useEffect(() => {

    if (user.role === 'produtor') {

      const userData = {
        id: user._id,
        token: user.token
      }

      dispatch(getSelos(userData))
    }

  }, [dispatch, user._id, user.token, user])

  useEffect(() => {

    if (isSuccess && message !== 'Selo inválido') {
      toast.success(message, styleSuccess)
    }

    if (isError && message !== 'Selo inválido') {
      toast.error(message, styleError)
    }

    dispatch(clear())

  }, [isSuccess, isError, message])


  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const [files, setFiles] = useState([])

  // on drop arquivos
  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {

    if (rejectedFiles.length > 0) {
      // Handle files with invalid extensions here
      console.error('Arquivos inválidos', rejectedFiles);
      return;
    }

    setFiles(acceptedFiles)
  }, []);

  // configurações do dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf',
    multiple: true,
  });

  // remover arquivos
  const removeFile = (file) => {
    const updatedFiles = files.filter((selectedFile) => selectedFile !== file);
    setFiles(updatedFiles);
  };

  const handlePayment = async ({ id, quantity }) => {
    try {
      console.log('id: ', id)

      localStorage.setItem('id', JSON.stringify(id))

      const response = await axios.post('/api/payment/comprar-selos', {
        quantity,
        userId: user._id,
      })


      if (response.data) {
        window.location.href = response.data.url;

      }

    } catch (error) {
      console.log('Erro no pagamento: ', error)
      localStorage.removeItem('id')
    }
  }

  const [messagePayment, setMessagePayment] = useState('')

  useEffect(() => {

    const query = new URLSearchParams(window.location.search);
    const id = JSON.parse(localStorage.getItem('id'))

    if (query.get("success") && id && user.token) {

      const productData = {
        productId: id,
        userId: user._id,
        token: user.token,
      }

      dispatch(addSelosPayed(productData))
      setMessagePayment("Pedido realizado com sucesso!");

      localStorage.removeItem('id')

      query.delete("success");

    }

    if (query.get("canceled")) {

      setMessagePayment("Pedido cancelado - compre novamente quando estiver pronto.")

      localStorage.removeItem('id')

      query.delete("canceled");
    }


  }, [selos, messagePayment]);


  const [isLoaded, setIsLoaded] = useState(false)

  const handleSubmit = () => {


    if (!name || !description || !quantity || !files) {
      toast.error('Preencha todos os campos', styleError)
      return
    }

    if (files.length < 4) {
      toast.error('Insira todos documentos', styleError)
      return
    }

    if (files.length > 4) {
      toast.error('Insira apenas 4 documentos', styleError)
      return
    }

    setIsLoaded(true)

    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('quantity', quantity);
    formData.append('token', user.token);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    axios.post('/api/products', formData, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((response) => {
        toast.success(response.data.message, styleSuccess)
        dispatch(getProducts())
        setFormData({
          name: '',
          quantity: '',
          description: '',
        })
        setFiles([])
        setIsLoaded(false)
      })
      .catch((error) => {
        console.log(error)
        toast.error(error.response.data.error, styleError)
      });
  };


  if (isLoaded) {
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

  if (user.role === 'user') {
    return <Box sx={
      {
        display: 'flex',
        backgroundColor: colors.main_white,
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '36px',
        padding: '72px 0'

      }
    }>     <Box sx={{
      maxWidth: '500px',
      textAlign: 'center',
      gap: '16px'
    }}>
        <h3 className='semi-bold black'>
          Você não tem acesso a essa página
        </h3>
        <h1 className='black bold'>
          Produtor Não Associado
        </h1>

        <h4 className='regular black'>
          Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus.
        </h4>
      </Box>

      <button className='button-purple' onClick={() => navigate('/credencial')} >
        Me Associar <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom' }} />
      </button>

    </Box>
  }


  return (
    <Box sx={
      {
        backgroundColor: colors.main_white,
        minHeight: '100vh',
      }}>
      <Container maxWidth='xl'>

        <Typography sx={{ textAlign: 'center' }} variant={matches ? 'h5' : 'h5'}>Cadastrar Produto</Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={3.7}>
            <FormControl fullWidth >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField placeholder="Informe o nome do produto" size='small' name='name' onChange={onChange} value={name} />
                <TextField placeholder="Informe a descrição do produto" size='small' name='description' onChange={onChange} value={description} />
                <TextField placeholder="Informe a quantidade de selos" size='small' name='quantity' onChange={onChange} />
              </Box>
            </FormControl>

          </Grid>

          <Divider orientation="vertical" flexItem sx={{ margin: '0 20px' }} />

          <Grid item xs={12} md={6} lg={3.7}>

            <Box sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
              p: 1,
              border: isDragActive ? '1px solid #E4E3E3' : '',
              borderRadius: '5px',
              boxShadow: isDragActive ? '0px 0px 5px 0px rgba(0,0,0,0.75)' : '',
            }} {...getRootProps()}>
              <input multiple {...getInputProps()} />
              <Button variant='outlined' color='success'><AiOutlineDropbox size={80} /> </Button>
              <Typography textAlign={'center'} variant='p'>Arraste e solte os arquivos ou clique para selecionar</Typography>
            </Box>

            <Button fullWidth variant='outlined' onClick={handleOpenViewDocuments} >ver documentos</Button>
          </Grid>

          <Divider orientation="vertical" flexItem sx={{ margin: '0 20px' }} />

          <Grid item xs={12} md={6} lg={3.7}>

            {files.length > 0 ? (
              <div>
                <h4>Arquivos selecionados</h4>
                <ul>
                  {files.map((file) => (
                    <li key={file.path}>
                      {file.path}
                      <Button variant='outlined' color='error' onClick={() => removeFile(file)}><BiTrashAlt /></Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) :
              <Typography variant='p'>Nenhum arquivo selecionado</Typography>
            }
          </Grid>

          <Button sx={{ m: 2 }} fullWidth color='success' variant='outlined' onClick={handleSubmit}>Cadastrar</Button>

        </Grid>

        <Divider sx={{ margin: '20px 0' }} />


        {productsData.length === 0 ?

          (<Typography variant="h5" gutterBottom>Nenhum produto cadastrado</Typography>)

          : (
            <Box sx={
              {
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginTop: '20px',
              }
            }>
              <Typography sx={{ textAlign: 'center' }} variant={'h5'} component="h1" >Seus Produtos</Typography>


              <Grid
                sx={{ margin: '10px 0', display: 'flex', flexDirection: matches ? 'column' : 'row', gap: matches ? '20px' : '0' }}
                container={!matches}
                rowSpacing={{ xs: 8, sm: 6, md: 3 }}
                columnSpacing={{ xs: 8, sm: 6, md: 3 }}
              >

                {productsData.map((product) => (

                  <Grid item key={product._id} md={3}>

                    <Card
                      sx={{
                        border: matches ? '1px solid #E4E3E3' : 'none',
                        borderRadius: '5px',
                      }}>

                      <CardMedia
                        sx={{ height: matches ? 252 : 252 }}
                        image={product.path ? product.path : 'https://as1.ftcdn.net/jpg/02/68/55/60/220_F_268556012_c1WBaKFN5rjRxR2eyV33znK4qnYeKZjm.jpg'}
                      />

                      <CardContent>
                        <Box nowrap>
                          <Typography sx={{ textAlign: 'center' }} variant="h6" nowrap >{product.name}</Typography>
                        </Box>
                      </CardContent>

                      {product.status === 'aprovado' ?
                        <>
                          <CardActions sx={{ display: 'flex', justifyContent: 'space-around' }}>

                            <Button fullWidth variant='outlined' onClick={() => navigate(`/acompanhar-analise/${product._id}`)} color="warning">
                              <BiFile size={20} />
                            </Button>

                            <Button sx={{ marginLeft: '7px' }} fullWidth variant='outlined' color='info' href={`/produto/${product._id}`}>
                              <AiOutlineEdit size={20} />
                            </Button>

                            <Button fullWidth variant='outlined' color='error' onClick={() => dispatch(deleteProduct({ id: product._id }))} >
                              <BiTrashAlt size={20} />
                            </Button>
                          </CardActions>
                        </> :
                        <>
                          {product.status === '' &&
                            <CardActions sx={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                              <Button variant='outlined' onClick={() => navigate(`/acompanhar-analise/${product._id}`)} color="warning">Acompanhar análise</Button>
                            </CardActions>
                          }
                          {product.status === 'pendente' && <>
                            <CardActions sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                              <Button variant='outlined' color='success' onClick={() => handlePayment({ id: product._id, quantity: product.selo.quantity })}>
                                Pagar Selos
                              </Button>
                            </CardActions>
                          </>
                          }
                          {product.status === 'reprovado' && <>
                            <CardActions sx={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                              <Button variant='outlined' color='error' onClick={() => dispatch(deleteProduct({ id: product._id }))} >
                                <BiTrashAlt size={20} />
                              </Button>
                              <Button variant='outlined' onClick={() => navigate(`/acompanhar-analise/${product._id}`)} color="warning">
                                <BiFile size={20} />
                              </Button>
                            </CardActions>

                          </>
                          }
                        </>
                      }

                    </Card>

                    {product.status === 'reprovado' &&
                      <Alert sx={{ margin: '10px 0' }} severity="error">Seu produto foi reprovado.</Alert>
                    }


                  </Grid>
                ))}


              </Grid>

            </Box>
          )}

        <ProductsPagination setProductsData={(p) => setProductsData(p)} />

        <Divider sx={{ margin: '20px 0' }} />


        <Modal
          open={openViewDocuments}
          onClose={handleOpenViewDocuments}
        >
          <Box sx={style}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="h6" >Documentos Necessários</Typography>
                <AiFillRedEnvelope size={30} />
              </Box>

              <Typography variant="h7" > Para a aprovação do produto são requiridos os segunites documentos.</Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Typography variant="h7" > - Cartão de CNPJ e CPF</Typography>
                <Typography variant="h7" > - Inscrição nos órgãopúblicos de regulação</Typography>
                <Typography variant="h7" > - Anotação de responsabilidade técnica (ART)</Typography>
                <Typography variant="h7" > - Informações sobre a propriedade</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Button color='info' variant='contained' onClick={handleOpenViewDocuments}>Voltar</Button>
              </Box>
            </Box>
          </Box>
        </Modal>

      </Container>
    </Box>
  )
}

export default RegisterProduct
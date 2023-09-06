import { Box, Button, Container, Typography, CircularProgress, TextField, useMediaQuery, Divider, Alert, Select, MenuItem, InputLabel, FormControl, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, deleteProduct, addProduct, getSelos, clear, addSelo, addSelosPayed } from '../../features/products/productsSlice'
import Selo from '../../components/Stripe/Selo'
import ProductsPagination from '../../components/Pagination/Products'
import { toast } from 'react-toastify'
import { AiOutlineEdit } from 'react-icons/ai'
import { BiTrashAlt } from 'react-icons/bi'
import { styleError, styleSuccess } from '../toastStyles'
import axios from 'axios'

function RegisterProduct() {
  const dispatch = useDispatch()

  const { user } = useSelector(state => state.auth)

  const { isLoading, isError, message, isSuccess, isSuccessSelos, selos } = useSelector(state => state.products)
  const { payments } = useSelector(state => state.payments)

  const matches = useMediaQuery('(max-width:600px)')

  const [inputData, setFormData] = useState({
    name: '',
    quantity: '',
    description: '',
  })

  const { name, quantity, description } = inputData

  const [productsData, setProductsData] = useState([])

  useEffect(() => {
    dispatch(getProducts())
  }, [])


  useEffect(() => {

    const userData = {
      id: user._id,
      token: user.token
    }

    dispatch(getSelos(userData))

  }, [dispatch, user._id, user.token])

  useEffect(() => {

    if (isSuccess) {
      toast.success(message, styleSuccess)
    }

    if (isError) {
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

  const onSubmit = (e) => {
    e.preventDefault()


    const userData = {
      id: user._id,
      token: user.token
    }

    const productData = {
      name,
      description,
      quantity
    }

    dispatch(addProduct({ productData, userData }))

  }

  const handlePayment = async (e) => {

    if (!selos.newQuantity) {
      console.log('Informe uma quantidade válida')
    }

    try {
      const response = await axios.post('/api/payment/comprar-selos', {
        quantity: selos.quantity,
        userId: user._id,
      })
      if (response.data) {
        window.location.href = response.data.url;
      }

    } catch (error) {
      console.log('Erro no pagamento: ', error)
    }
  }

  const [messagePayment, setMessagePayment] = useState('')

  useEffect(() => {

    const query = new URLSearchParams(window.location.search);

    if (query.get("success") && (selos && selos.quantity >= 0 && selos.status === 'pendente')) {

      const userData = {
        id: user._id,
        token: user.token,
        quantity: selos.quantity,   
      }

      dispatch(addSelosPayed(userData))
      setMessagePayment("Pedido realizado com sucesso!");

      query.delete("success");

    }

    if (query.get("canceled")) {
      
      setMessagePayment("Pedido cancelado - compre novamente quando estiver pronto.")

      query.delete("canceled");
    }


  }, [selos, messagePayment]);



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
    <Container sx={
      {
        minHeight: '100vh',
      }
    }>

      <Box sx={{ marginBottom: '50px' }}>

        <form onSubmit={onSubmit}>

          <Box sx={
            {
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              margin: '20px 0'
            }
          }>

            <Typography sx={{ textAlign: 'center' }} variant={matches ? 'h5' : 'h4'} component="h1" gutterBottom>Cadastrar Produto</Typography>

            <TextField placeholder="Informe o nome do produto" size='small' name='name' onChange={onChange} value={name} />
            <TextField placeholder="Informe a descrição do produto" size='small' name='description' onChange={onChange} value={description} />

            <TextField disabled={selos.newQuantity === 0} placeholder="Informe a quantidade de selos" size='small' name='quantity' onChange={onChange} />

            {selos.newQuantity >= 0 && <Typography variant='p'>Você possui <span style={{ color: 'green' }}> {selos.newQuantity}</span> selos disponíveis.</Typography>}

            {(selos.status === 'analise') && <Typography variant='p'><span style={{ color: 'red' }}> {selos.quantity}</span> selos estão em análise. Por favor aguarde.</Typography>}
            {(selos.status === 'pendente') && <Typography variant='p'><span style={{ color: 'red' }}> {selos.quantity}</span> selos estão pendentes. Por favor faça o pagamento.
              <Button variant='outlined' onClick={() => handlePayment()}>Pagar</Button>
            </Typography>}
         
            {messagePayment && messagePayment ===  "Pedido realizado com sucesso!" && <Alert color='success'>{messagePayment}</Alert>}
            {messagePayment && messagePayment !==  "Pedido realizado com sucesso!" && <Alert color='error'>{messagePayment}</Alert>}

            {(selos.status === 'reprovado') && <Typography variant='p' color={'error'}>Seus {selos.quantity} selos foram reprovados. Por favor peça-os novamente.</Typography>}


            <Button variant='contained' type='submit'>Cadastrar</Button>

          </Box>

        </form>

        <Divider sx={{ margin: '20px 0' }} />



        {productsData.length === 0 ?

          (<Typography variant="h4" component="h1" gutterBottom>Nenhum produto cadastrado</Typography>)

          : (
            <Box sx={
              {
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginTop: '20px',
              }
            }>
              <Typography sx={{ textAlign: 'center' }} variant={matches ? 'h5' : 'h4'} component="h1" >Seus Produtos</Typography>


              <Grid
                sx={{ margin: '10px 0', display: 'flex', flexDirection: matches ? 'column' : 'row', gap: matches ? '20px' : '0' }}
                container={!matches}
                rowSpacing={{ xs: 8, sm: 6, md: 3 }}
                columnSpacing={{ xs: 8, sm: 6, md: 3 }}
              >

                {productsData.map((product) => (

                  <Grid alignSelf={'center'} item key={product._id} md={3}>

                    <Card
                      sx={{
                        maxWidth: matches ? 352 : 252,
                        minWidth: 262,
                        border: matches ? '1px solid #E4E3E3' : 'none',
                        borderRadius: '5px',
                      }}>

                      <CardMedia
                        sx={{ height: matches ? 252 : 252 }}
                        image={product.path ? product.path : 'https://as1.ftcdn.net/jpg/02/68/55/60/220_F_268556012_c1WBaKFN5rjRxR2eyV33znK4qnYeKZjm.jpg'}
                      />

                      <CardContent>
                        <Typography sx={{ textAlign: 'center' }} variant="h6" component="h1">{product.name}</Typography>
                      </CardContent>

                      <CardActions sx={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                        <Button variant='outlined' color='info' href={`/produto/${product._id}`}>
                          <AiOutlineEdit size={20} />
                        </Button>

                        <Button variant='outlined' color='error' onClick={() => dispatch(deleteProduct({ id: product._id }))} >
                          <BiTrashAlt size={20} />
                        </Button>
                      </CardActions>

                    </Card>

                  </Grid>
                ))}


              </Grid>

            </Box>
          )}

        <ProductsPagination setProductsData={(p) => setProductsData(p)} />

        <Divider sx={{ margin: '20px 0' }} />

        <Selo />

        {(isError && !isSuccessSelos) && <Alert sx={{ margin: '10px 0' }} severity="error">{message}</Alert>}

      </Box>

    </Container>
  )
}

export default RegisterProduct
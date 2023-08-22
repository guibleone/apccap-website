import { Box, Button, Container, Typography, CircularProgress, TextField, useMediaQuery, Divider, Alert, Select, MenuItem, InputLabel, FormControl, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, deleteProduct, addProduct, getSelos, clear } from '../../features/products/productsSlice'
import Selo from '../../components/Stripe/Selo'
import ProductsPagination from '../../components/Pagination/Products'
import { toast } from 'react-toastify'
import { AiOutlineEdit } from 'react-icons/ai'
import { BiTrashAlt } from 'react-icons/bi'

function RegisterProduct() {
  const styleError = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }

  const styleSuccess = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }

  const dispatch = useDispatch()

  const { user } = useSelector(state => state.auth)

  const { isLoading, isError, message, isSuccess, isSuccessSelos, selos } = useSelector(state => state.products)

  const matches = useMediaQuery('(max-width:600px)')

  const [inputData, setFormData] = useState({
    name: '',
    selo: ''
  })

  const { name, selo } = inputData

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

    const productData = {
      name,
      selo
    }

    dispatch(addProduct(productData))

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

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };


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

            {selos === 0 ? <Typography variant='h6'>Você não possui selos</Typography>:
            (<>
            <Typography variant='h6'>Você possui {selos} selos.</Typography>
            </>
            )
            }
            

          
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
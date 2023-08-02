import { Box, Button, Container, Typography, CircularProgress, TextField, useMediaQuery, Divider, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, deleteProduct, addProduct, getSelos, clear } from '../../features/products/productsSlice'
import Selo from '../../components/Stripe/Selo'
import ProductsPagination from '../../components/Pagination/Products'

function RegisterProduct() {

  const dispatch = useDispatch()

  const { user } = useSelector(state => state.auth)

  const { isLoading, isError, message, selos, isSuccess, isSuccessSelos } = useSelector(state => state.products)

  const matches = useMediaQuery('(max-width:800px)')

  const [inputData, setFormData] = useState({
    name: '',
    selo: ''
  })

  const { name, selo } = inputData

  const [productsData, setProductsData] = useState([])

  useEffect(() => {
    dispatch(getProducts())
  }, [ ])


  useEffect(() => {

    const userData = {
      id: user._id,
      token: user.token
    }

    dispatch(getSelos(userData))

  }, [dispatch, user._id, user.token])



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
        height: '100vh',
      }
    }>
      <Box>

        <Typography variant="h4" component="h1" gutterBottom>Cadastrar Produto</Typography>

        <form onSubmit={onSubmit}>
          <Box sx={
            {
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }
          }>
            <TextField placeholder="Informe o nome do produto" size='small' name='name' onChange={onChange} value={name} />

            {selos.length === 0 ? <Typography variant='h6'>Você não possui selos</Typography> : (
              <div>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id='selos-comprados-label'>Selos</InputLabel>
                  <Select
                    labelId='selos-comprados-label'
                    id='selos-comprados'
                    type='number'
                    size='small'
                    name='selo'
                    onChange={onChange}
                    value={selo}
                    MenuProps={MenuProps}
                  >
                    {selos.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                  </Select>
                </FormControl>
              </div>
            )}

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
              <Typography variant="h4" component="h1" >Seus Produtos</Typography>

              {productsData.map((product) => (
                <Box sx={
                  {
                    display: 'flex',
                    flexDirection: matches ? 'column' : 'row',
                    gap: '10px'
                  }
                } key={product._id}>
                  <Typography sx={{ textAlign: 'center' }} variant="h5" component="h1">{product.name}</Typography>
                  <Button variant='outlined' color='success' href={`/produto/${product._id}`}>Editar</Button>
                  <Button variant='outlined' color='error' onClick={() => dispatch(deleteProduct({id:product._id}))} >Excluir</Button>
                </Box>
              ))}

             

            </Box>
          )}     

        <ProductsPagination setProductsData={(p) => setProductsData(p) } />
    
        <Divider sx={{ margin: '20px 0' }} />
     
        <Selo />

        {(isError && !isSuccessSelos) && <Alert sx={{ margin: '10px 0' }} severity="error">{message}</Alert>}

      </Box>

    </Container>
  )
}

export default RegisterProduct
import { Box, Button, Container, Typography, CircularProgress, TextField, useMediaQuery, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, deleteProduct, addProduct } from '../../features/products/productsSlice'


function RegisterProduct() {

  const dispatch = useDispatch()

  const { isLoading, isError, message } = useSelector(state => state.products)

  const products = useSelector(state => state.products)

  const productsData = products ? products.productsData : ''

  const matches = useMediaQuery('(max-width:800px)')

  const [inputData, setFormData] = useState({
    name: '',
    selo: ''
  })

  const { name, selo } = inputData

  useEffect(() => {
    dispatch(getProducts())

  }, [])


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
            <Typography variant='h5'>Nome</Typography>
            <TextField size='small' name='name' onChange={onChange} value={name} />

            <Typography variant='h5'>Selo</Typography>
            <TextField type='number' size='small' name='selo' onChange={onChange} value={selo} />

            <Button variant='contained' type='submit'>Cadastrar</Button>

          </Box>

        </form>

        {isError && <h1>{message}</h1>}

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
              <Typography sx={ matches && {textAlign:'center'}} variant="h4" component="h1" >Seus Produtos</Typography>

              {productsData.map((product) => (
                <Box sx={
                  {
                    display: 'flex',
                    flexDirection: matches ? 'column' : 'row',
                    gap: '10px'
                  }
                } key={product._id}>
                  <Typography sx={{textAlign:'center'}} variant="h5" component="h1">{product.name}</Typography>
                  <Button variant='outlined' color='success' href={`/produto/${product._id}`}>Editar</Button>
                  <Button variant='outlined' color='error' onClick={() => dispatch(deleteProduct(product._id))} >Excluir</Button>

                </Box>
              ))}

            </Box>
          )}

      </Box>

    </Container>
  )
}

export default RegisterProduct
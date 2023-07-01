import { Box, Container, Typography, CircularProgress, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { FcOk, FcHighPriority } from "react-icons/fc";

function Traceability() {

  const { productData, isLoading, isError, message } = useSelector((state) => state.products)
  const error  = localStorage.getItem('error')
  const product = localStorage.getItem('product')

  const navigate = useNavigate()

  if (isLoading) {
    return <Box sx={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }
    }>
      <CircularProgress sx={
        {
          margin: '100px',
        }
      } size={100} />
    </Box>
  }

  if(!error && !product){
    return <Box sx={
      {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
        height: '100vh'
      }
    }>
      <Typography variant='h4'> Rastreio Indisponível <FcHighPriority /> </Typography>
    </Box>
  }

  return (
    <Container sx={
      {
        height: '100vh',
      }
    }>

      {isError || error ? (
        <Box sx={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'center',
          }
        }>
          <Typography variant='h4'> {message} <FcHighPriority /> </Typography>
          <Button variant='contained' color='error' href='/'> Tentar novamente </Button>
        </Box>
      )

       : (
          <Box sx={
            {
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'center',
              textAlign: 'center',
              
            }
          }>

            <Typography variant='h4'> Produto Oficial <FcOk /></Typography>

            <img width={300} src={productData.path ? productData.path : 'https://placehold.co/300x300'} alt="Foto do produto" />

            <Typography variant='h5'> {productData.name} </Typography>
            <Typography variant='h5'> {productData.description} </Typography>

            <Button variant='contained' color='success' href='/'> Voltar </Button>

          </Box>

        )
      }


    </Container>

  )
}

export default Traceability
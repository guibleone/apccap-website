import { Box, Container, Typography, CircularProgress, Button, Link, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { FcOk, FcHighPriority } from "react-icons/fc";
import { useEffect } from 'react';
import { useState } from 'react';
import { reset, trackProduct } from '../../features/products/productsSlice';


function Traceability() {

  const { productData, isLoading, isError, message } = useSelector((state) => state.products)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [selo, setSelo] = useState('')

  const onTrack = (e) => {
    e.preventDefault()

    dispatch(trackProduct({ selo }))
  }



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

  if ((productData && Object.keys(productData).length <= 0) && !isError) {
    return (<Container sx={
      {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minHeight: '100vh',
      }
    }>

      <Typography variant="h4" component="h1" gutterBottom>Rastreie produtos oficiais</Typography>
      <TextField type="number" name='selo' placeholder="Digite o selo do produto" value={selo} onChange={(e) => setSelo(e.target.value)} />
      <Button disabled={isLoading} onClick={onTrack} variant="contained" color="success">
        {isLoading ? <CircularProgress size={25} color="success" /> : 'Rastrear'}
      </Button>

    </Container>

    )
  }

  return (
    <Container sx={
      {
        minHeight: '100vh',
        marginTop: '10px',
      }
    }>

      {(isError) ? (
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
          <Button variant='contained' color='error' onClick={() => dispatch(reset()) && navigate('/rastreabilidade')}> Tentar novamente </Button>
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

            <Typography variant='h4'> Produto Oficial <FcOk size={45} style={{verticalAlign:'bottom'}} /></Typography>

            <img width={300} src={productData.path ? productData.path : 'https://placehold.co/300x300'} alt="Foto do produto" />

            <Typography variant='h5'> {productData.name} </Typography>
            <Typography variant='h5'> {productData.description} </Typography>

            <Button variant='contained' onClick={() => navigate(`/produtor/${productData.producer}`)} sx={{ textDecoration: 'none', width: '300px' }} >Produtor</Button>
            <Button sx={{ width: '300px' }} variant='contained' color='success' onClick={() => dispatch(reset()) && navigate('/rastreabilidade')}> Voltar </Button>


          </Box>

        )
      }


    </Container>

  )
}

export default Traceability
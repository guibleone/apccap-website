import { Avatar, Box, CircularProgress, Container, CssBaseline, Grid, useMediaQuery } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import { useState } from 'react';
import { getProducer, getProducerResume, reset, trackProduct } from '../../features/products/productsSlice';
import './Styles.css'
import { AiFillInfoCircle } from 'react-icons/ai';
import Footer from '../../components/Footer/Footer';
import { colors, } from '../colors.js'


function Traceability() {

  const { productData, producer, producerResume, isLoading, isError, message } = useSelector((state) => state.products)
  const dispatch = useDispatch()

  const matches = useMediaQuery('(max-width:1200px)')

  useEffect(() => {
    dispatch(reset())
    window.scrollTo(0, 0)
  }, [])

  const [selo, setSelo] = useState('')

  const onTrack = (e) => {
    e.preventDefault()

    dispatch(trackProduct({ selo }))

  }

  useEffect(() => {

    if (productData && Object.keys(productData).length > 0) {

      const id = productData.producer
      dispatch(getProducer(id))
      dispatch(getProducerResume(id))
    }


  }, [productData])

  useEffect(() => {
    if(productData && Object.keys(productData).length > 0){
     window.scrollTo(0, 0)
    }
  }, [productData])

  if (isLoading) {
    return <Box sx={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#FAF8F8'
      }
    }>
      <CircularProgress sx={
        {
          margin: '100px',
        }
      } size={100} />
    </Box>
  }

  if ((productData && Object.keys(productData).length <= 0)) {
    return (
      <>
        <Box>
          <CssBaseline />
          <div className="box">
            <div className="text-side-produto">
              <h1 style={{ fontWeight: 700 }}>
                Verifique com procedência a cachaça que comprou.
              </h1>
              <h4 style={{ fontWeight: 400 }}>
                Na embalagem do produto, próximo ao selo de notoriedade, identifique a sequência de oito digitos. Insira-os no campo a baixo e clique em rastrear.
              </h4>

              <div className="rastrear-produto">
                <input type='number' value={selo}
                  onChange={(e) => setSelo(e.target.value)}
                  placeholder={"000.000000"}
                  style={{ border: isError && '#D0302F 1px solid' }}
                />
                <button className='button-purple' onClick={onTrack}>Rastrear</button>
              </div>

              <div className='error'>
                {isError &&
                  <div className='menssagem'>

                    <AiFillInfoCircle size={25} />


                    Produto não encontrado.

                    <br />

                    Tente novamente ou reporte sua compra


                  </div>
                }
              </div>

            </div>


            {!matches && (<>
              <img src={require('../../imgs/seloFoto.png')} alt="rastreio" style={{
                marginTop: '-130px',
              }} />
            </>)}




          </div>
        </Box>
        <Footer />

      </>
    )
  }

  return (
    <>
      <Box sx={{
        backgroundColor: colors.main_white
      }}>
        <CssBaseline />
        <Container maxWidth='xl' sx={{
          padding: '50px 20px',
        }}>

          {!isError &&
            <>
              <Grid container spacing={2} sx={{
                alignItems: 'center',
              }}>

                <Grid item xs={12} md={6}>
                  <Box sx={{
                    position: 'relative',
                    padding:matches ? '0px 50px' : '0px 0px',
                    paddingBottom: '50px',
                  }}>

                    <img src={require('../../imgs/Check.png')} alt="check" className="check-mark" />
                    
                    <Avatar sx={{
                      width: matches ? 250 : 600,
                      height: matches ? 250 : 600,
                    }} src={productData.path ? productData.path : 'https://placehold.co/300x300'} alt="Foto do produto" />


                    <img src={producer?.dados_pessoais?.profilePhoto ? producer?.dados_pessoais?.profilePhoto : 'https://placehold.co/300x300'} alt="Foto do produto" className='foto-produtor' />

                  </Box>

                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }} >
                    <div className="nome">
                      <h2>
                        Nome do Produto
                      </h2>
                      <h3>
                        {productData.name}
                      </h3>
                    </div>

                    <div className="sobre">
                      <h2>
                        Descrição do Produto
                      </h2>
                      <h3 style={{
                        textAlign: 'justify'
                      }}>
                        {productData.description}
                      </h3>
                    </div>

                    <div className="sobre-production">
                      <h2>
                        Sobre o Produtor
                      </h2>

                      {producerResume && producerResume[0] ? <h3>{producerResume[0].body}</h3> : <h3>Sem informações.</h3>}

                    </div>
                  </Box>
                </Grid>


                {/*  <Typography variant='h4'> Produto Oficial </Typography>

          <img width={300} src={productData.path ? productData.path : 'https://placehold.co/300x300'} alt="Foto do produto" />

          <Typography variant='h5'> {productData.name} </Typography>
          <Typography variant='h5'> {productData.description} </Typography>

          <Button variant='contained' onClick={() => navigate(`/produtor/${productData.producer}`)} sx={{ textDecoration: 'none', width: '300px' }} >Produtor</Button>
          <Button sx={{ width: '300px' }} variant='contained' color='success' onClick={() => dispatch(reset()) && navigate('/rastreabilidade')}> Voltar </Button>

          */}

              </Grid>

            </>}

        </Container>
      </Box>


      <Footer />

    </>

  )
}

export default Traceability
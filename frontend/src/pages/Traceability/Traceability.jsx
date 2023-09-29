import { Box, Container, Typography, CircularProgress, Button, TextField, Alert, CssBaseline, Avatar } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { FcApproval, FcOk } from "react-icons/fc";
import { useEffect } from 'react';
import { useState } from 'react';
import { getProducer, getProducerResume, reset, trackProduct } from '../../features/products/productsSlice';
import './Styles.css'
import { AiFillCheckCircle, AiFillInfoCircle } from 'react-icons/ai';
import { BsExclamationTriangle } from 'react-icons/bs';
import Footer from '../../components/Footer/Footer';
import { purple } from '../colors.js'


function Traceability() {

  const { productData, producer, producerResume, isLoading, isError, message } = useSelector((state) => state.products)
  const dispatch = useDispatch()

  const navigate = useNavigate()

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
      console.log(productData)

      const id = productData.producer
      dispatch(getProducer(id))
      dispatch(getProducerResume(id))
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


            <div className="rastreio-lado">

              <img src={require('../../imgs/codigo-exemplo.png')} alt="rastreio" className="rastreio-img" />

            </div>



          </div>
        </Box>
        <Footer />

      </>
    )
  }

  return (
    <>
      <Box>
        <CssBaseline />

        {!isError &&
          <div className="box-produto">
            <div>
              <img src={require('../../imgs/Check.png')} alt="check" className="check-mark" />

              <div className="produto-esquerdo">
                <img className="foto-produto" src={productData.path ? productData.path : 'https://placehold.co/300x300'} alt="Foto do produto" />
              </div>

              <img src={require('../../imgs/Ellipse.png')} alt="elipse" className="elipse" />

              <img src={producer.pathFoto ? producer.pathFoto : 'https://placehold.co/300x300'} alt="Foto do produto" className='foto-produtor' />
            </div>
            <div className="produtos-information">
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
                <h3>
                  {productData.description}
                </h3>
              </div>

              <div className="sobre-production">
                <h2>
                  Sobre o Produtor
                </h2>

                {producerResume && producerResume[0] ? <h3>{producerResume[0].body}</h3> : <h3>Sem descrição.</h3>}

              </div>
            </div>

            {/*  <Typography variant='h4'> Produto Oficial </Typography>

          <img width={300} src={productData.path ? productData.path : 'https://placehold.co/300x300'} alt="Foto do produto" />

          <Typography variant='h5'> {productData.name} </Typography>
          <Typography variant='h5'> {productData.description} </Typography>

          <Button variant='contained' onClick={() => navigate(`/produtor/${productData.producer}`)} sx={{ textDecoration: 'none', width: '300px' }} >Produtor</Button>
          <Button sx={{ width: '300px' }} variant='contained' color='success' onClick={() => dispatch(reset()) && navigate('/rastreabilidade')}> Voltar </Button>

          */}

          </div>
        }

      </Box>

      <Footer />

    </>

  )
}

export default Traceability
/* role está definido como user para diferenciar do produtor credenciado */

import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Grid, useMediaQuery } from '@mui/material'
import { colors } from '../../../colors'
import { BsArrowDownShort, BsArrowRightShort, BsArrowUpRight, BsChevronDown, BsChevronRight, BsPlusCircle, BsX } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addSelosPayed, deleteProduct, getProducts, reset } from '../../../../features/products/productsSlice'
import { MdLiquor } from 'react-icons/md'
import axios from 'axios'
import { BiFile, BiTrashAlt } from 'react-icons/bi'

export default function Produtor() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector(state => state.auth)
  const { productsData, selos } = useSelector(state => state.products)

  const matches = useMediaQuery('(min-width:600px)');

  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    if (user.role === 'produtor' || user.role === 'produtor_associado') {

      dispatch(reset())
      dispatch(getProducts())
    }

  }, [user])

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



  return (
    <Box sx={{
      backgroundColor: colors.main_white,
      minHeight: '100vh',
      paddingBottom: '72px'
    }}>

      <Container maxWidth='xl'>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '72px 0',
              gap: '36px'
            }}>

              {user.role === 'produtor' && !user.oldRole ? (<>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  
              <h3 className='semi-bold black'>
                Credencial
              </h3>
                  <h1 className='bold black'>
                    Produtor Não Associado
                  </h1>
                  <h5 className='regular black'>
                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                  </h5>
                </Box>
                <button onClick={() => navigate('/credencial')} className='button-purple' style={{ width: '182px' }}>
                  Me Associar <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom' }} />
                </button>
              </>) : (
                <> <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  
              <h3 className='semi-bold black'>
                Credencial
              </h3>
                  <h1 className='bold black'>
                    Produtor Associado
                  </h1>
                  <h5 className='regular black'>
                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                  </h5>
                </Box>
                  <button onClick={() => navigate('/credencial')} className='button-purple' style={{ width: '182px' }}>
                    Credencial <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom' }} />
                  </button>
                </>
              )}

            </Box>
          </Grid>

          <Grid item xs={12} md={12}>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '72px 0',
              gap: '36px'
            }}>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <h3 className='black semi-bold'>
                  Produtos cadastrados
                </h3>
                <button onClick={() => navigate('/produto-cadastro')} className='button-white-bottom-border'>
                  Novo Produto <BsPlusCircle size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} />
                </button>

              </Box>
            </Box>
          </Grid>



        </Grid>

        <Grid container rowSpacing={3} >
          <Grid item >
            {(productsData.length === 0) && (
              <h3 className='regular black'>
                Você ainda não cadastrou nenhum produto.
              </h3>
            )}
          </Grid>
          {productsData &&
            productsData.filter((product) => product).slice(0, 4).map((product) => (
              <Grid item xs={12} md={3} pr={matches ? 2 : 0} key={product._id}>
                <Box sx={{
                  backgroundColor: colors.main_grey,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <h3 className='semi-bold black'>
                      {product.name}
                    </h3>
                    <MdLiquor size={30} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} />
                  </Box>
                  <Box>

                    {product.status === '' &&
                      <button className='button-grey-bottom-border' onClick={() => navigate(`/acompanhar-analise/${product._id}`)} >acompanhar análise</button>
                    }
                    {product.status === 'pendente' &&
                      <button className='button-grey-bottom-border' onClick={() => handlePayment({ id: product._id, quantity: product.selo.quantity })}>
                        pagar selos
                      </button>

                    }
                    {product.status === 'reprovado' && <>
                      <button className='button-grey-bottom-border' onClick={() => dispatch(deleteProduct({ id: product._id }))} >
                        <BiTrashAlt size={20} />
                      </button>
                      <button className='button-grey-bottom-border' variant='outlined' onClick={() => navigate(`/acompanhar-analise/${product._id}`)} color="warning">
                        <BiFile size={20} />
                      </button>

                    </>
                    }

                    {product.status === 'aprovado' &&
                      <button className='button-grey-bottom-border' onClick={() => navigate(`/produto/${product._id}`)}>
                        editar produto
                      </button>
                    }

                  </Box>
                </Box>
              </Grid>

            ))
          }

          <Grid item xs={12} md={12}>
            {(productsData && productsData.length > 4) && (
              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <Link style={{ color: '#000', margin: '15px 0' }} to='/produtos'> Ver Tudo</Link>
              </Box>
            )}
          </Grid>



        </Grid>

        {user.role === 'produtor_associado' && user.status !== 'aprovado' && (
          <>
            {matches ? (
              <Box sx={{ display: 'flex', gap: '48px', padding: '72px 0', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{
                  display: 'flex',
                  gap: '10px',
                }}>
                  <h5 className='semi-bold black'>
                    Fomulário
                  </h5>
                  <BsArrowRightShort size={20} />

                  <h5 className='semi-bold black'>
                    Documentos
                  </h5>
                  <BsArrowRightShort size={20} />

                  <h5 className='semi-bold black'>
                    Revisão
                  </h5>
                  <BsArrowRightShort size={20} />

                  <h5 className='semi-bold black'>
                    Análise
                  </h5>
                  <BsArrowRightShort size={20} />

                  <h5 className='semi-bold black'>
                    Acesso
                  </h5>

                </Box>

                <button onClick={() => navigate('/credencial')} className='button-purple' style={{ width: 'auto' }}>
                  Continuar processo <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom' }} />
                </button>

              </Box>)

              :
              (
                <Box sx={{ display: 'flex', gap: '48px', padding: ' 0 0 72px 0', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                    <h3 className='semi-bold black'>
                      Fomulário
                    </h3>
                    <BsArrowDownShort size={20} />

                    <h3 className='semi-bold black'>
                      Documentos
                    </h3>
                    <BsArrowDownShort size={20} />

                    <h3 className='semi-bold black'>
                      Revisão
                    </h3>
                    <BsArrowDownShort size={20} />

                    <h3 className='semi-bold black'>
                      Análise
                    </h3>
                    <BsArrowDownShort size={20} />
                    <h3 className='semi-bold black'>
                      Acesso
                    </h3>

                  </Box>

                  <button onClick={() => navigate('/credencial')} className='button-purple' style={{ width: 'auto' }}>
                    Continuar processo <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom' }} />
                  </button>

                </Box>
              )}
          </>
        )}
      </Container>

    </Box>
  )
}
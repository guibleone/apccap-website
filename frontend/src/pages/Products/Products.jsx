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
import { BsArrowUpRight, BsPlusCircle } from 'react-icons/bs'
import { MdLiquor } from 'react-icons/md'

function Products() {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector(state => state.auth)

  const { isLoading, isError, message, isSuccess } = useSelector(state => state.products)

  const matches = useMediaQuery('(max-width:600px)')


  const [productsData, setProductsData] = useState([])


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


  }, [messagePayment]);


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
    }> <Box sx={{
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
        <Grid container columnSpacing={5} rowSpacing={3} >
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

        <Grid container columnSpacing={0} rowSpacing={3} >

          {productsData &&
            productsData.map((product) => (
              <Grid item xs={12} pr={!matches ? 2 : 0} md={3} key={product._id}>
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
                        pagar Selos
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

          <Grid item >
            {productsData.length === 0 && (
              <h3 className='regular black'>
                Você ainda não cadastrou nenhum produto.
              </h3>
            )}
          </Grid>

        </Grid>

        <ProductsPagination setProductsData={(p) => setProductsData(p)} />

      </Container>
    </Box>
  )
}

export default Products
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { listUsers } from "../../features/admin/adminSlice"
import { Typography, Box, Container, CssBaseline, Link, Button, TextField, CircularProgress, useMediaQuery } from '@mui/material';
import RegisterProduct from "../Products/RegisterProduct";
import { trackProduct, clear } from "../../features/products/productsSlice";
import Secretary from "./Acesses/Secretary"
import Tesoureiro from "./Acesses/Tesoureiro/Tesoureiro"
import President from "./Acesses/Presidente/President"
import Admin from "./Acesses/Admin"
import { getSubscription } from "../../features/payments/paymentsSlice"
import { FcLock } from 'react-icons/fc'
import Conselho from "./Acesses/Conselho/Conselho";

function Dashboard() {

  const { user } = useSelector((state) => state.auth)

  const { isLoading } = useSelector((state) => state.admin)
  const { isLoading: productLoading } = useSelector((state) => state.products)
  const { payments } = useSelector((state) => state.payments)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const matches = useMediaQuery('(max-width:800px)')

  const [selo, setSelo] = useState('')

  const onTrack = (e) => {
    e.preventDefault()

    dispatch(trackProduct({ selo }))

    navigate('/rastreabilidade')

  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {

    if (user && (user.role === "admin" || user.role === 'secretario' || user.role === 'presidente' || user.role==='conselho')) {
      dispatch(listUsers(user.token))
    }
    if (user && (user.role === 'produtor')) {
      const userData = {
        email: user.email,
        token: user.token
      }
      dispatch(getSubscription(userData))
    }

  }, [])

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
          marginBottom: '100px',
        }
      } size={100} />
    </Box>
  }

  if (user) {
    if (user.status === 'analise' && user.role !== 'user') {
      return <Box sx={
        {
          display: 'flex',
          justifyContent: 'center',
          height: '100vh'
        }
      }>
        <Typography variant="h5">Seu cadastro está em análise. Por favor aguarde.</Typography>
      </Box>
    }
  }

  if ((payments && user && payments.subscription !== 'active' && user.role === 'produtor') || (user && user.status === 'reprovado')) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding:'20px', gap:'10px' }}>
        <FcLock size={100} />
        <Typography textAlign={'center'} variant="h5">Acesso negado</Typography>
        <Typography textAlign={'center'} variant="p">Verifique a situação da sua credencial</Typography>
        <Button color='success' variant='outlined' onClick={() => navigate('/credencial-produtor')} >Credencial</Button>
      </Box>
    )
  }


  return (
    <Container sx={{ minHeight: '100vh', marginTop: '10px', }}>
      <CssBaseline />

      {(!user || user.role === 'user') ? (

        <Box sx={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }
        }>

          <Typography variant="h4" component="h1" gutterBottom>Rastreie produtos oficiais</Typography>
          <TextField type="number"  name='selo' placeholder="Digite o selo do produto" value={selo} onChange={(e) => setSelo(e.target.value)} />
          <Button disabled={productLoading} onClick={onTrack} variant="contained" color="success">
            {productLoading ? <CircularProgress size={25} color="success" /> : 'Rastrear'}
          </Button>

        </Box>

      ) : (
        <>

          {(user.role === "admin") && (
            <Admin />
          )}

          {(user.role === "produtor") && (
            <RegisterProduct />
          )}

          {(user.role === 'secretario') && (
            <Secretary />
          )}

          {(user.role === 'tesoureiro') && (
            <Tesoureiro />
          )}

          {(user.role === 'presidente') && (
            <President />
          )}

          {(user.role === 'conselho') &&(
            <Conselho />
          )}

        </>
      )}

    </Container>

  )
}

export default Dashboard
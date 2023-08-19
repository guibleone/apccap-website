import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { reset } from "../../features/auth/authSlice"
import { listUsers } from "../../features/admin/adminSlice"
import { Typography, Box, Container, CssBaseline, Link, Button, TextField, CircularProgress, useMediaQuery } from '@mui/material';
import RegisterProduct from "../Products/RegisterProduct";
import { trackProduct, clear } from "../../features/products/productsSlice";
import UsersPagination from "../../components/Pagination/Users"
import Secretary from "./Acesses/Secretary"
import Tesoureiro from "./Acesses/Tesoureiro/Tesoureiro"
import President from "./Acesses/President"
import Admin from "./Acesses/Admin"

function Dashboard() {

  const { user } = useSelector((state) => state.auth)

  const { isLoading } = useSelector((state) => state.admin)

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

    if (user && (user.role === "admin" || user.role === 'secretario' || user.role === 'presidente')) {
      dispatch(listUsers(user.token))
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

  return (
    <Container sx={{minHeight:'100vh'}}> 
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
          <TextField type="number" placeholder="Digite o selo do produto" value={selo} onChange={(e) => setSelo(e.target.value)} />
          <Button onClick={onTrack} variant="contained" color="success">Rastrear</Button>

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
            <Secretary  />
          )}

          {(user.role === 'tesoureiro') && (
            <Tesoureiro />
          )}

          {(user.role === 'presidente') && (
            <President />
          )}

        </>
      )}

    </Container>

  )
}

export default Dashboard
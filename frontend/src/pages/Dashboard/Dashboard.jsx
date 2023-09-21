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
import { CiCircleCheck } from 'react-icons/ci'
import './Style.css'
import { BsExclamationTriangle } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";

function Dashboard() {

  const { user } = useSelector((state) => state.auth)

  const { isLoading } = useSelector((state) => state.admin)
  const { isLoading: productLoading } = useSelector((state) => state.products)
  const { payments, isLoading: isLoadingPayments } = useSelector((state) => state.payments)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const matches = useMediaQuery('(max-width:800px)')

  const [selo, setSelo] = useState('')

  const onTrack = (e) => {

    e.preventDefault()

    dispatch(trackProduct({ selo }))

    navigate('/rastreabilidade')

  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      dispatch(trackProduct({ selo }))

      navigate('/rastreabilidade')
    }
  }



  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {

    if (user && (user.role === "admin" || user.role === 'secretario' || user.role === 'presidente' || user.role === 'conselho')) {
      dispatch(listUsers(user.token))
    }
    if (user) {
      const userData = {
        email: user.email,
        token: user.token
      }
      dispatch(getSubscription(userData))
    }

  }, [])

  if (isLoadingPayments) {

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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px', gap: '10px' }}>
        <FcLock size={100} />
        <Typography textAlign={'center'} variant="h5">Acesso negado</Typography>
        <Typography textAlign={'center'} variant="p">Verifique a situação da sua credencial</Typography>
        <Button color='success' variant='outlined' onClick={() => navigate('/credencial-produtor')} >Credencial</Button>
      </Box>
    )
  }


  return (
    <Box>
      <CssBaseline />

      {(!user || user.role === 'user') ? (
        <>
          <header>
            <div className="container">
              <div className="text-side">
                <h1>
                  Busque pela cachaça que adiquiriu e saiba mais sobre sua procedência.
                </h1>
                <div className="rastrear">
                  <Link onClick={() => navigate('/rastreabilidade')} className="link">
                    <h3>
                      Rastrear
                    </h3>
                    <div>
                      <CiCircleCheck size={30} />
                    </div>

                  </Link>


                </div>
              </div>

              <div className="rastreio">

                <label htmlFor="codigo">Código </label>
                <input type='number' value={selo}
                  onChange={(e) => setSelo(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={"000.000000"} />

                <div className="triangulo">
                  <BsExclamationTriangle size={50} />
                </div>

                <div className="check">
                  <AiFillCheckCircle size={100} />
                </div>


              </div>

            </div>
          </header>

          <section className="festival">
            <div className="texto-festival">
              <h1>
                Festival da Cachaça
              </h1>
              <h3>
                19, 20 e 21 de Setembro
              </h3>

            </div>

            <div className="image-festival">
              <img src={require('../../imgs/logo-branco.png')} alt="logo" className="logo-festival" />
            </div>
          </section>


        </>


      ) : (
        <Container>

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

          {(user.role === 'conselho') && (
            <Conselho />
          )}

        </Container>
      )}

    </Box>

  )
}

export default Dashboard
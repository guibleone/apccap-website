import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box,  Alert,  CircularProgress, Skeleton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getSubscription } from '../../features/payments/paymentsSlice'
import { BsArrowUpRight } from 'react-icons/bs'
import { colors } from '../colors'

export default function Mensalidade() {

  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { payments, isLoading } = useSelector((state) => state.payments)

  const [isLoadingPayment, setIsLoadingPayment] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoadingPayment(true)

    try {

      const response = await axios.post('/api/payment/comprar-mensalidade', {
        email: user.dados_pessoais.email,
        cpf: user.dados_pessoais.cpf,
        tipo: plano.nome,
      })

      if (response.data) {
        window.location.href = response.data.url;
        setIsLoadingPayment(false)
      }

    } catch (error) {
      console.log('Erro no pagamento: ', error)
      setIsLoadingPayment(false)
    }
  }

  const [messagePayment, setMessagePayment] = useState("");

  const [plano, setPlano] = useState({
    nome: 'Mês',
    valor: '59,90',
  })


  useEffect(() => {

    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessagePayment("Pedido realizado com sucesso!");
    }

    if (query.get("canceled")) {
      setMessagePayment("Pedido cancelado - compre novamente quando estiver pronto.")
    }

  }, []);

  useEffect(() => {

    const userData = {
      email: user.dados_pessoais.email,
      cpf: user.dados_pessoais.cpf,
      token: user.token
    }

    dispatch(getSubscription(userData))

  }, [])

  if (isLoading) {
    return <Box sx={
      {
        display: 'flex',
        overflow: 'hidden',
      }
    }>
      <Skeleton variant="rectangular" width={'100%'} height={50} />
    </Box>
  }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

{(payments && !payments.portal) && (
        <>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.main_white,
            padding: '20px',           
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
          }}> 
            <h2>
              Plano
            </h2>
            <h3>
              <span className='main-purple'>{plano.valor}</span>/{plano.nome}
            </h3>
            <Box sx={{
              display: 'flex',
              gap: '10px',
            }}>
              <button 
              className={plano.nome === 'Mês' ? 'button-purple' : 'button-white'}
              onClick={() => setPlano({ nome: 'Mês', valor: '59,90' })} variant='outlined' color='success'>
                Mensal
              </button>
              <button 
              className={plano.nome === 'Semestre' ? 'button-purple' : 'button-white'}
              onClick={() => setPlano({ nome: 'Semestre', valor: '349,90' })} variant='outlined' color='success'>
                Semestral
              </button>
              <button 
              className={plano.nome === 'Ano' ? 'button-purple' : 'button-white'}
              onClick={() => setPlano({ nome: 'Ano', valor: '599,90' })} variant='outlined' color='success'>
                Anual
              </button>
            </Box>
          </Box>
          <button onClick={handleSubmit} style={{ backgroundColor: isLoadingPayment && colors.main_white }} className='button-purple' disabled={isLoadingPayment || (payments && payments.subscription)} variant='outlined' color='success' type="submit">
            {isLoadingPayment ? <CircularProgress color="success" size={24} /> : <>
              Assinar <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom' }} />
            </>}
          </button>
        </>

      )}

      {(payments && payments.portal) && (
        <button className='button-purple' onClick={() => window.location.href = payments && payments.portal} target='_blank' variant='contained' color='success'>
          Portal do Produtor
        </button>
      )}

      {(messagePayment === "Pedido cancelado - compre novamente quando estiver pronto.") && <Alert severity="error">{messagePayment}</Alert>}
      {(messagePayment === "Pedido realizado com sucesso!") && <Alert severity="success">{messagePayment}</Alert>}

    </Box>

  

  )
}

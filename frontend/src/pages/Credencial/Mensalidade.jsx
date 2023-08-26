import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Button, TextField, Typography, Alert, useMediaQuery, CircularProgress, Skeleton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getSubscription } from '../../features/payments/paymentsSlice'
import { styleSuccess, styleError } from '../toastStyles'

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
        email: user.email,
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
      email: user.email,
      token: user.token
    }

    dispatch(getSubscription(userData))

  }, [])

  if (isLoading) {
    return <Box sx={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        overflow: 'hidden',
      }
    }>
      <CircularProgress size={100} />
    </Box>
  }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      
      {(payments && !payments.portal) && (
        <form onSubmit={handleSubmit}>
          <Button disabled={isLoadingPayment || (payments && payments.subscription)} variant='outlined' color='success' type="submit">
            {isLoadingPayment ? <CircularProgress color="success" size={24} /> : 'Assinar'}
          </Button>
        </form>
      )}

      {(payments && payments.portal) && (
        <Button onClick={() => window.location.href = payments.portal} target='_blank' variant='contained' color='success'>
          Portal do Produtor
        </Button>
      )}

      {(messagePayment === "Pedido cancelado - compre novamente quando estiver pronto.") && <Alert severity="error">{messagePayment}</Alert>}
      {(messagePayment === "Pedido realizado com sucesso!") && <Alert severity="success">{messagePayment}</Alert>}

    </Box>

  )
}

import { Box, Button, CircularProgress, Container, Grid, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getBalance } from '../../../../features/payments/paymentsSlice'
import { useNavigate } from 'react-router-dom'

export default function StripeBalance() {
  const { user } = useSelector((state) => state.auth)
  const { payments, isLoading } = useSelector((state) => state.payments)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {

    dispatch(getBalance(user.token))

  }, [])


  if(isLoading){
    return <Box sx={
      {
        display: 'flex',
        justifyContent: 'center',
        padding: '50px',
        minHeight:'100vh'
      }
    }>
      <CircularProgress size={100} />
    </Box>
  }


  return (
    <Container sx={{ minHeight: '100vh' }}>

      <Grid container>
        <Grid item md={12} sm={12} xs={12} >
          <Typography variant='h6' >Saldo dísponível</Typography>
          {payments && payments.balance && payments.balance.available.map((item, index) => (
            <Box key={index} sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1,
              backgroundColor: '#efefef', padding: '10px'
            }}>
              <Typography variant='body1' >{item.currency.toUpperCase()}</Typography>
              <Typography variant='body1' >{item.amount / 100}</Typography>
            </Box>
          ))}
        </Grid>

        <Grid item md={12} sm={12} xs={12} >
          <Typography variant='h6' >Saldo pendente</Typography>
          {payments && payments.balance && payments.balance.pending.map((item, index) => (
            <Box key={index} sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1,
              backgroundColor: '#efefef', padding: '10px'
            }}>
              <Typography variant='body1' >{item.currency.toUpperCase()}</Typography>
              <Typography variant='body1' >{item.amount / 100}</Typography>
            </Box>
          ))}
        </Grid>

       
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap:'5px' }}>
          <Button variant='outlined' onClick={() => navigate('/')} >Voltar</Button>
          <Button onClick={() => window.location.href = 'https://dashboard.stripe.com/test/payments'}
            variant='outlined' color='success'>Ver Tudo</Button>
      </Box>

    </Container>

  )
}

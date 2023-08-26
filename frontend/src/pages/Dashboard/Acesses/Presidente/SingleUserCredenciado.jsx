import { Avatar, Box, Button, Container, Divider, Grid, Skeleton, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { getUserData } from '../../../../features/admin/adminSlice'
import { getSubscription } from '../../../../features/payments/paymentsSlice'
import { useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router'

export default function User() {

    const { user } = useSelector((state) => state.auth)
    const { userData: produtor,  } = useSelector((state) => state.admin)
    const { payments, isLoading: isLoadingPayment } = useSelector((state) => state.payments)
    const matches = useMediaQuery('(max-width:800px)')

    const dispatch = useDispatch()

    const { id } = useParams()

    const navigate = useNavigate()

    useEffect(() => {

        dispatch(getUserData({ id, token: user.token }))

    }, [id, user.token, dispatch])

    useEffect(() => {

        if (produtor && produtor.email) {
            dispatch(getSubscription({ email: produtor.email, token: user.token }))
        }

    }, [produtor, user.token, dispatch])

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    return (
        <Container sx={{ minHeight: '100vh' }}>
            <Grid container margin={'20px 0'} >
                <Grid item xs={12} md={4} >
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '10px' }}>

                        {isLoadingPayment ? <Skeleton variant='rectangular' width={'100%'} height={25} /> : (
                            <Typography textAlign={'center'} variant="h6" >{`${produtor && produtor.name}`}</Typography>
                        )}

                        {isLoadingPayment ? <Skeleton variant='rectangular' width={'100%'} height={200} /> : (
                            <Avatar variant='square' src={produtor && produtor.pathFoto ? produtor.pathFoto : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'} alt=""
                                sx={{
                                    width: '100%',
                                    height: '200px',
                                }}
                            />
                        )}

                    </Box>

                </Grid>

                <Divider orientation={matches ? 'horizontal' : 'vertical'} flexItem />

                <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', padding: '10px' }}  >

                    {isLoadingPayment ? <Skeleton variant='rectangular' width={'100%'} height={user.relatory} /> : (
                        <Typography textAlign={'center'} variant='h6'>{user && user.relatory ? user.relatory : 'Usuário não possui relatório'}</Typography>
                    )}
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid item xs={12} md={2} >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItens: 'center', gap: '10px', padding: '10px' }}>

                        {isLoadingPayment ? <Skeleton variant='rectangular' width={'100%'} height={15} /> : (
                            <Typography textAlign={'center'}  variant='h7'>Status: {user && user.status}</Typography>
                        )}

                        {isLoadingPayment ? <Skeleton variant='rectangular' width={'100%'} height={15} /> : (
                            <Typography textAlign={'center'}   variant='h7'>Credencial: {payments && payments.subscription ? 'Ativa' : 'Inativa'}</Typography>
                        )}

                    </Box>

                </Grid>

                <Grid item xs={12} md={12} sx={{ margin: '10px 0' }}  >
                    <Button fullWidth variant='outlined' color='error' href={`/usuario/${id}/editar`}>Descredenciar</Button>
                    <Button sx={{ margin: '10px 0' }} fullWidth variant='outlined' color='success' onClick={() => navigate('/')}>Voltar</Button>
                </Grid>

            </Grid>

        </Container>
    )
}

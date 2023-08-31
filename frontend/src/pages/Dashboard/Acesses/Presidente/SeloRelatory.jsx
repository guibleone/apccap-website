import { Avatar, Box, Button, Container, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { getUserData } from '../../../../features/admin/adminSlice'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function SeloRelatory() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()

    const { user } = useSelector((state) => state.auth)
    const { userData } = useSelector((state) => state.admin)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {

        dispatch(getUserData({ id, token: user.token }))

    }, [])


    return (
        <Container sx={{ minHeight: '100vh' }}>
            <Grid container spacing={2}>

                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', padding: '10px' }}>
                        <Avatar src={userData && userData.pathFoto} sx={{ width: '100px', height: '100px' }} />
                    </Box>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'center', padding: '10px' }}>
                        {userData && userData.selos &&
                            <Typography ariant='p'>{userData.name} possuia {userData.selos.newQuantity} e quer adicionar {userData.selos.quantity} selos</Typography>
                        }
                    </Box>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px' }}>
                        <Button onClick={() => window.open(userData && userData.selos && userData.selos.pathRelatory, '_blank')} variant='outlined'>Baixar relatório</Button>
                        <Button variant='outlined' color='success'>Aprovar</Button>
                        <Button variant='outlined' color='error'>Reprovar</Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <Button variant='outlined' fullWidth color='info' onClick={() => navigate('/')}>Voltar</Button>
                </Grid>

            </Grid>
        </Container>
    )
}

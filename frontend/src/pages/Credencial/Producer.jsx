import { Box, Container, CssBaseline, Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDocuments } from '../../features/documents/documentsSlice'
import Documents from '../MyPerfil/Documents'
import { FcApproval, FcClock } from 'react-icons/fc'

function Producer() {

    const { user } = useSelector((state) => state.auth)

    const dispatch = useDispatch()

    useEffect(() => {
        if (user) {
            dispatch(getDocuments(user.token))
        }
    }, [dispatch, user])


    if (!user) {
        return (
            <Container sx={{ height: '100vh' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems:'center', gap:'10px' }}>
                    <Typography variant='h4'>Faça login para conferir sua credencial</Typography>
                    <Button href='/entrar' fullWidth variant='contained' color='success'>Login</Button>
                </Box>
            </Container>
        )
    }

    return (
        <Container sx={{ height: '100vh' }}>
            <CssBaseline />

            <Box sx={{ display: 'flex', margin: '15px 0' }}>
                {user.status ? <Typography variant='h4'> Aprovado <FcApproval /> </Typography>
                    : <Typography variant='h4'> Aguardando Aprovação <FcClock /></Typography>}
            </Box>

            <Box>
                <Documents />
            </Box>
        </Container>
    )
}

export default Producer
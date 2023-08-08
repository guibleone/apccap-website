import { Box, Container, CssBaseline, Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDocuments } from '../../features/documents/documentsSlice'
import Documents from '../MyPerfil/Documents'
import { FcApproval, FcCancel, FcClock } from 'react-icons/fc'

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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <Typography variant='h4'>Faça login para conferir  o processo de adesão aos produtores credenciados</Typography>
                    <Button href='/entrar' fullWidth variant='contained' color='success'>Login</Button>
                </Box>
            </Container>
        )
    }

    return (
        <Container sx={{ height: '100vh' }}>
            <CssBaseline />

            <Box sx={{ display: 'flex', margin: '15px 0' }}>

                {user.status === 'analise' && <Typography variant='h4'>Seu cadastro está em análise <FcClock /></Typography>}

                {user.status === 'aprovado' && (
                    <Box sx={{display:'flex', flexDirection:'column'}}>
                        <Typography variant='h4'>Aprovado <FcApproval /> </Typography>
                        <Typography>{user.relatory}</Typography>
                    </Box>
                )}
                
                {user.status === 'reprovado' && (
                    <Box sx={{display:'flex', flexDirection:'column'}}>
                        <Typography variant='h4'>Reprovado <FcCancel /> </Typography>
                        <Typography>{user.relatory}</Typography>
                    </Box>
                )}
            </Box>

            <Box>
                <Documents />
            </Box>
        </Container>
    )
}

export default Producer
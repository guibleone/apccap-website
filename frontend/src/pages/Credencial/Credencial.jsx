import { Box, Container, CssBaseline, Typography, Button, CircularProgress, Link } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDocuments } from '../../features/documents/documentsSlice'
import Documents from '../MyPerfil/Documents'
import { FcApproval, FcCancel, FcClock } from 'react-icons/fc'
import { resetAprove } from '../../features/auth/authSlice'
import Mensalidade from './Mensalidade'


function Producer() {

    const { user, isLoading } = useSelector((state) => state.auth)

    const dispatch = useDispatch()

    useEffect(() => {

        if (user) {
            dispatch(getDocuments(user.token))
        }

    }, [user])


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
        <Container sx={{ minHeight: '100vh' }}>
            <CssBaseline />

            <Box sx={{ display: 'flex', flexDirection:'column', gap:'10px', alignItems:'center' }}>

                {user.status === 'analise' && <Typography textAlign='center' variant='h4'>Seu cadastro está em análise <FcClock /></Typography>}

                {user.status === 'aprovado' && (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap:'10px' }}>
                            <Typography textAlign='center' variant='h4'>Aprovado <FcApproval /> </Typography>
                            <Typography>{user.relatory}</Typography>

                            <Typography variant='p'>Como produtor credenciado você terá que pagar uma taxa mensal.
                                Caso não pague estará sujeito a reinvidicação da credencial.
                            </Typography>

                            <Mensalidade />


                        </Box>
                    </>
                )}

                {user.status === 'reprovado' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h4'>Reprovado <FcCancel /> </Typography>
                        <Typography>{user.relatory}</Typography>
                    </Box>
                )}
            </Box>

            <Box>

                {(user.status === 'analise') && <Documents />}

                {user.status === 'reprovado' &&
                    <Button
                        disabled={isLoading}
                        onClick={() => dispatch(resetAprove({ id: user._id, token: user.token }))}
                        variant='contained'
                        fullWidth
                    >
                        {isLoading ? <CircularProgress color="success" size={24} /> : 'Tentar Novamente'}

                    </Button>}
            </Box>
        </Container>
    )
}

export default Producer
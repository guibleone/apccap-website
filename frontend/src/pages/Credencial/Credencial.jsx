import { Box, Container, CssBaseline, Typography, Button, CircularProgress, Link } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDocuments } from '../../features/documents/documentsSlice'
import Documents from '../MyPerfil/Documents'
import { FcApproval, FcCancel, FcClock, FcHighPriority } from 'react-icons/fc'
import { resetAprove, sendRecurso } from '../../features/auth/authSlice'
import Mensalidade from './Mensalidade'
import { toast } from 'react-toastify'
import { styleError } from '../toastStyles'


function Producer() {

    const { user, isLoading } = useSelector((state) => state.auth)
    const fileInput = useRef(null);

    const dispatch = useDispatch()

    // informação do documento
    const [documentData, setDocumentData] = useState({
        path: '',
        id: user._id,
        token: user.token
    })

    const onChange = (e) => {
        setDocumentData({ ...documentData, path: fileInput.current.files[0] })
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (!documentData.path) return toast.error('Selecione um arquivo', styleError)
        dispatch(sendRecurso(documentData))
    }


    const recursoTime = user.analise?.analise_pedido?.recurso?.time;

    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (recursoTime) {
            const targetDate = new Date(recursoTime);
            targetDate.setDate(targetDate.getDate() + 30);

            const interval = setInterval(() => {
                const now = new Date().getTime();
                const distance = targetDate.getTime() - now;

                if (distance <= 0) {
                    //dispatch(repproveRecurso())
                    setTimeLeft('Time has expired');
                    clearInterval(interval);
                } else {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    const timeLeftString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

                    setTimeLeft(timeLeftString);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [recursoTime]);


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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', padding: '20px' }}>

                {user.status === 'analise' && !user.analise && user.analise.analise_pedido.recurso.status &&
                    <>
                        <Typography textAlign='center' variant='h4'>Seu cadastro está em análise <FcClock /></Typography>
                        <Documents />
                    </>
                }

                {user.status === 'analise' && user.analise && user.analise.analise_pedido.recurso.path === '' &&
                    <>
                        <Typography textAlign={'center'} variant='h5'>Seus documentos foram inválidados <FcHighPriority style={{ verticalAlign: 'bottom' }} size={35} /></Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                            <FcClock size={60} />
                            <Typography variant='h6'>{timeLeft}</Typography>
                            <Typography variant='p'>Tempo restante para o envio do recurso </Typography>
                            <form onSubmit={onSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <input onChange={onChange} type="file" name="recurso" ref={fileInput} />
                                    <Button type='submit' sx={{ minWidth: '100%' }} variant='outlined' color='success'>Enviar</Button>
                                </Box>
                            </form>
                        </Box>
                    </>
                }

                {user.status === 'analise' && user.analise && user.analise.analise_pedido.recurso.path &&
                    <>
                        <Typography textAlign={'center'} variant='h5'>Seu recurso foi enviado. Por favor aguarde<FcClock style={{ verticalAlign: 'bottom' }} size={35} /></Typography>
                    </>
                }


                {user.status === 'aprovado' && (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                            <Typography variant='h4'>Aprovado <FcApproval /> </Typography>
                            <Typography>{user.relatory}</Typography>

                            <Typography textAlign={'center'} variant=''>Assine a nossa credencial para ter acesso a todas funcionalidades</Typography>

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

                {user.status === 'reprovado' &&
                    <Button
                        disabled={isLoading}
                        onClick={() => dispatch(resetAprove({ id: user._id, token: user.token }))}
                        variant='contained'
                        fullWidth
                    >
                        {isLoading ? <CircularProgress color="success" size={24} /> : 'Tentar Novamente'}

                    </Button>
                }
            </Box>
        </Container>
    )
}

export default Producer
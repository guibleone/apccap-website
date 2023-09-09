import { Box, Container, CssBaseline, Typography, Button, CircularProgress, Link, Grid, Divider, useMediaQuery, Alert } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDocuments } from '../../features/documents/documentsSlice'
import Documents from '../MyPerfil/Documents'
import { FcApproval, FcCancel, FcClock, FcHighPriority, FcPrivacy } from 'react-icons/fc'
import { resetAprove, sendRecurso } from '../../features/auth/authSlice'
import Mensalidade from './Mensalidade'
import { toast } from 'react-toastify'
import { styleError } from '../toastStyles'
import { AiOutlineDownload } from 'react-icons/ai'
import { repproveRecurso } from '../../features/admin/adminSlice'


function Producer() {

    const { user, isLoading } = useSelector((state) => state.auth)
    const { payments } = useSelector((state) => state.payments)

    const fileInput = useRef(null);

    const dispatch = useDispatch()
    const matches = useMediaQuery('(min-width:800px)')

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
                    const data = {
                        id: user._id,
                        token: user.token
                    }

                    dispatch(repproveRecurso(data))
                    setTimeLeft('Tempo esgotado!');
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

    if (isLoading) {
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


    return (
        <Container sx={{ minHeight: '100vh' }}>
            <CssBaseline />

            {user.status === 'analise' && user.analise.analise_pedido.status === '' &&
                <>
                    <Documents />
                </>
            }

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', padding: '20px' }}>

                {user.status === 'analise' && user.analise && user.analise.analise_pedido.status === 'reprovado' &&
                    user.analise.analise_pedido.recurso.path === '' &&
                    <>
                        <Typography textAlign={'center'} variant='h5'>Seus documentos foram inválidados <FcHighPriority style={{ verticalAlign: 'bottom' }} size={35} /></Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                            <Button variant='outlined' href={user.analise && user.analise.analise_pedido.path}>Análise do Pedido</Button>
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
                            <Typography variant='h5'>Aprovado <FcApproval style={{ verticalAlign: 'bottom' }} size={35} /> </Typography>
                            <Typography>{user.relatory}</Typography>

                            {payments && payments.portal ?
                                <>
                                    <Typography textAlign={'center'} variant=''>Você já possui uma assinatura ativa</Typography>
                                </>
                                :
                                <>
                                    <Typography textAlign={'center'} variant=''>Assine a nossa credencial para ter acesso a todas funcionalidades</Typography>
                                </>
                            }

                            <Mensalidade />


                        </Box>
                    </>
                )}

                {user.status === 'reprovado' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h5'>Sua credencial foi reprovada <FcCancel /> </Typography>
                        <Button
                            disabled={isLoading}
                            onClick={() => dispatch(resetAprove({ id: user._id, token: user.token }))}
                            variant='outlined'
                            fullWidth
                        >
                            {isLoading ? <CircularProgress color="success" size={24} /> : 'Tentar Novamente'}

                        </Button>
                    </Box>
                )}
            </Box>

            {(user.status === 'aprovado' || user.status === 'analise') &&
                <>
                    <Typography textAlign='center' variant='h5'>Acompanhe o Processo</Typography>


                    <Grid container spacing={2} sx={{ marginTop: '20px', marginBottom: '40px' }} >

                        <Grid item xs={12} sm={12} lg={3.9} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                                <Typography variant='h6'>Análise do pedido</Typography>
                                <Typography variant='p'>Parecer sobre os documentos do produtor</Typography>

                                {user.analise && user.analise.analise_pedido.path && user.analise.analise_pedido.status !== 'pendente' ? (
                                    <>
                                        <Box sx={{ display: 'flex' }}>
                                            <Button color="success" href={user.analise && user.analise.analise_pedido.path}><AiOutlineDownload size={25} /></Button>
                                        </Box>

                                        {user.analise && (
                                            <>

                                                {user.analise.analise_pedido.status === 'reprovado' &&
                                                    <Alert severity="error">Relatório reprovado pela direção</Alert>
                                                }

                                                {user.analise.analise_pedido.status === 'aprovado' &&
                                                    <Alert severity="success">Análise de relatório concluída</Alert>
                                                }
                                            </>
                                        )}
                                    </>

                                ) :
                                    <Alert severity="info">Aguarde o laudo</Alert>
                                }
                            </Box>

                        </Grid>

                        <Divider orientation="vertical" flexItem={matches} />

                        <Grid item xs={12} sm={12} lg={3.9} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                                <Typography variant='h6'>Vistoria</Typography>
                                <Typography variant='p'>Parecer do técnico sobre a cadeia produtiva</Typography>

                                {user.analise && user.analise.vistoria.path && user.analise.vistoria.status !== 'pendente' ? (
                                    <>
                                        <Box sx={{ display: 'flex' }}>
                                            <Button color="success" href={user.analise && user.analise.vistoria.path}><AiOutlineDownload size={25} /></Button>
                                        </Box>

                                        {user.analise && (
                                            <>

                                                {user.analise.vistoria.status === 'reprovado' &&
                                                    <Alert severity="error">Relatório reprovado pela direção</Alert>
                                                }

                                                {user.analise.vistoria.status === 'aprovado' &&
                                                    <Alert severity="success">Análise de relatório concluída</Alert>
                                                }
                                            </>
                                        )}
                                    </>

                                ) :
                                    <Alert severity="info">Aguarde o laudo</Alert>
                                }
                            </Box>

                        </Grid>

                        <Divider orientation="vertical" flexItem={matches} />


                        <Grid item xs={12} sm={12} lg={3.9} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                                <Typography variant='h6'>Análise Laboratorial</Typography>
                                <Typography variant='p'>Parecer do laboratório credenciado</Typography>

                                {user.analise && user.analise.analise_laboratorial.path && user.analise.analise_laboratorial.status !== 'pendente' ? (
                                    <>
                                        <Box sx={{ display: 'flex' }}>
                                            <Button color="success" href={user.analise && user.analise.analise_laboratorial.path}><AiOutlineDownload size={25} /></Button>
                                        </Box>

                                        {user.analise && (
                                            <>

                                                {user.analise.analise_laboratorial.status === 'reprovado' &&
                                                    <Alert severity="error">Relatório reprovado pela direção</Alert>
                                                }

                                                {user.analise.analise_laboratorial.status === 'aprovado' &&
                                                    <Alert severity="success">Análise de relatório concluída</Alert>
                                                }
                                            </>
                                        )}

                                    </>

                                ) :
                                    <Alert severity="info">Aguarde o laudo</Alert>
                                }
                            </Box>

                        </Grid>

                    </Grid>
                </>
            }

        </Container>
    )
}

export default Producer
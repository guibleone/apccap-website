import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Container, Grid, Modal, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../../colors'
import { BsArrowDownShort, BsArrowRightShort, BsArrowUpRight, BsChevronDown, BsChevronRight } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../../toastStyles'
import { AiOutlineDownload } from 'react-icons/ai'
import { FcClock, FcHighPriority } from 'react-icons/fc'
import { repproveRecurso } from '../../../features/admin/adminSlice'
import { sendRecurso } from '../../../features/auth/authSlice'

export default function Analise() {
    // inicializa o dispatch
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)


    // informação do documento
    const fileInput = useRef(null);

    const [documentData, setDocumentData] = useState({
        path: '',
        id: user && user._id,
        token: user && user.token
    })

    const onChange = (e) => {
        setDocumentData({ ...documentData, path: fileInput.current.files[0] })
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (!documentData.path) return toast.error('Selecione um arquivo', styleError)
        dispatch(sendRecurso(documentData))
    }

    // tempo para envio do recurso
    const recursoTime = user.analise?.analise_pedido?.recurso?.time

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

    return (
        <>
            <Box sx={{ textAlign: 'center' }}>
                <h1 className='bold black'>
                    Análise
                </h1>
                <h5 className='regular black'>
                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                </h5>
            </Box>

            {user && user.status === 'analise' && user.analise && user.analise.analise_pedido.status === 'reprovado' &&
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
            
            {user && user.status === 'analise' && user.analise.status === 'reprovado' && user.analise.analise_pedido.recurso.path &&
                    <>
                        <Typography textAlign={'center'} variant='h5'>Seu recurso foi enviado. Por favor aguarde<FcClock style={{ verticalAlign: 'bottom' }} size={35} /></Typography>
                    </>
                }

            <Grid container spacing={2} columnSpacing={5} sx={{ marginTop: '20px', marginBottom: '40px' }} >

                <Grid item xs={12} sm={12} lg={4} >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', border: '1px solid #000', padding: '20px', borderRadius: '10px' }}>

                        <h4> Análise do pedido</h4>

                        {user && user.analise && user.analise.analise_pedido.path && user.analise.analise_pedido.status !== 'pendente' ? (
                            <>
                                <Box sx={{ display: 'flex' }}>
                                    <Button color="success" href={user.analise && user.analise.analise_pedido.path}><AiOutlineDownload size={25} /></Button>
                                </Box>

                                {user && user.analise && (
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

                <Grid item xs={12} sm={12} lg={4} >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', border: '1px solid #000', padding: '20px', borderRadius: '10px' }}>

                        <h4 >Vistoria</h4>

                        {user && user.analise && user.analise.vistoria.path && user.analise.vistoria.status !== 'pendente' ? (
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

                <Grid item xs={12} sm={12} lg={4} >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', border: '1px solid #000', padding: '20px', borderRadius: '10px' }}>

                        <h4 >Análise Laboratorial</h4>

                        {user && user.analise && user.analise.analise_laboratorial.path && user.analise.analise_laboratorial.status !== 'pendente' ? (
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
    )
}

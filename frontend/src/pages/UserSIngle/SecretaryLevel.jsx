import React, { useEffect, useState } from 'react'
import { Box, Typography, TextareaAutosize, Container, Button, Divider, CircularProgress, useMediaQuery, Modal, Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { FaDownload } from 'react-icons/fa'
import { downloadDocument } from '../../features/documents/documentsSlice'
import { toast } from 'react-toastify'
import { approveRelatory, repproveRelatory, sendRelatoryEmail } from '../../features/admin/adminSlice'
import { AiFillWarning } from 'react-icons/ai'
import { styleError, styleSuccess } from '../toastStyles'
import { FcClock } from 'react-icons/fc'

export default function SecretaryLevel() {

    const { user } = useSelector((state) => state.auth)
    const { userData, documentsData, isLoading, isSuccess, isError, emailStatus, message } = useSelector((state) => state.admin)
    const dispatch = useDispatch()

    const documents = documentsData ? documentsData : []

    const matches = useMediaQuery('(min-width:600px)');

    const style = matches ? {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,

    } : {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,

    }


    const [openApprove, setOpenApprove] = useState(false)
    const [openRepprove, setOpenRepprove] = useState(false)

    const [type, setType] = useState('')

    const handleOpenApprove = () => setOpenApprove(!openApprove)
    const handleOpenRepprove = () => setOpenRepprove(!openRepprove)


    const handleApprove = async () => {

        const data = {
            id: userData._id,
            type: type,
            token: user.token
        }

        const emailData = {
            email: userData.email,
            result: 'APROVADO',
            type: type
        }

        dispatch(approveRelatory(data))
     //dispatch(sendRelatoryEmail(emailData))

    }

    const handleRepprove = async () => {
        const data = {
            id: userData._id,
            type: type,
            token: user.token
        }

        const emailData = {
            email: userData.email,
            result: 'REPROVADO',
            type: type
        }

        dispatch(repproveRelatory(data))

       // dispatch(sendRelatoryEmail(emailData))

    }

    useEffect(() => {

        if (isError && !emailStatus.isError) {
            toast.error(message, styleError)
        }

        if (isSuccess && !emailStatus.isSuccess) {
            toast.success(message, styleSuccess)
        }

        if (emailStatus.isError) {
            toast.error('Erro ao enviar email', styleError)
        }

        if (emailStatus.isSuccess) {
            toast.success('Email enviado com sucesso', styleSuccess)
        }

    }, [isError, isSuccess, emailStatus.isError, emailStatus.isSuccess])

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
        <Container sx={{ height: '100vh' }}>
            <Box>
                <Typography variant='h5'>{userData.name} - {userData.cpf}</Typography>
                {userData.analise && !userData.analise.analise_pedido.path && <Typography variant='h6'>Aguardando análise do conselho</Typography>}
                <Box>
                    {userData.analise && userData.analise.analise_pedido.path && (
                        <>
                            <Typography variant='h6'>Relatório da Análise do Pedido</Typography>
                            <Box sx={{ display: 'flex', gap: '5px' }}>
                                {userData.analise && userData.analise.analise_pedido.status === 'pendente' &&
                                    <>
                                        <Button href={userData.analise.analise_pedido.path} target='_blank' variant='outlined' color='info' startIcon={<FaDownload />}>Baixar</Button>
                                        <Button onClick={() => { handleOpenRepprove(); setType('analise_pedido'); }} color='error'>Reprovar</Button>
                                        <Button onClick={() => { handleOpenApprove(); setType('analise_pedido'); }} color='success'>Aprovar</Button>
                                    </>
                                }
                                {userData.analise && userData.analise.analise_pedido.status === 'aprovado' &&
                                    <>
                                        <Alert severity="success">Análise aprovada !</Alert>
                                    </>
                                }
                                {userData.analise && userData.analise.analise_pedido.status === 'reprovado' &&
                                    <>
                                        <Alert severity="error">Análise reprovada !</Alert>
                                    </>
                                }
                            </Box>
                        </>
                    )}

                    {userData.analise && userData.analise.vistoria.path && (
                        <>
                            <Typography variant='h6'>Relatório da Vistoria</Typography>
                            <Box sx={{ display: 'flex', gap: '5px' }}>
                                {userData.analise && userData.analise.vistoria.status === 'pendente' &&
                                    <>
                                        <Button href={userData.analise.vistoria.path} target='_blank' variant='outlined' color='info' startIcon={<FaDownload />}>Baixar</Button>
                                        <Button onClick={() => { handleOpenRepprove(); setType('vistoria'); }} color='error'>Reprovar</Button>
                                        <Button onClick={() => { handleOpenApprove(); setType('vistoria'); }} color='success'>Aprovar</Button>
                                    </>
                                }
                                {userData.analise && userData.analise.vistoria.status === 'aprovado' &&
                                    <>
                                        <Alert severity="success">Análise aprovada !</Alert>
                                    </>
                                }
                                {userData.analise && userData.analise.vistoria.status === 'reprovado' &&
                                    <>
                                        <Alert severity="error">Análise reprovada !</Alert>
                                    </>
                                }
                            </Box>
                        </>
                    )}


                    {userData.analise && userData.analise.analise_laboratorial.path && (
                        <>
                            <Typography variant='h6'>Relatório da Análise Laboratorial</Typography>
                            <Box sx={{ display: 'flex', gap: '5px' }}>
                                {userData.analise && userData.analise.analise_laboratorial.status === 'pendente' &&
                                    <>
                                        <Button href={userData.analise.analise_laboratorial.path} target='_blank' variant='outlined' color='info' startIcon={<FaDownload />}>Baixar</Button>
                                        <Button onClick={() => { handleOpenRepprove(); setType('analise_laboratorial'); }} color='error'>Reprovar</Button>
                                        <Button onClick={() => { handleOpenApprove(); setType('analise_laboratorial'); }} color='success'>Aprovar</Button>
                                    </>
                                }
                                {userData.analise && userData.analise.analise_laboratorial.status === 'aprovado' &&
                                    <>
                                        <Alert severity="success">Análise aprovada !</Alert>
                                    </>
                                }
                                {userData.analise && userData.analise.analise_laboratorial.status === 'reprovado' &&
                                    <>
                                        <Alert severity="error">Análise reprovada !</Alert>
                                    </>
                                }
                            </Box>
                        </>
                    )}
                </Box>

                <Modal
                    open={openApprove}
                    onClose={handleOpenApprove}
                >
                    <Box sx={style}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <Box display={'flex'} justifyContent={'space-between'}>
                                <Typography variant="h6" >Tem certeza ? </Typography>
                                <AiFillWarning color='red' size={30} />
                            </Box>

                            <Typography variant="h7" > Essa ação é permanente. </Typography>
                            <Typography color='error' variant="p" > Será enviado um email ao produtor.</Typography>

                            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <Button color='error' variant='contained' onClick={handleOpenApprove}>Cancelar</Button>

                                <Button
                                    disabled={isLoading}
                                    color="success"
                                    variant='contained'
                                    onClick={handleApprove}
                                >
                                    {isLoading ? <CircularProgress color="success" size={24} /> : 'Aprovar'}
                                </Button>

                            </Box>
                        </Box>
                    </Box>
                </Modal>


                <Modal
                    open={openRepprove}
                    onClose={handleOpenRepprove}
                >
                    <Box sx={style}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <Box display={'flex'} justifyContent={'space-between'}>
                                <Typography variant="h6" >Tem certeza ? </Typography>
                                <AiFillWarning color='red' size={30} />
                            </Box>

                            <Typography variant="h7" > Essa ação é permanente. </Typography>
                            <Typography color='error' variant="p" > Será enviado um email ao produtor.</Typography>

                            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <Button color='error' variant='contained' onClick={handleOpenRepprove}>Cancelar</Button>

                                <Button
                                    disabled={isLoading}
                                    color="success"
                                    variant='contained'
                                    onClick={handleRepprove}
                                >
                                    {isLoading ? <CircularProgress color="success" size={24} /> : 'Reprovar'}
                                </Button>

                            </Box>
                        </Box>
                    </Box>
                </Modal>

            </Box>

        </Container>

    )
}

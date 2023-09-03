import { Avatar, Box, Button, CircularProgress, Container, Grid, Modal, TextareaAutosize, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { approveSelos, disaproveSelos, getUserData, resetStatus, sendEmail } from '../../../../features/admin/adminSlice'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiFillWarning } from 'react-icons/ai'
import { styleError, styleSuccess } from '../../../toastStyles'
import { toast } from 'react-toastify'

export default function SeloRelatory() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()

    const matches = useMediaQuery('(min-width:600px)');

    const { user } = useSelector((state) => state.auth)
    const { userData, isLoading, isSuccess, isError, message } = useSelector((state) => state.admin)

    const [openDesaprove, setOpenDesaprove] = useState(false);
    const [openApprove, setOpenApprove] = useState(false);
    const [relatory, setRelatory] = useState('');

    const handleOpenDesaprove = () => setOpenDesaprove(!openDesaprove);
    const handleOpenApprove = () => setOpenApprove(!openApprove);

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

    const handleDessaprove = () => {
        if (!relatory) return toast.error('Preencha o motivo da reprovação.', styleError)

        const message = `<h4>${userData.selos.quantity} selos foram reprovados.</h4> <br> ${relatory} <br> Tente o processo novamente.`

        dispatch(sendEmail({
            email: userData.email,
            title: 'Reprovação de selo',
            message: message,
        }))

        const seloData = {
            id,
            token: user.token
        }

        dispatch(disaproveSelos(seloData))

        toast.success('Selos reprovados com sucesso', styleSuccess)
        navigate('/')
    }

    const handleApprove = () => {
        if (!relatory) return toast.error('Preencha o motivo da aprovação.', styleError)

        const message = `<h4>${userData.selos.quantity} selos foram aprovados.</h4> <br> ${relatory} <br> Faça o pagamento e aproveite seus selos.`

        dispatch(sendEmail({
            email: userData.email,
            title: 'Aprovação de selo',
            message: message,
        }))


        const seloData = {
            id,
            token: user.token
        }

        dispatch(approveSelos(seloData))


        toast.success('Selos aprovados com sucesso', styleSuccess)
        navigate('/')
    }





    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {

        dispatch(getUserData({ id, token: user.token }))

    }, [])

    useEffect(() => {

        if (isSuccess) {
            toast.success(message, styleSuccess)
        }

        if (isError) {
            toast.error(message, styleError)
        }

        dispatch(resetStatus())

    }, [isSuccess, isError, message])


    return (
        <Container sx={{ minHeight: '100vh' }}>
            <Grid container spacing={2}>

                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', padding: '10px' }}>
                        <Avatar src={userData && userData.pathFoto} sx={{ width: '100px', height: '100px' }} />
                    </Box>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'center', flexDirection: 'column', padding: '10px' }}>
                        {userData && userData.selos &&
                            <Typography ariant='p'>{userData.name} possui <span style={{ color: 'red' }}>{userData.selos.newQuantity} </span>
                                e quer adicionar <span style={{ color: 'green' }}>{userData.selos.quantity}</span> selos</Typography>
                        }

                        {userData && userData.address && (
                            <>
                                <Typography variant='p'>CEP - {userData.address.cep} </Typography>
                                <Typography variant='p'>{userData.address.logradouro} , {userData.address.numero} </Typography>
                                <Typography variant='p'>{userData.address.cidade} / {userData.address.estado} </Typography>
                            </>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px' }}>

                        <Button onClick={() => window.open(userData && userData.selos && userData.selos.pathRelatory, '_blank')} variant='outlined'>Baixar relatório</Button>

                        <Button fullWidth onClick={handleOpenApprove} color='success' variant='outlined'>Aprovar</Button>

                        <Modal
                            open={openApprove}
                            onClose={handleOpenApprove}
                        >
                            <Box sx={style}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    alignItems: 'center',
                                }}>
                                    <Box display={'flex'} justifyContent={'space-between'}>
                                        <Typography variant="h6" >Aprovar selos ? </Typography>
                                        <AiFillWarning color='red' size={30} />
                                    </Box>

                                    <Typography textAlign={'center'} variant="h7" >Digite o motivo da aprovação.</Typography>

                                    <TextareaAutosize onChange={(e) => setRelatory(e.target.value)} minRows={8} style={{ width: '100%', padding: '10px', border: '1px solid black' }} />

                                    <Typography color={'red'} variant="h7" >Será enviado um email ao produtor.</Typography>

                                    <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>

                                        <Button color='error' variant='outlined' onClick={handleOpenApprove}>Cancelar</Button>

                                        <Button
                                            disabled={isLoading}
                                            color="success"
                                            variant='outlined'
                                            onClick={handleApprove}
                                        >
                                            {isLoading ? <CircularProgress color="success" size={24} /> : 'Aprovar'}
                                        </Button>

                                    </Box>
                                </Box>
                            </Box>
                        </Modal>

                        <Button fullWidth onClick={handleOpenDesaprove} color='error' variant='outlined'>Reprovar</Button>

                        <Modal
                            open={openDesaprove}
                            onClose={handleOpenDesaprove}
                        >
                            <Box sx={style}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    alignItems: 'center',
                                }}>
                                    <Box display={'flex'} justifyContent={'space-between'}>
                                        <Typography variant="h6" >Reprovar selos ? </Typography>
                                        <AiFillWarning color='red' size={30} />
                                    </Box>

                                    <Typography textAlign={'center'} variant="h7" >Digite o motivo da reprovação.</Typography>

                                    <TextareaAutosize onChange={(e) => setRelatory(e.target.value)} minRows={8} style={{ width: '100%', padding: '10px', border: '1px solid black' }} />

                                    <Typography color={'red'} variant="h7" >Será enviado um email ao produtor.</Typography>

                                    <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>

                                        <Button color='error' variant='outlined' onClick={handleOpenDesaprove}>Cancelar</Button>

                                        <Button
                                            disabled={isLoading}
                                            color="success"
                                            variant='outlined'
                                            onClick={handleDessaprove}
                                        >
                                            {isLoading ? <CircularProgress color="success" size={24} /> : 'Reprovar'}
                                        </Button>

                                    </Box>
                                </Box>
                            </Box>
                        </Modal>
                    </Box>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <Button variant='outlined' fullWidth color='info' onClick={() => navigate('/')}>Voltar</Button>
                </Grid>

            </Grid>
        </Container>
    )
}

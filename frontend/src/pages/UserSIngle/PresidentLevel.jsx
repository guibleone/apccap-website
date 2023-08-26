import { useSelector, useDispatch } from 'react-redux'
import { Box, CircularProgress, Container, Typography, Button, TextareaAutosize, Modal, useMediaQuery } from '@mui/material';
import Email from '../../components/Email/Email';
import { aproveUser, reset, sendEmail, disapproveUser } from '../../features/admin/adminSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { AiFillWarning } from 'react-icons/ai'
import { styleError, styleSuccess } from '../toastStyles';


export default function PresidentLevel() {
    const { user } = useSelector((state) => state.auth)
    const { userData, isLoading, message, isSuccess, isError, emailStatus } = useSelector((state) => state.admin)

    const dispatch = useDispatch()
    const navigate = useNavigate()

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

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openDesaprove, setOpenDesaprove] = useState(false);
    const handleOpenDesaprove = () => setOpenDesaprove(true);
    const handleCloseDesaprove = () => setOpenDesaprove(false);

    const handleApprove = () => {
        dispatch(sendEmail({
            email: userData.email,
            title: 'Aprovação de credenciamento',
            message: userData.relatory,
        }))

        dispatch(aproveUser({ id: userData._id, token: user.token }))
    }

    const handleDesaprove = () => {
        dispatch(sendEmail({
            email: userData.email,
            title: 'Desaprovação de credenciamento',
            message: userData.relatory,
        }))

        dispatch(disapproveUser({ id: userData._id, token: user.token }))
    }

    useEffect(() => {

        if (isSuccess) {
            toast.success(message, styleSuccess)

            navigate('/')
        }

        if (isError) {
            toast.error(message, styleError)
        }

        dispatch(reset())

    }, [])

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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Typography variant='h4'>{userData.name}</Typography>
                <TextareaAutosize
                    minRows={8}
                    placeholder='Mensagem'
                    style={{ width: "100%", resize: 'none', fontSize: '16px', padding: '10px', margin: '10px 0' }}
                    maxRows={8}
                    name='message'
                    defaultValue={userData.relatory}
                    disabled={true}
                />

                <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <Button onClick={handleOpenDesaprove} color='error' variant='contained'>Desaprovar</Button>
                    <Modal
                        open={openDesaprove}
                        onClose={handleCloseDesaprove}
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
                                <Typography variant="h7" > Você não poderá reverter essa ação.</Typography>

                                <Typography variant="h7" > Ao desaprovar, o usuário receberá um email com o relatório.</Typography>

                                <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <Button color='error' variant='contained' onClick={handleCloseDesaprove}>Cancelar</Button>

                                    <Button
                                        disabled={isLoading}
                                        color="success"
                                        variant='contained'
                                        onClick={handleDesaprove}
                                    >
                                        {isLoading ? <CircularProgress color="success" size={24} /> : 'Desaprovar'}
                                    </Button>

                                </Box>
                            </Box>
                        </Box>
                    </Modal>


                    <Button onClick={handleOpen} color='success' variant='contained'>Aprovar</Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
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

                                <Typography variant="h7" > Você não poderá reverter essa ação.</Typography>

                                <Typography variant="h7" > Ao aprovar, o usuário receberá um email com o relatório.</Typography>

                                <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>

                                    <Button color='error' variant='contained' onClick={handleClose}>Cancelar</Button>

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

                </Box>
            </Box>


        </Container>
    )
}

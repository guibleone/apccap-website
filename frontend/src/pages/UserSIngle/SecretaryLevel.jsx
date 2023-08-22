import React, { useState } from 'react'
import { Box, Typography, TextareaAutosize, Container, Button, Divider, CircularProgress, useMediaQuery, Modal } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { FaDownload } from 'react-icons/fa'
import { downloadDocument } from '../../features/documents/documentsSlice'
import { toast } from 'react-toastify'
import { sendRelatory } from '../../features/admin/adminSlice'
import { AiFillWarning } from 'react-icons/ai'

export default function SecretaryLevel() {

    const { user } = useSelector((state) => state.auth)
    const { userData, documentsData, isLoading } = useSelector((state) => state.admin)
    const dispatch = useDispatch()

    const documents = documentsData ? documentsData : []

    const styleError = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    }

    const styleSuccess = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    }

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


    const userRelatory = userData.relatory ? userData.relatory : ''

    const [relatory, setRelatory] = useState(userRelatory)

    const handleRelatory = async () => {

        if (!relatory) {
            return toast.error('Insira um relatório válido', styleError)
        }


        const relatoryData = {
            relatory,
            id: userData._id,
            token: user.token
        }

        dispatch(sendRelatory(relatoryData))

        toast.success('Relatório enviado com sucesso', styleSuccess)
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
        <Container sx={{ height: '100vh' }}>
            <Box>
                <Typography variant='h4'>{userData.name} - {userData.cpf}</Typography>

                <Box>
                    <Typography variant="h5" component="div">Documentos</Typography>

                    {documents.length > 0 ? documents.map((document) => (
                        <Box sx={
                            {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                border: '1px solid black',
                                padding: '10px',
                                margin: '10px 0'
                            }
                        } key={document._id}>
                            <p>{document.name}</p>
                            <Button variant="contained" color="success" onClick={() => dispatch(downloadDocument(document))}>{<FaDownload />}</Button>
                        </Box>

                    )) : <p>Nenhum documento adicionado</p>

                    }
                </Box>

                <Divider sx={{ margin: '20px 0' }} />

                <Typography variant="h5" component="div">Relatório</Typography>

                <TextareaAutosize
                    minRows={8}
                    placeholder='Mensagem'
                    style={{ width: "100%", resize: 'none', fontSize: '16px', padding: '10px', margin: '10px 0' }}
                    maxRows={8}
                    name='message'
                    defaultValue={userRelatory}
                    onChange={(e) => setRelatory(e.target.value)}
                    disabled={userRelatory ? true : false}

                />

                {!userRelatory &&
                    <Box sx={{
                        display: 'flex'
                    }}>
                        <Button onClick={handleOpen} fullWidth color='success' variant='contained'>Enviar</Button>
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
                                    <Typography variant="h7" > Você não poderá alterar o relatório depois de enviado.</Typography>

                                    <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <Button color='error' variant='contained' onClick={handleClose}>Cancelar</Button>

                                        <Button
                                            disabled={isLoading}
                                            color="success"
                                            variant='contained'
                                            onClick={handleRelatory}
                                        >
                                            {isLoading ? <CircularProgress color="success" size={24} /> : 'Enviar'}
                                        </Button>

                                    </Box>
                                </Box>
                            </Box>
                        </Modal>

                    </Box>
                }

            </Box>
        </Container>

    )
}

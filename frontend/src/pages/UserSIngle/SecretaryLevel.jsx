import React, { useState } from 'react'
import { Box, Typography, TextareaAutosize, Container, Button, Divider, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { FaDownload } from 'react-icons/fa'
import { downloadDocument } from '../../features/documents/documentsSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import { sendRelatory } from '../../features/admin/adminSlice'

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
            }
        }>
            <CircularProgress sx={
                {
                    margin: '100px',
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
                        <Button onClick={handleRelatory} fullWidth color='success' variant='contained'>Enviar</Button>
                    </Box>
                }

            </Box>
        </Container>

    )
}

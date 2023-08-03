import { useState } from 'react';
import { Modal, Button, Box, Typography, TextField, TextareaAutosize, CircularProgress } from '@mui/material'
import axios from 'axios';
import { toast } from 'react-toastify'

export default function Email(props) {
    const { email } = props

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,

    }
    const [openSnack, setOpenSnack] = useState(false);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [emailData, setEmailData] = useState({
        email: email,
        title: '',
        message: ''
    })

    const { title, message } = emailData
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e) => {
        setEmailData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const sendEmail = async (e) => {
        e.preventDefault()

        if (title === '' || message === '') return toast.error('Preencha todos os campos', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })

        setIsLoading(true)

        try {
            const response = await axios.post('http://localhost:3001/api/email', {
                email,
                title,
                message
            })
            if (response.data) {

                toast.success('Email enviado com sucesso', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })

                setIsLoading(false)
            }

        } catch (error) {
            return alert('Erro ao enviar email')
        }


    }

    return (
        <Box>
            <Button color="success" variant="contained" onClick={handleOpen}>Contatar</Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Enviar email para {email}
                        </Typography>

                        <TextField sx={{ width: '100%' }} size='small' placeholder='Título' name='title' defaultValue={title} onChange={onChange} />

                        <TextareaAutosize
                            minRows={8}
                            placeholder='Mensagem'
                            style={{ width: "100%", resize: 'none', fontSize: '16px', padding: '10px' }}
                            maxRows={8}
                            defaultValue={message}
                            onChange={onChange}
                            name='message'
                        />

                        <Button color='error' variant='contained' onClick={handleClose}>Cancelar</Button>

                        <Button
                            disabled={isLoading}
                            onClick={sendEmail}
                            color="success"
                            variant='contained'>

                            {isLoading ? <CircularProgress color="success" size={24} /> : 'Enviar'}

                        </Button>


                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

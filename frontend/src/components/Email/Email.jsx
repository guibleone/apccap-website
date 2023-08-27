import { useEffect, useState } from 'react';
import { Modal, Button, Box, Typography, TextField, TextareaAutosize, CircularProgress , useMediaQuery} from '@mui/material'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { sendEmail, resetEmailStatus } from '../../features/admin/adminSlice';
import { AiOutlineMail } from 'react-icons/ai';

export default function Email({ email }) {
    
    const { emailStatus } = useSelector((state) => state.admin)
    const dispatch = useDispatch()

    const matches = useMediaQuery('(min-width:600px)');

    const style = matches ? {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
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

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [emailData, setEmailData] = useState({
        title: '',
        message: '',
    })

    const { title, message } = emailData

    const onChange = (e) => {
        setEmailData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const sendEmailData = (e) => {
        e.preventDefault()

        if ((title === '' || message === '')) return toast.error('Preencha todos os campos', styleError)

        dispatch(sendEmail({ email, title, message }))
    }

    useEffect(() => {

        if (emailStatus.isSuccess) {
            toast.success(emailStatus.message, styleSuccess)
            handleClose()
        }

        if (emailStatus.isError) {
            toast.error(emailStatus.message, styleError)
        }

        dispatch(resetEmailStatus())

    }, [emailStatus.isSuccess, emailStatus.isError])

    return (
        <Box>
            <Button variant="contained" color={'success'} onClick={handleOpen}>Contatar</Button>

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
                        gap: '10px',
                        textAlign: 'center',
                    }}> 
                        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'10px'}}>
                        <AiOutlineMail size={25}   />
                             
                        </Box>

                        <Typography variant={!matches ? 'h7' : 'h5'} >
                         {email}
                        </Typography>

                        <TextField sx={{ width: '100%' }}
                            size='small'
                            name='title'
                            placeholder='Título'
                            defaultValue={title}
                            onChange={onChange}
                        />

                        <TextareaAutosize
                            minRows={8}
                            placeholder='Mensagem'
                            style={{ width: "100%", resize: 'none', fontSize: '16px', padding: '10px', border:'1px solid black' }}
                            maxRows={8}
                            defaultValue={message}
                            onChange={onChange}
                            name='message'
                        />

                        <Button color='error' variant='contained' onClick={handleClose}>Cancelar</Button>

                        <Button
                            disabled={emailStatus.isLoading}
                            onClick={sendEmailData}
                            color="success"
                            variant='contained'>

                            {emailStatus.isLoading ? <CircularProgress color="success" size={24} /> : 'Enviar'}
                            
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

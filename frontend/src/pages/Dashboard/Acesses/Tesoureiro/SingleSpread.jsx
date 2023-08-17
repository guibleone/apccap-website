import { Box, Button, Container, TextField, Typography, CircularProgress, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getOneSpread, deleteSpreadSheet } from '../../../../features/spreadSheet/spreadSheetSlice'
import { AiOutlineDelete, AiFillWarning } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import {RiArrowGoBackFill} from 'react-icons/ri'

export default function SingleSpread() {
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

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }

    const { id } = useParams()
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { singleSpread, isLoading } = useSelector(state => state.spreadSheet)
    const { user } = useSelector(state => state.auth)

    const [isDisabled, setIsDisabled] = useState(true)

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const data = {
            token: user.token,
            id
        }

        dispatch(getOneSpread(data))

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
            <Box sx={{display:'flex', flexDirection:'column', gap:'20px'}}>
                <Box sx={{display:'flex', gap:'5px'}}>

                <Typography variant='h4'>{singleSpread && singleSpread.title_spread}</Typography>
                <Button variant='outlined' href='/'><RiArrowGoBackFill size={20} /></Button>
                <Button onClick={handleOpen} color='error' variant='outlined'><AiOutlineDelete size={20} /></Button>

                <Modal open={open}onClose={handleClose}>
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

                            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>

                                <Button color='error' variant='contained' onClick={handleClose}>Cancelar</Button>

                                <Button
                                    color="success"
                                    variant='contained'
                                    onClick={() => {
                                        dispatch(deleteSpreadSheet({ token: user.token, id: singleSpread._id }))
                                        toast.success('Planilha excluída com sucesso!', styleSuccess)
                                        handleClose()
                                        navigate('/')
                                    }}
                                >
                                    Excluir
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            </Box>

              <Typography variant='h7'>Confira os dados dessa planilha.</Typography>

            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {singleSpread && singleSpread.itens.map((iten) => (
                    <Box sx={{ display: 'flex', gap: '5px' }}>
                        <TextField label='Título' name='title' disabled={isDisabled} value={iten.title} />
                        <TextField fullWidth label='Descrição' name='description' disabled={isDisabled} value={iten.cost_description} />
                        <TextField label='Valor' name='value' disabled={isDisabled} value={iten.cost} />

                    </Box>
                ))}
                <Button variant='contained' onClick={() => setIsDisabled(!isDisabled)}>{!isDisabled ? 'Salvar' : 'Editar'}</Button>
            </Box>

            <Box>

            </Box>

        </Container>
    )
}

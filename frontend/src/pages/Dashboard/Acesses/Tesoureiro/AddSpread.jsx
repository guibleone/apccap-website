import { Container, Typography, Box, TextField, Button, Modal } from '@mui/material'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { addSpreadSheet } from '../../../../features/spreadSheet/spreadSheetSlice'
import { styleError } from '../../../toastStyles'

export default function AddSpread() {

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

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const dispatch = useDispatch()

    const [data, setData] = useState({
        title: '',
        cost_description: '',
        cost: '',
    })

    const [spreadsheet, setSpreadsheet] = useState({
        title_spread: '',
        itens: []
    })

    const [costs, setCosts] = useState([])

    const { title, cost_description, cost } = data

    const { user } = useSelector((state) => state.auth)


    const onChange = (e) => {
        setData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onChangeSpread = (e) => {
        setSpreadsheet((prevState) => ({
            ...prevState,
            title_spread: e.target.value,
            itens: costs
        }))
    }

    const submitCost = (e) => {

        if (!title || !cost_description || !cost) return toast.error('Preencha todos os campos',styleError)

        e.preventDefault()

        setCosts((prevState) => [...prevState, data])

        setData({
            title: '',
            cost_description: '',
            cost: '',
        })
    }

    const submitSpreadsheet = (e) => {
        e.preventDefault()

        if (!spreadsheet.title_spread) return toast.error('Preencha o título da planilha',styleError)
        if (costs.length === 0) return toast.error('Adicione pelo menos um item',styleError)

        const data = {
            token: user.token,
            id: user.id,
            spreadsheet
        }

        dispatch(addSpreadSheet(data))

        setCosts([])
        setOpen(false)
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <Typography variant='h4'>Adicionar Custos </Typography>
                <Typography variant='h7'>Adicione os custos da Associação a uma planilha.</Typography>

                <Box sx={{ display: 'flex', gap: '10px' }}>
                    <TextField onChange={onChange} value={title} name='title' placeholder='Título' />
                    <TextField onChange={onChange} value={cost_description} name='cost_description' fullWidth placeholder='Descrição' />
                    <TextField type='number' onChange={onChange} value={cost} name='cost' placeholder='Valor' />
                </Box>

                <Button onClick={submitCost} fullWidth variant='contained' color='info' >Adicionar</Button>

            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '10px 0' }}>
                {costs && costs.map((cost, index) => (
                    <>
                        <Box key={index} sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            gap: '10px',
                            backgroundColor: '#f5f5f5',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',

                        }}>
                            <Typography>{cost.title}</Typography>
                            <Typography width={500}>{cost.cost_description}</Typography>
                            <Typography>{cost.cost}</Typography>

                            <Button onClick={() => setCosts((prevState) => prevState.filter((cost, i) => i !== index))} variant='contained' color='error'>Excluir</Button>

                        </Box>
                    </>
                ))}

                {costs.length > 0 && (
                    <>

                        <Button onClick={handleOpen} color='success' variant='contained'>finalizar</Button>
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

                                    </Box>

                                    <Typography variant="h7" > Adicione um título para a planilha.</Typography>
                                    <TextField size={'small'} onChange={onChangeSpread} name='title_spread' placeholder='Título' />

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                                        <Button color='error' variant='contained' onClick={handleClose}>Cancelar</Button>
                                        <Button onClick={submitSpreadsheet} variant='contained' color='success'>Finalizar</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Modal>
                    </>

                )}
            </Box>
        </>
    )
}

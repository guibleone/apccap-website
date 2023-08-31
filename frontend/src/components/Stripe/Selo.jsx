import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Box, Button, TextField, Typography, Alert, useMediaQuery, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { addSelo } from '../../features/products/productsSlice'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../../pages/toastStyles'

export default function Selo() {

    const [quantity, setQuantity] = useState('')
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
    const { isSuccessSelos, message, pending } = useSelector((state) => state.products)

    const fileInputRef = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const userData = {
            id: user._id,
            token: user.token,
            quantity,
            pathRelatory: fileInputRef.current.files[0]
        }

        dispatch(addSelo(userData))
    }

    useEffect(() => {

        if (isSuccessSelos) {
            toast.success(message, styleSuccess)
        }

    }, [isSuccessSelos])


    const matches = useMediaQuery('(max-width:600px)')

    const styleBox = matches ? {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',


    } : {
        display: 'flex',
        gap: '10px',
        flexDirection: 'column',
        alignItems: 'center',

    }

    return (
        <Box sx={styleBox} >

            <Typography textAlign={'center'} variant={matches ? 'h5' : 'h4'}>Peça seus Selos</Typography>

            <Box sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
            }} >

                <img
                    src={require('../../imgs/selo.png')}
                    alt="Selos"
                    width={200}
                    style={{ justifySelf: 'center', alignSelf: 'center' }}
                />

                <Typography sx={{ textAlign: 'center' }} variant='h5'>Selo</Typography>

                <TextField size='small' name='quantity' type='number' onChange={(e) => setQuantity(e.target.value)} placeholder='Informe a quantidade' value={quantity}></TextField>

                <form onSubmit={handleSubmit}>
                    <Box sx={styleBox} >
                        <Typography>Envie o relatório de produção</Typography>
                        <input type="file" ref={fileInputRef} />
                        <Button disabled={pending} fullWidth variant='contained' color='success' type="submit">
                            {pending ? <CircularProgress color="success" size={24} /> : 'Pedir'}
                        </Button>
                    </Box>
                </form>

            </Box>

        </Box >
    )
}

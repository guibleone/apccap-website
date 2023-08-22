import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Button, TextField, Typography, Alert, useMediaQuery, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { addSelo } from '../../features/products/productsSlice'
import { toast } from 'react-toastify'

export default function Selo() {

    // alterar para o endereço da API quando usando o firebase
    const API_URL = 'https://apccap-api.onrender.com/api/payment/comprar-selos'

    const [quantity, setQuantity] = useState('')
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
    const { isSuccessSelos, isLoading, isSuccess } = useSelector((state) => state.products)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!quantity) {
            console.log('Informe uma quantidade válida')
        }

        try {
            const response = await axios.post('/api/payment/comprar-selos', {
                quantity
            })
            if (response.data) {
                localStorage.setItem('quantity', quantity)
                window.location.href = response.data.url;
            }

        } catch (error) {
            console.log('Erro no pagamento: ', error)
        }
    }

    const [messagePayment, setMessagePayment] = useState("");

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const localQuantity = localStorage.getItem('quantity')

        if (query.get("success") && localQuantity > 0) {

            const userData = {
                id: user._id,
                token: user.token,
                quantity: localQuantity
            }

            dispatch(addSelo(userData))

        }

        if (query.get("canceled")) {
            setMessagePayment("Pedido cancelado - compre novamente quando estiver pronto.")
        }

        localStorage.removeItem('quantity')

    }, []);



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


    useEffect(() => {
        if (isSuccessSelos && !isSuccess) {
            toast.success('Selos comprados com sucesso!', styleSuccess)
        }

        if (messagePayment) {
            toast.error(messagePayment, styleError)
        }

    }, [isSuccessSelos, messagePayment])


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

            <Typography textAlign={'center'} variant={matches ? 'h5' : 'h4'}>Comprar Selos</Typography>

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
                <Typography sx={{ textAlign: 'center' }}>R$1,69 por unidade</Typography>
                <TextField size='small' name='quantity' type='number' onChange={(e) => setQuantity(e.target.value)} placeholder='Informe a quantidade' value={quantity}></TextField>

                <form onSubmit={handleSubmit}>
                    <Button disabled={isLoading} fullWidth variant='contained' color='success' type="submit">
                        {isLoading ? <CircularProgress color="success" size={24} /> : 'Comprar'}
                    </Button>
                </form>

            </Box>

            {(messagePayment) && <Alert sx={{ margin: '10px 0' }} color='error'>{messagePayment}</Alert>}
            {(isSuccessSelos) && <Alert sx={{ margin: '10px 0' }} color='success'>Selos comprados com sucesso!</Alert>}

        </Box >
    )
}

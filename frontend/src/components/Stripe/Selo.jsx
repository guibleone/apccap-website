import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Button, TextField, Typography, Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { addSelo } from '../../features/products/productsSlice'

export default function Selo() {
    const [quantity, setQuantity] = useState('')
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
    const {isSuccessSelos} = useSelector((state)=> state.products)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!quantity) {
            console.log('Informe uma quantidade válida')
        }

        try {
            const response = await axios.post('http://localhost:3001/api/payment/comprar-selos', {
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


    return (
        <section>
            <Typography variant="h4">Comprar Selos</Typography>
            <Box sx={{ display: 'flex', margin: '10px 0' }}>
                <img
                    src="https://www.pngplay.com/wp-content/uploads/7/Original-Stamp-Transparent-PNG.png"
                    alt="The cover of Stubborn Attachments"
                    width={200}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div>
                        <Typography variant='h5'>Selo</Typography>
                        <Typography>R$1,69 por unidade</Typography>
                        <TextField size='small' name='quantity' type='number' onChange={(e) => setQuantity(e.target.value)} placeholder='Informe a quantidade' value={quantity}></TextField>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <Button variant='contained' color='success' type="submit">Comprar</Button>
                    </form>
                </Box>
            </Box>

            {(messagePayment) && <Alert sx={{ margin: '10px 0' }} color='error'>{messagePayment}</Alert>}
            {(isSuccessSelos) && <Alert sx={{ margin: '10px 0' }} color='success'>Selos comprados com sucesso!</Alert>}

        </section>
    )
}

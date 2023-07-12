import { Alert, Box, Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addSelo, clear } from '../../features/products/productsSlice'

function Selos() {

  const dispatch = useDispatch()

  const [quantity, setQuantity] = useState('')

  const {user} = useSelector(state => state.auth)
  const {isSuccessSelos, isError} = useSelector(state => state.products)

  const onChange = (e)=>{    
    setQuantity(e.target.value)
  }

  const onAddSelo = (e)=>{
    e.preventDefault()

    const userData = {
      id: user._id,
      token: user.token,
      quantity
    }

    dispatch(addSelo(userData))
  }

  return (
    <Box sx={{display:'flex', flexDirection:'column', gap:'10px'}}>
        <Typography variant="h4">Comprar Selos</Typography>
        <TextField onChange={onChange} type='number' name='quantity'></TextField>
        <Button onClick={onAddSelo} color='success' variant='contained'>Comprar</Button> 
        {isSuccessSelos && <Alert severity='success'>Selos comprados com sucesso!</Alert>} 
    </Box>
  )
}

export default Selos
import { Box, Button, Container, TextField, Typography, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getOneSpread, editSpreadSheet, resetSpreadSheet } from '../../../../features/spreadSheet/spreadSheetSlice'
import { toast } from 'react-toastify'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { styleError, styleSuccess } from '../../../toastStyles'

export default function SingleSpread() {

    const { id } = useParams()
    const dispatch = useDispatch()

    const { singleSpread, isLoading, isSuccess, isError, message } = useSelector(state => state.spreadSheet)
    const { user } = useSelector(state => state.auth)

    const [spreadsheet, setSpreadsheet] = useState({
        itens: singleSpread ? singleSpread.itens.map(item => ({ ...item })) : []
      });
    
    const [isDisabled, setIsDisabled] = useState(true)

    const onChange = (e, index) => {

        const { name, value } = e.target;

        const updatedItem = { ...spreadsheet.itens[index], [name]: value };
    
        const updatedItens = [...spreadsheet.itens];
        updatedItens[index] = updatedItem;
    
        setSpreadsheet({ ...spreadsheet, itens: updatedItens });

    }

    const onSubmit = (e) => {
        e.preventDefault();
    
        const updatedItens = singleSpread.itens.map((item, index) => ({
            ...item,
            ...spreadsheet.itens[index],
        }));

        const updatedSpread = {
            ...singleSpread, 
            itens: updatedItens, 
        };
    
        const data ={
            token: user.token,
            id,
            spreadsheet: updatedSpread
        }

        dispatch(editSpreadSheet(data))
        setIsDisabled(true)
    
    };

    useEffect(() => {
        if (isError) {
            toast.error(message, styleError)
        }
        if (isSuccess) {
            toast.success(message, styleSuccess)
        }

        dispatch(resetSpreadSheet())

    },[ isError, isSuccess, message])
         

    useEffect(() => {

        const data = {
            token: user.token,
            id
        }

        dispatch(getOneSpread(data))

    }, [ dispatch, id, user.token])

    useEffect(() => {
        window.scrollTo(0, 0)
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box sx={{ display: 'flex', gap: '5px' }}>

                    <Button variant='outlined' component={Link} to={'/planilhas'}><RiArrowGoBackFill size={20} /></Button>
                    <Typography variant='h4'>{singleSpread && singleSpread.title_spread}</Typography>

                </Box>

                <Typography variant='h7'>Confira os dados dessa planilha.</Typography>

            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {singleSpread && singleSpread.itens.map((iten, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: '5px' }}>
                        <TextField onChange={e => onChange(e, index)} name='title' disabled={isDisabled} defaultValue={iten.title} />
                        <TextField onChange={e => onChange(e, index)} fullWidth name='cost_description' disabled={isDisabled} defaultValue={iten.cost_description} />
                        <TextField onChange={e => onChange(e, index)} name='cost' disabled={isDisabled} defaultValue={iten.cost} />

                    </Box>
                ))}

                {isDisabled ? (<>
                    <Button onClick={() => setIsDisabled(false)} variant='outlined' color='info'>Editar</Button>

                </>) : (
                    <Button onClick={onSubmit} variant='outlined' color='info'>Salvar</Button>
                )}

            </Box>

            <Box>

            </Box>

        </Container>
    )
}

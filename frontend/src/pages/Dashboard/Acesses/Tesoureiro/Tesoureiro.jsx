import { Container, Typography, Box, Divider, Button, } from '@mui/material'
import AddSpread from './AddSpread'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetSpreadSheet, getSpreadSheets } from '../../../../features/spreadSheet/spreadSheetSlice'
import ConcludedSpread from './ConcludedSpread'
import AddExcelSpread from './AddExcelSpread'
import { useNavigate } from 'react-router-dom'

export default function Tesoureiro() {
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {

    dispatch(getSpreadSheets(user))

    dispatch(resetSpreadSheet())

  }, [])

  return (
    <Box>

      <Box sx={{display:'flex',flexDirection:'column', gap:'10px'}}>
        <Typography variant="h5" >Bem vindo de volta, Tesoureiro(a)</Typography>
        <Typography variant='subtitle' >Você pode gerenciar os gastos da Associação </Typography>
      </Box>

      <Divider sx={{ margin: '20px 0' }} />

      <AddSpread />

      <Divider sx={{ margin: '20px 0' }} />

      <ConcludedSpread />

      <Divider sx={{ margin: '20px 0' }} />

      <AddExcelSpread />

      <Divider sx={{ margin: '20px 0' }} />

      <Button sx={{margin:'20px 0'}}fullWidth onClick={()=>navigate('/balancete')} variant='outlined' color='success'>Faturamento</Button>

    </Box>
  )
}

import { Container, Typography, Box, Divider, } from '@mui/material'
import AddSpread from './AddSpread'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetSpreadSheet, getSpreadSheets } from '../../../../features/spreadSheet/spreadSheetSlice'
import ConcludedSpread from './ConcludedSpread'
import AddExcelSpread from './AddExcelSpread'

export default function Tesoureiro() {

  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {

    dispatch(getSpreadSheets(user))

    dispatch(resetSpreadSheet())

  }, [])

  return (
    <Container>

      <Box>
        <Typography variant="h4" >Bem vindo de volta, Tesoureiro(a)</Typography>
        <Typography variant='h7'>Você pode gerenciar os gastos da Associação. </Typography>
      </Box>

      <Divider sx={{ margin: '20px 0' }} />

      <AddSpread />

      <Divider sx={{ margin: '20px 0' }} />

      <ConcludedSpread />

      <Divider sx={{ margin: '20px 0' }} />

      <AddExcelSpread />

    </Container>
  )
}

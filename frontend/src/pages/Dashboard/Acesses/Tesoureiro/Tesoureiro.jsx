import { Container, Typography, Box, TextField, Button, Divider, Modal } from '@mui/material'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import AddSpread from './AddSpread'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSpreadSheet, getSpreadSheets } from '../../../../features/spreadSheet/spreadSheetSlice'
import CsvDownloadButton from 'react-json-to-csv'
import { AiOutlineDelete, AiOutlineDownload, AiOutlineEdit, AiFillWarning } from 'react-icons/ai'
import ConcludedSpread from './ConcludedSpread'
import AddExcelSpread from './AddExcelSpread'

export default function Tesoureiro() {

  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {

    dispatch(getSpreadSheets(user))

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

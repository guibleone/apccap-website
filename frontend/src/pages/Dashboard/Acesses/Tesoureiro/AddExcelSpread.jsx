import { Box, Button, Typography, CircularProgress, Input } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addExcel, deleteExcel, resetExcel } from '../../../../features/spreadSheet/spreadSheetSlice'
import { toast } from 'react-toastify'
import { AiOutlineDownload } from 'react-icons/ai'
import { BiTrashAlt } from 'react-icons/bi'
import { styleError, styleSuccess } from '../../../toastStyles'
import { Link } from 'react-router-dom'

export default function AddExcelSpread() {
    const { user } = useSelector((state) => state.auth)
    const { spreadSheets, isLoading, excel } = useSelector((state) => state.spreadSheet)
    const dispatch = useDispatch()

    const fileInputRef = useRef()


    // informação da planilha
    const [excelData, setExcelData] = useState({
        pathExcel: '',
        user: user._id,
        token: user.token
    })


    // função para pegar a planilha
    const onChange = () => {
        const selectedFile = fileInputRef.current?.files[0];
        if (selectedFile) {
            setExcelData({ ...excelData, pathExcel: selectedFile })
        }
    }

    // função para enviar a planilha
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(addExcel(excelData))
    }

    // deletar planilha
    const handleDelete = (id) => {

        const data = {
            id,
            token: user.token
        }

        dispatch(deleteExcel(data))
    }

    useEffect(() => {
        if (excel.isError) {
            toast.error(excel.message, styleError)
        }
        if (excel.isSuccess) {
            toast.success(excel.message, styleSuccess)
        }

        dispatch(resetExcel())

    }, [excel.isError, excel.isSuccess, excel.message])

    if (excel.isLoading) {
        return <Box sx={
            {
                display: 'flex',
                justifyContent: 'center',
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Typography variant='h5'>Upload de Planilhas</Typography>
            <Typography variant='p'>Faça o envio de suas planilhas Excel</Typography>

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <input onChange={onChange} type="file" ref={fileInputRef} />
                    <Button disabled={excel.isLoading ? true : false}
                        sx={{ margin: '10px 0' }} type="submit" variant="contained" color="primary">
                        Adicionar
                    </Button>
                </Box>
            </form >


            <Box>
                {spreadSheets && spreadSheets.filter((spreadSheet) => spreadSheet.pathExcel).slice(0, 3).map((spreadSheet) => (
                    <Box key={spreadSheet._id}>
                        {spreadSheet.pathExcel && (
                            <Box>
                                <Typography variant='h6'>{spreadSheet.title_spread}</Typography>
                                <Box sx={{ display: 'flex', gap: '5px' }}>
                                    <Button onClick={() => window.open(spreadSheet.pathExcel)} color='success' variant='outlined'><AiOutlineDownload size={20} /></Button>
                                    <Button onClick={() => handleDelete(spreadSheet._id)} color='error' variant='outlined'><BiTrashAlt size={20} /></Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                ))}

            </Box>

            {(spreadSheets && spreadSheets.length > 3) && (
                    <Link style={{ textDecoration: 'none', color: '#000', margin:'10px 0' }} to='/planilhas'> Ver Tudo</Link>
             )}

        </Box >
    )
}

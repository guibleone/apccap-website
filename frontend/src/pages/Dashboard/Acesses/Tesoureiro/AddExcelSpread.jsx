import { Box, Button, Typography, CircularProgress } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addExcel, resetExcel } from '../../../../features/spreadSheet/spreadSheetSlice'
import { toast } from 'react-toastify'

export default function AddExcelSpread() {
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


    useEffect(() => {
        if (excel.isError) {
            toast.error(excel.message, styleError)
        }
        if (excel.isSuccess) {
            toast.success(excel.message, styleSuccess)
        }

        dispatch(resetExcel())

    }, [excel.isError, excel.isSuccess, excel.message])

    return (
        <Box>
            <Typography variant='h4'>Planilhas Excel</Typography>

            <Box>
                <form onSubmit={handleSubmit}>
                    <input onChange={onChange} type="file" ref={fileInputRef} />
                    <Button disabled={excel.isLoading ? true : false}
                        sx={{ margin: '10px 0' }} type="submit" variant="contained" color="primary">
                        {excel.isLoading ? <CircularProgress color="success" size={24} /> : 'Adcionar'}
                    </Button>
                </form>
            </Box>

            <Box>
                {spreadSheets && spreadSheets.map((spreadSheet) => (
                    <Box key={spreadSheet._id}>
                        {spreadSheet.pathExcel && (
                            <>
                                <Typography variant='h6'>{spreadSheet.title_spread}</Typography>
                                <Button onClick={() => window.open(spreadSheet.pathExcel)} variant='outlined'>Baixar</Button>
                            </>
                        )}
                    </Box>
                ))}
            </Box>
        </Box >
    )
}

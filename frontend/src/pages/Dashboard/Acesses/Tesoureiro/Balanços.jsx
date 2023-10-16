import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineFile, AiOutlineDownload, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { BsPlusCircle, BsDownload } from 'react-icons/bs'
import { Grid, Box, CircularProgress, useMediaQuery, Container } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { addExcel, deleteExcel, resetExcel, resetSpreadSheet } from '../../../../features/spreadSheet/spreadSheetSlice'
import { colors } from '../../../colors'
import { toast } from 'react-toastify'
import { styleSuccess } from '../../../toastStyles'
import BalancosPagination from '../../../../components/Pagination/Balancos'


export default function Balancos() {
    const matches = useMediaQuery('(max-width:600px)');

    const { user } = useSelector((state) => state.auth)
    const { excel } = useSelector((state) => state.spreadSheet)
    const dispatch = useDispatch()

    const { isLoading } = excel

    const [spreadSheets, setSpreadSheets] = useState(null)

    // ref do input file
    const fileInputRef = useRef(null);

    // função para abrir o input file
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const [selectedFile, setSelectedFile] = useState(null); // armazena o arquivo selecionado

    // função para pegar o arquivo selecionado
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    // função para enviar a planilha
    const handleSubmit = (e) => {
        e.preventDefault()
        const excelData = {
            pathExcel: fileInputRef.current?.files[0],
            user: user._id,
            token: user.token
        }

        dispatch(addExcel(excelData))
    }

    useEffect(() => {

        if (excel.isSuccess) {
            toast.success(excel.message, styleSuccess)
        }
        if (excel.isError) {
            toast.error(excel.message, styleSuccess)
        }

        dispatch(resetExcel())

    }
        , [excel])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {


        dispatch(resetSpreadSheet())

    }, [])


    return (
        <Box sx={{
            backgroundColor: colors.main_white,
            minHeight: '100vh',
        }}>
            <Container maxWidth='xl'>
                <Grid container rowSpacing={2} pt={'72px'}>
                    <Grid item xs={12} md={12}>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '36px'
                        }}>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: matches ? 'column' : 'row',
                                alignItems: 'center',

                            }}>
                                <h3 className='black semi-bold'>
                                    Todos Balanços Financeiros
                                </h3>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: matches ? 'column' : 'row',
                                    gap: '10px'
                                }}>
                                    <input
                                        style={{ display: 'none' }}
                                        accept='.pdf, .csv'
                                        type='file'
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <button onClick={handleButtonClick} className='button-white-bottom-border' style={{ width: '220px' }}>
                                        {selectedFile ? <>{selectedFile.name.slice(0, 10)} ... <AiOutlineEdit size={25} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /> </> : <>Novo Balanço <BsPlusCircle size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /></>}
                                    </button>
                                    <button onClick={handleSubmit} className='button-purple' style={{ marginLeft: '10px', backgroundColor: isLoading && colors.main_white }}>
                                        {isLoading ? <CircularProgress color="success" style={{ padding: '5px' }} /> : <> <BsDownload size={20} style={{ verticalAlign: 'bottom', marginRight: '5px' }} /> Adicionar</>}
                                    </button>
                                </Box>

                            </Box>
                        </Box>
                    </Grid>

                    <Grid item >
                        {(spreadSheets && spreadSheets.length === 0) && (
                            <h3 className='regular black'>
                                Nenhum balanço financeiro adicionado.
                            </h3>
                        )}
                    </Grid>

                    <Grid container pt={'36px'} columnSpacing={'30px'} rowSpacing={'15px'}>

                        {spreadSheets && spreadSheets.map((spreadSheet) => (
                            <Grid item xs={12} md={2} key={spreadSheet._id} >

                                <button className='button-documentos' >
                                    <Box className={'button-text'} >
                                        <AiOutlineFile size={18} style={{ verticalAlign: 'center', marginRight: '12px' }} />
                                        <h4 className='black regular'>
                                            {spreadSheet.title_spread.length > 10 ? spreadSheet.title_spread.slice(0, 10) + '...' : spreadSheet.title_spread}
                                        </h4>

                                    </Box>
                                    <Box className='documento-actions' >
                                        <AiOutlineDownload onClick={() => window.location.href = `${spreadSheet.pathExcel}`} style={{ color: '#057305' }} size={22} />
                                        <AiOutlineDelete onClick={() => {
                                            const data = {
                                                id: spreadSheet._id,
                                                token: user.token
                                            }
                                            dispatch(deleteExcel(data))
                                        }} style={{ color: '#BF232C' }} size={22} />
                                    </Box>
                                </button>

                            </Grid>

                        ))}

                    </Grid>

                    <BalancosPagination setSpreadSheetsData={(u) => setSpreadSheets(u)} search={''} />

                </Grid>
            </Container >
        </Box>

    )
}

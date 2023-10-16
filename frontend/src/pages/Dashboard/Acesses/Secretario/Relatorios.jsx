import React, { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Container, Grid, useMediaQuery } from '@mui/material'
import { colors } from '../../../../pages/colors'
import { AiOutlineDelete, AiOutlineDownload, AiOutlineEdit, AiOutlineFile } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { addRelatory, deleteRelatory, reset } from '../../../../features/relatorys/relatorysSlice';
import { toast } from 'react-toastify';
import { styleSuccess } from '../../../toastStyles';
import { BsDownload, BsPlusCircle } from 'react-icons/bs';
import RelatorysPagination from '../../../../components/Pagination/Relatorys';

export default function Relatorios() {
    const matches = useMediaQuery('(max-width:600px)');

    const { user } = useSelector((state) => state.auth)
    const { isSuccess, isError, message, isLoading } = useSelector((state) => state.relatorys)

    const dispatch = useDispatch()

    const [relatorys, setRelatorys] = useState(null)

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

        const data = {
            path: fileInputRef.current?.files[0],
            token: user.token
        }

        dispatch(addRelatory(data))
    }

    useEffect(() => {

        if (isSuccess) {
            toast.success(message, styleSuccess)
        }
        if (isError) {
            toast.error(message, styleSuccess)
        }

        dispatch(reset())

    }
        , [isSuccess])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {

        dispatch(reset())

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
                                    Todos relatórios de transparência
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
                                        {selectedFile ? <>{selectedFile.name.slice(0, 10)} ... <AiOutlineEdit size={25} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /> </> : <>Novo Relatório <BsPlusCircle size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /></>}
                                    </button>
                                    <button onClick={handleSubmit} className='button-purple' style={{ marginLeft: '10px', backgroundColor: isLoading && colors.main_white }}>
                                        {isLoading ? <CircularProgress color="success" style={{ padding: '5px' }} /> : <> <BsDownload size={20} style={{ verticalAlign: 'bottom', marginRight: '5px' }} /> Adicionar</>}
                                    </button>
                                </Box>

                            </Box>
                        </Box>
                    </Grid>


                    <Grid item >
                        {(relatorys && relatorys.length === 0) && (
                            <h3 className='regular black'>
                                Nenhum relatório adicionado.
                            </h3>
                        )}
                    </Grid>

                    <Grid container pt={'36px'} columnSpacing={'30px'} rowSpacing={'15px'}>

                        {relatorys && relatorys.map((relatory) => (
                            <Grid item xs={12} md={2} key={relatory._id} >

                                <button className='button-documentos' >
                                    <Box className={'button-text'} >
                                        <AiOutlineFile size={18} style={{ verticalAlign: 'center', marginRight: '12px' }} />
                                        <h4 className='black regular'>
                                            {relatory.title.length > 10 ? relatory.title.slice(0, 10) + '...' : relatory.title}
                                        </h4>

                                    </Box>
                                    <Box className='documento-actions' >
                                        <AiOutlineDownload onClick={() => window.location.href = `${relatory.path}`} style={{ color: '#057305' }} size={22} />
                                        <AiOutlineDelete onClick={() => {
                                            const data = {
                                                id: relatory._id,
                                                token: user.token
                                            }
                                            dispatch(deleteRelatory(data))
                                        }} style={{ color: '#BF232C' }} size={22} />
                                    </Box>
                                </button>

                            </Grid>

                        ))}

                    </Grid>

                    <RelatorysPagination setRelatorysData={(relatory) => setRelatorys(relatory)} search={''} />

                </Grid>
            </Container>
        </Box>
    )
}

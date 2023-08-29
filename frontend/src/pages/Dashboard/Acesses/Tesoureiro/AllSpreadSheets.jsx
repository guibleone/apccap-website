import { Box, Container, Typography, Button, Grid, Divider, useMediaQuery } from '@mui/material'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { AiOutlineDownload, AiOutlineEdit } from 'react-icons/ai'
import { BiTrashAlt } from 'react-icons/bi'
import CsvDownloadButton from 'react-json-to-csv'
import { deleteSpreadSheet, getSpreadSheets, resetSpreadSheet } from '../../../../features/spreadSheet/spreadSheetSlice'


export default function AllSpreadSheets() {

    const { spreadSheets } = useSelector((state) => state.spreadSheet)
    const { user } = useSelector((state) => state.auth)

    const matches = useMediaQuery('(max-width:800px)')

    const dispatch = useDispatch()

    const handleDelete = (id) => {
        const data = {
            token: user.token,
            id
        }

        dispatch(deleteSpreadSheet(data))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {

        dispatch(getSpreadSheets(user))

        dispatch(resetSpreadSheet())

    }, [])



    return (
        <Container sx={{ minHeight: '100vh' }}>
            <Grid container spacing={2} rowSpacing={2} sx={{display:'flex', flexDirection:matches ? 'column' : 'row',}}>
                <Grid item md={5} sm={12} >

                    <Typography variant='h5' >Planilhas Normais</Typography>

                    {spreadSheets && spreadSheets.map((spreadSheet) => (
                        <Box key={spreadSheet._id}>
                            {!spreadSheet.pathExcel && (
                                <>
                                    <Typography variant='h6'>{spreadSheet.title_spread}</Typography>
                                    <Box sx={{ display: 'flex', gap: '5px' }}>
                                        <CsvDownloadButton
                                            style={{ all: 'unset' }}
                                            data={spreadSheet.itens}
                                            filename={spreadSheet.title_spread}
                                            headers={["Título", "Descrição", "Valor"]}
                                        ><Button variant='outlined' color='success'><AiOutlineDownload size={20} /></Button></CsvDownloadButton>
                                        <Button
                                            variant='outlined'
                                            color='info'                                            
                                            component={Link}
                                            to={`/planilha/${spreadSheet._id}`}
                                        >
                                            <AiOutlineEdit size={20} />
                                        </Button>
                                        <Button
                                            variant='outlined'
                                            color='error'                              
                                            onClick={() => handleDelete(spreadSheet._id)}
                                        >
                                            <BiTrashAlt size={20} />
                                        </Button>
                                    </Box>

                                </>)}
                        </Box>
                    ))}
                </Grid>

                <Divider sx={{margin:'20px '}} orientation={matches ? 'horizontal' : 'vertical'} flexItem={!matches}  />

                <Grid item md={5} sm={12} >

                    <Typography variant='h5' >Planilhas Excel</Typography>

                    {spreadSheets && spreadSheets.map((spreadSheet) => (
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

                </Grid>

                <Grid item md={12} sm={12} >
                    <Button fullWidth variant='outlined' color='info' component={Link} to='/'>Voltar</Button>
                </Grid>

            </Grid>



        </Container>
    )
}

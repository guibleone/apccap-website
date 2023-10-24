import { Box, Grid, Typography, MenuItem, TextField,  useMediaQuery, Container } from '@mui/material'
import React from 'react'
import {Link} from 'react-router-dom'
import ReunionPagination from '../Pagination/Reunions'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../../pages/toastStyles'
import {AiOutlineEdit } from 'react-icons/ai'
import { reset } from '../../features/reunion/reunionSlice'
import { useNavigate } from 'react-router-dom'
import { colors } from '../../pages/colors'


export default function Reunion() {
    const navigate = useNavigate()

    const { isSuccess, isError, message } = useSelector((state) => state.reunions)
    const { user } = useSelector((state) => state.auth)

    const matches = useMediaQuery('(min-width:600px)');

    const [reunions, setReunions] = useState([])
    const [selectStatus, setSelectStatus] = useState('')
    const [selectedType, setSelectType] = useState('')
    const [selectedDate, setSelectedDate] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {

        if (isError) {
            toast.error(message, styleError)
        }

        if (isSuccess) {
            toast.success(message, styleSuccess)
        }

        dispatch(reset())


    }, [isError, isSuccess])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    return (
        <Box sx={{ backgroundColor: colors.main_white, minHeight: '100vh' }}>
            <Container maxWidth='xl' sx={{
                paddingBottom:'72px'
            }}>
                <Grid container spacing={2} >
                    <Grid item xs={12} lg={12} >
                        <Box sx={{ textAlign: 'center',  padding: '72px 0', }}>
                            <h1 className='bold black'>
                                Reuniões
                            </h1>
                            <h5 className='regular black'>
                                Gerencie, organize e confira as reuniões da APCCAP
                            </h5>
                        </Box>

                    </Grid>

                    {reunions && reunions.length > 0 ?
                        reunions
                            .map((reunion, index) => (
                                <Grid item xs={12} md={3} pr={matches ? 2 : 0} key={reunion._id}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: colors.main_grey, padding: '20px' }}>
                                        <Box sx={{
                                            backgroundColor: colors.main_grey,
                                            padding: '6px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '24px'
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}>
                                                <h4 className='semi-bold black'>
                                                    {reunion.date}
                                                </h4>
                                                <AiOutlineEdit size={25} />

                                            </Box>

                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '5px'
                                            }}>
                                                <h4 className='semi-bold black'>{reunion.title}</h4>
                                                <Link style={{cursor:'pointer'}} className='regular black italic' to={`/reuniao/${reunion._id}`}>
                                                    <h5>Ver Reunião</h5>
                                                </Link>
                                            </Box>
                                        </Box>                               
                                    </Box>
                                </Grid>

                            ))
                        :
                        <Grid item sm={12} lg={3}>
                            <Typography variant='h7'>Nenhuma reunião marcada</Typography>
                        </Grid>
                    }


                    <Grid container spacing={2} sx={{ margin: '20px 0' }} >

                        <Grid item xs={12} lg={4}>
                            <TextField
                                value={selectStatus}
                                onChange={(e) => setSelectStatus(e.target.value)}
                                select
                                label="Status"
                                fullWidth
                            >
                                <MenuItem key={0} value=''>Todas</MenuItem>
                                <MenuItem key={1} value='requer_ata'>Requer Ata</MenuItem>
                                <MenuItem key={2} value='nao_assinada'>Requer Assinatura</MenuItem>
                                <MenuItem key={3} value='assinada'>Assinada</MenuItem>
                                <MenuItem key={4} value='agendada'>Agendada</MenuItem>

                            </TextField>

                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <TextField
                                value={selectedType}
                                onChange={(e) => setSelectType(e.target.value)}
                                select
                                label="Tipo de Reunião"
                                fullWidth
                            >
                                <MenuItem key={0} value=''>Todos</MenuItem>
                                <MenuItem key={1} value='administrativa'>Administrativa</MenuItem>
                                <MenuItem key={2} value='assembleia_ordinaria'>Assembleia Ordinária</MenuItem>
                                <MenuItem key={3} value='assembleia_extraordinaria'>Assembleia Extraordinária</MenuItem>

                            </TextField>

                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <TextField
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                select
                                label="Data da Reunião"
                                fullWidth
                            >
                                <MenuItem key={0} value=''>Todos</MenuItem>
                                <MenuItem key={1} value='antiga'>Mais Distante</MenuItem>
                                <MenuItem key={2} value='nova'>Mais Próxima</MenuItem>
                            </TextField>

                        </Grid>

                    </Grid>

                </Grid>

                <ReunionPagination setReunionData={(r) => setReunions(r)} status={selectStatus} type={selectedType} date={selectedDate} token={user.token} />

            </Container>
        </Box >
    )
}

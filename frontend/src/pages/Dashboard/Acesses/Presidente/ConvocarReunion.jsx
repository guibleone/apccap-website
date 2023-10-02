import React, { useEffect } from 'react'
import { Grid, Typography, TextField, TextareaAutosize, Button, Box, FormGroup, FormControlLabel, Checkbox, CircularProgress, Container, useMediaQuery, Select, MenuItem } from '@mui/material'
import { colors } from '../../../colors'
import { BsArrowUpRight } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { createReunion, getReunions } from '../../../../features/reunion/reunionSlice'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../../../toastStyles'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { ptBR } from 'date-fns/locale'
import { resetEmailStatus } from '../../../../features/admin/adminSlice'
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink, BlobProvider, usePDF } from '@react-pdf/renderer';
import PDFReunion from './PDFReunion'
registerLocale('pt-BR', ptBR)
setDefaultLocale('ptBR')



export default function ConvocarReunion({ onClose }) {


    const matches = useMediaQuery('(min-width:600px)');

    // estados
    const [users, setUsers] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [instance, updateInstance] = usePDF({ document: <PDFReunion title={'teste'} /> });

    const [year, setYear] = useState(new Date().getFullYear())

    // redux
    const { emailStatus } = useSelector((state) => state.admin)
    const { user, isLoading: isLoadingAuth } = useSelector((state) => state.auth)
    const { isLoading } = useSelector((state) => state.reunions)
    const { reunionData } = useSelector((state) => state.reunions)

    // redux
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // mensagem e título
    const [message, setMessage] = useState('')
    const [title, setTitle] = useState('')


    // tipos de reunião
    const [typeReunion, setTypeReunion] = useState('')

    // selecionar os tipos de reunião
    const handleChange = (event) => {

        const selectedType = event.target.value

        setTypeReunion(selectedType)


    }



    console.log(typeReunion)


    // enviar email
    const handleSendEmail = () => {
        if (!message) return toast.error('Preencha a menssagem', styleError)
        if (!typeReunion) return toast.error('Selecione o tipo de reunião', styleError)
        try {
            const reunions = {
                title: `${(reunionData.length + 1).toString().padStart(3, "0")} / ${year}`,
                message,
                date: startDate.toLocaleString(),
                typeReunion,
                token: user.token
            }

            dispatch(createReunion(reunions))
            //dispatch(sendConvocationEmail({ message, date: startDate.toLocaleString(), typeReunion, title }))

            toast.success('Reunião criada com sucesso!', styleSuccess)
        } catch (err) {
            toast.error('Erro ao criar reunião!', styleError)
        }
    }



    // toast
    useEffect(() => {

        if (emailStatus.isSuccess) {
            toast.success(emailStatus.message, styleSuccess)
        }

        if (emailStatus.isError) {
            toast.error(emailStatus.message, styleError)
        }

        dispatch(resetEmailStatus())

    }, [emailStatus.isSuccess, emailStatus.isError])





    return (
        <Box sx={{
            backgroundColor: colors.main_white,
        }}>

            <Grid container spacing={2} pb={5}>
                <Grid item xs={12} md={12}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '20px 0',
                        gap: '10px'
                    }}>
                        <h1 className='bold black'>
                            Convocar Reunião
                        </h1>
                        <h5 className='regular black'>
                            Preencha os campos abaixo para convocar uma reunião
                        </h5>

                        <h5>
                            {/* numero da reuniao*/}
                            N.º {(reunionData.length + 1).toString().padStart(3, "0")} / {year}
                        </h5>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={2} pb={5}>

                <Grid item xs={12} lg={12}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>

                        <h4 className='medium black'>
                            Informações
                        </h4>
                        <TextareaAutosize
                            minRows={6}
                            placeholder='Mensagem para convocação'
                            style={{ width: "100%", resize: 'none', fontSize: '16px', padding: '10px', backgroundColor: colors.main_white }}
                            maxRows={8}
                            name='message'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Box>
                </Grid>

            </Grid>

            <Grid container spacing={2} pb={5}>

                <Grid item xs={12} lg={6}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>

                        <h4 className='medium black'>
                            Tipo de reunião
                        </h4>

                        <Select defaultValue={typeReunion} onChange={handleChange}>
                            <MenuItem value={'administrativa'}>Administrativa</MenuItem>
                            <MenuItem value={'assembleia_ordinal'}>Assembleia Ordinal</MenuItem>
                            <MenuItem value={'assembleia_extraordinaria'}>Assembleia Extraordinária</MenuItem>
                        </Select>

                    </Box>
                </Grid>

                <Grid item xs={12} lg={6} pb={10}>
                    <Box sx={{ display: 'flex', gap: '10px', width: '100%', flexDirection: 'column' }}>
                        <h4 className='medium black'>
                            Data
                        </h4>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            showTimeSelect
                            dateFormat="Pp"
                            locale={ptBR}
                            customInput={<TextField fullWidth />}
                        />
                    </Box>

                </Grid>

                <Grid item xs={12} lg={4} pt={10} >
                    <Box sx={{
                        display: 'flex',
                        gap: '10px',
                    }}>
                        <button onClick={() => { handleSendEmail(); onClose(); }} className='button-purple small' style={{ width: '100%' }}>
                            Convocar
                        </button>
                        <button onClick={onClose} className='button-white small' style={{ width: '100%' }}>
                            Cancelar
                        </button>
                    </Box>

                </Grid>

            </Grid>

            {/*
                <Grid item xs={12} lg={12}>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <FormGroup row>
                            <FormControlLabel control={<Checkbox checked={typeReunion.administrativa} onChange={handleChange} name='administrativa' />} label={'Administrativa'} />
                            <FormControlLabel control={<Checkbox checked={typeReunion.assembleia_ordinal} onChange={handleChange} name='assembleia_ordinal' />} label={'Assembleia ordinal'} />
                            <FormControlLabel control={<Checkbox checked={typeReunion.assembleia_extraordinaria} onChange={handleChange} name='assembleia_extraordinaria' />} label={'Assembleia extraordinária'} />
                        </FormGroup>

                        <Button
                            disabled={emailStatus.isLoading || isLoading}
                            onClick={handleSendEmail}
                            fullWidth
                            variant='contained'
                            color='success'> {emailStatus.isLoading ? <CircularProgress color="success" size={24} /> : 'Convocar'}
                        </Button>

                    </Box>

                </Grid>
                }*/}




        </Box>
    )
}

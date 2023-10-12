import React, { useEffect, useRef } from 'react'
import { Grid, Typography, TextField, TextareaAutosize, Button, Box, FormGroup, FormControlLabel, Checkbox, CircularProgress, Container, useMediaQuery, Select, MenuItem } from '@mui/material'
import { colors } from '../../../colors'
import { BsArrowUpRight, BsFileMinus, BsFilePlus, BsPlus } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { createReunion, getReunions, reset } from '../../../../features/reunion/reunionSlice'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../../../toastStyles'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { ptBR } from 'date-fns/locale'
import { resetEmailStatus } from '../../../../features/admin/adminSlice'
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink, BlobProvider, usePDF } from '@react-pdf/renderer';
import PDFReunion from './PDFReunion'
import { format } from 'date-fns'
registerLocale('pt-BR', ptBR)
setDefaultLocale('ptBR')



export default function ConvocarReunion({ onClose }) {


    const matches = useMediaQuery('(min-width:600px)');

    const currentDate = new Date();
    const dateConvocacao = format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

    const [pdfInstance, updatePdf] = usePDF();

    // estados
    const [users, setUsers] = useState([])
    const [startDate, setStartDate] = useState(new Date());

    const [year, setYear] = useState(new Date().getFullYear())

    // redux
    const { emailStatus } = useSelector((state) => state.admin)
    const { user, isLoading: isLoadingAuth } = useSelector((state) => state.auth)
    const { isLoading } = useSelector((state) => state.reunions)
    const { reunionData, isSuccess, isError, message: messageReunion } = useSelector((state) => state.reunions)

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

    // enviar email
    const handleConvocate = () => {
        if (!message) return toast.error('Preencha a menssagem', styleError)
        if (!typeReunion) return toast.error('Selecione o tipo de reunião', styleError)
        try {
            const reunionData = {
                title: title,
                message,
                dateConvocacao: currentDate.toLocaleString(),
                date: startDate.toLocaleString(),
                typeReunion,
                pautas,
                token: user.token
            }

            dispatch(createReunion({ reunionData, pdfInstance }))
            //dispatch(sendConvocationEmail({ message, date: startDate.toLocaleString(), typeReunion, title }))
        } catch (err) {
            toast.error('Erro ao criar reunião!', styleError)
        }
    }

    // única pauta

    const [singlePauta, setSinglePauta] = useState({
        title: '',
        description: ''
    })

    const { title: titlePauta, description: descriptionPauta } = singlePauta

    const handleChangePauta = (e) => {
        setSinglePauta((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    // multiple pautas

    const [pautas, setPautas] = useState([])

    const addPauta = () => {
        setPautas((prevState) => [...prevState, singlePauta])
        setSinglePauta({
            title: '',
            description: ''
        })
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


    useEffect(() => {

        setTitle(`${(reunionData.length + 1).toString().padStart(3, "0")} / ${year}`)
    }
        , [reunionData])


    useEffect(() => {

        updatePdf(<PDFReunion title={title} message={message} pautas={pautas} typeReunion={typeReunion} date={startDate.toLocaleString()} dateConvocacao={dateConvocacao} />);

    }, [title, message, pautas, typeReunion, startDate, dateConvocacao, updatePdf]);


    useEffect(() => {

        if (isError) {
            toast.error(messageReunion, styleError)
        }

        if (isSuccess) {
            toast.success(messageReunion, styleSuccess)
        }

        dispatch(reset())


    }, [isError, isSuccess, messageReunion])




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
                            N.º {title}
                        </h5>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={2} >

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
                            maxRows={5}
                            name='message'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} lg={12}>

                    <h4 className='medium black'>
                        Pautas
                    </h4>
                    <Box sx={{ display: 'flex', gap: '10px' }}>

                        <TextField sx={{ width: '50%' }} onChange={handleChangePauta} name='title' value={titlePauta} placeholder='Título da pauta' />
                        <TextField sx={{ width: '50%' }} onChange={handleChangePauta} name='description' value={descriptionPauta} placeholder='Descrição da pauta' />

                    </Box>


                    <Box sx={{
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'flex-end',
                        width: '100%',
                        marginTop: '10px'
                    }}>
                        <button onClick={addPauta} className='button-purple small' style={{}}>
                            Adicionar
                        </button>

                    </Box>

                    <Box sx={{
                        maxHeight: '220px',
                        overflowY: 'scroll',
                        paddingRigth: '10px',
                    }}>
                        {pautas?.length > 0 && pautas?.map((pauta, index) => (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                backgroundColor: colors.white,
                                color: colors.main_blue,
                                border: `1px solid ${colors.main_blue}`,
                                padding: '10px',
                                marginTop: '10px',
                                alignItems: 'center',
                            }}>
                                <h4 className='black medium'>{pauta.title}</h4>
                                <h4 className='black medium'>{pauta.description}</h4>

                                <button className='button-white small' onClick={() => setPautas((prevState) => prevState.filter((pauta, i) => i !== index))} variant='contained' color='error'>
                                    Remover
                                </button>

                            </Box>
                        ))}
                    </Box>

                </Grid>


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

                <Grid item xs={12} lg={6} pb={5}>
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

                <Grid item xs={12} lg={4} >
                    <Box sx={{
                        display: 'flex',
                        gap: '10px',
                    }}>
                        <button onClick={() => { handleConvocate(); onClose(); }} className='button-purple small' style={{ width: '100%' }}>
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
                            onClick={handleConvocate}
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

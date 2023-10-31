import { Avatar, Box, Checkbox, CircularProgress, Container, Dialog, DialogActions, DialogContent, FormControl, Grid, InputLabel, MenuItem, Select, TextField, TextareaAutosize, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../../../colors'
import { AiOutlineDownload, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PublicationsPagination from '../../../../components/Pagination/Publications'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../../../toastStyles'
import { createPublication, reset } from '../../../../features/blog/blogSlice'

export default function Publications() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const matches = useMediaQuery('(min-width:600px)')
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    // criar publicação
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    const [publicationsData, setPublications] = useState([])
    const { destaques, publications, isLoading, isSuccess, isError, message } = useSelector((state) => state.blog)


    const temas = [
        'Resultados de Competições',
        'Tendências e Inovações',
        'Rotulagem e Design',
        'Mercado e Vendas',
        'Legislação e Regulamentação',
        'Eventos',
        'História e Cultura da Cachaça',
        'Selos',
        'Associação'
    ]

    // ref do input file
    const fileInputRef = useRef(null);

    // função para abrir o input file
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const [thumbnail, setThumbnail] = useState(null); // armazena o arquivo selecionado

    // função para pegar o arquivo selecionado
    const handleFileChange = (event) => {
        setThumbnail(event.target.files[0]);
    };


    const [values, setValues] = useState({
        title: '',
        description: '',
        theme: '',
        isDestaque: false,
        author: user._id
    })

    // função para mudar os valores 

    const onChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value })
    }

    const changeIsDestaque = () => {
        setValues({ ...values, isDestaque: !values.isDestaque })
    }

    // enviar dados
    const onSubmit = (event) => {
        event.preventDefault()

        if (!values.title || !values.description || !values.theme) {
            return toast.error('Preencha todos os campos', styleError)

        }
        if (!thumbnail) {
            return toast.error('Selecione uma imagem válida', styleError)
        }

        dispatch(createPublication({ values, thumbnail }))

    }

    useEffect(() => {

        if (isSuccess) {
            toast.success(message, styleSuccess)
            handleOpen()
            setThumbnail(null)
        }

        if (isError) {
            toast.error(message, styleError)
        }

        dispatch(reset())

    }, [isSuccess, isError, message])


    return (
        <Box sx={{
            backgroundColor: colors.main_white,
            minHeight: '100vh',
            padding: '72px 0px',
        }}>
            <Container maxWidth='xl' >

                <Grid container spacing={2}  >
                    <Grid item xs={12} md={12}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <h3 style={{ color: '#000', fontWeight: 600 }}>
                                Publicações em Destaque
                            </h3>

                        </Box>
                    </Grid>

                    <Grid item >
                        {(destaques && destaques.length === 0) && (
                            <h3 className='regular black'>
                                Nenhuma publicação em destaque.
                            </h3>
                        )}
                    </Grid>

                    {destaques && destaques?.map((publicacao) => (
                        <Grid key={publicacao._id} item xs={12} md={2.9} >
                            <Box
                                sx={{
                                    borderRadius: '6px',
                                    border: '1.5px solid #9B9C9E',
                                    padding: '24px',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        cursor: 'pointer',
                                        border: '1.5px solid #00007B',
                                    }
                                }} >

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <h3 style={{ color: '#000', fontWeight: 600 }}>
                                        {publicacao.title.slice(0, 20)}...
                                    </h3>

                                    <AiOutlineEdit style={{ color: '#000', fontSize: '20px' }} />

                                </Box>

                                <Link style={{
                                    textDecorationColor: '#000',

                                }}>
                                    <h5 className='regular black italic'>
                                        {publicacao?.theme}
                                    </h5>
                                </Link>

                                <Box sx={{
                                    marginTop: '24px',
                                }}>

                                    <h4 className='semi-bold black' >
                                        {publicacao?.publication_date.split('-')[2].split('T')[0]}/{publicacao?.publication_date.split('-')[1]}/{publicacao?.publication_date.split('-')[0]}
                                    </h4>
                                </Box>

                            </Box>



                        </Grid>

                    ))}

                </Grid>

                <PublicationsPagination setPublicationsData={(p) => setPublications(p)} isDestaque={true} pages={4} />

                <Grid container spacing={2} >
                    <Grid item xs={12} md={12}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <h3 style={{ color: '#000', fontWeight: 600 }}>
                                Todas as Publicações
                            </h3>

                            <button onClick={() => handleOpen()} className='button-white-bottom-border'>
                                Nova Publicação <AiOutlinePlus size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} />
                            </button>

                        </Box>
                    </Grid>

                    <Grid item >
                        {(publications && publications.length === 0) && (
                            <h3 className='regular black'>
                                Nenhuma publicação públicada.
                            </h3>
                        )}
                    </Grid>

                    {publications && publications?.map((publicacao) => (
                        <Grid key={publicacao._id} item xs={12} md={2.9} >
                            <Box
                                sx={{
                                    borderRadius: '6px',
                                    border: '1.5px solid #9B9C9E',
                                    padding: '24px',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        cursor: 'pointer',
                                        border: '1.5px solid #00007B',
                                    }
                                }} >

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <h3 style={{ color: '#000', fontWeight: 600 }}>
                                        {publicacao.title.slice(0, 20)}...
                                    </h3>

                                    <AiOutlineEdit style={{ color: '#000', fontSize: '20px' }} />

                                </Box>

                                <Link style={{
                                    textDecorationColor: '#000',

                                }}>
                                    <h5 className='regular black italic'>
                                        {publicacao?.theme}
                                    </h5>
                                </Link>

                                <Box sx={{
                                    marginTop: '24px',
                                }}>

                                    <h4 className='semi-bold black' >
                                        {publicacao?.publication_date.split('-')[2].split('T')[0]}/{publicacao?.publication_date.split('-')[1]}/{publicacao?.publication_date.split('-')[0]}
                                    </h4>
                                </Box>

                            </Box>



                        </Grid>

                    ))}

                </Grid>

                <PublicationsPagination setPublicationsData={(p) => setPublications(p)} pages={4} />

            </Container>


            <Dialog open={open} onClose={handleOpen} maxWidth="lg" fullWidth>
                <DialogContent sx={{
                    backgroundColor: colors.main_white,
                    padding: matches ? '72px 24px' : '36px 15px',
                }}>

                    <Grid container columnSpacing={8} rowSpacing={5}>
                        <Grid item xs={12} md={12}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textAlign: 'center',
                                    gap: '10px',
                                    marginBottom: matches ? '36px' : '0px',
                                }}
                            >
                                <h1 className="black bold">Nova Publicação</h1>
                                <h4 className="regular black" style={{ maxWidth: '500px', margin: '0 auto' }}>
                                    Poste as principais novidades sobre a APCCAP e o mundo da cachaça de alambique
                                </h4>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px',
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <h4 className="medium black">Título</h4>
                                    <TextField name='title' onChange={onChange} fullWidth placeholder="Cachaça ganha prêmio"
                                        sx={
                                            {
                                                '& .MuiInputBase-root': {
                                                    borderRadius: '0px',
                                                    '& fieldset': {
                                                        borderColor: '#4AC97E',
                                                    },
                                                },
                                            }
                                        } />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Checkbox
                                        onChange={changeIsDestaque}
                                        sx={
                                            {
                                                marginLeft: '-10px', marginTop: '-3px',
                                                '& .MuiSvgIcon-root': {
                                                    color: '#4AC97E',
                                                },
                                            }
                                        } />
                                    <h4 className="medium black">
                                        Publicação Destaque
                                    </h4>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <h4 className="medium black">Tema</h4>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="tema">Selecione o tema </InputLabel>
                                        <Select
                                            name='theme'
                                            defaultValue=''
                                            onChange={onChange}
                                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                                            sx={{
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderRadius: '0px',
                                                    borderColor: '#4AC97E',

                                                },
                                            }}
                                        >
                                            {temas.map((tema) => (
                                                <MenuItem key={tema} value={tema}>{tema}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6} alignSelf={'center'} >
                            <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', flexDirection: matches ? 'row' : 'column' }}>
                                <Avatar sx={{ width: '143px', height: '143px' }} src='https://placehold.co/100x100' />
                                <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: matches ? 'flex-start' : 'center' }}>
                                    <h4 className="medium black">Imagem de capa</h4>
                                    <input
                                        style={{ display: 'none' }}
                                        accept='.jpeg, .png, .gif, .jpg'
                                        type='file'
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <button onClick={handleButtonClick} className='button-white-file' style={{
                                        width: '220px',
                                        textAlign: matches ? 'start' : 'center'
                                    }}>
                                        {thumbnail ? <>{thumbnail.name.slice(0, 20)} ... <AiOutlineEdit size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /> </> : <>Escolher arquivo <AiOutlineDownload size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /></>}
                                    </button>
                                </Box>
                            </Box>
                        </Grid>


                        <Grid item xs={12} md={12}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <h4 className="medium black">Descrição</h4>
                                <TextareaAutosize
                                    name='description'
                                    onChange={onChange}
                                    minRows={7}
                                    maxRows={10}
                                    placeholder="Escreva o corpo do notícia aqui ..."
                                    style={{
                                        padding: '10px',
                                        resize: 'none',
                                        backgroundColor: colors.main_white,
                                        borderColor: '#4AC97E',
                                        width: '100%',
                                    }}
                                />
                            </Box>
                        </Grid>

                    </Grid>

                    <Grid item xs={12} md={12} mt={7} sx={{
                        display: 'flex',
                        justifyContent: matches ? 'flex-start' : 'center',
                        gap: '20px'
                    }}>
                        <button
                            onClick={onSubmit}
                            className='button-purple'
                            style={{ backgroundColor: isLoading && colors.main_white }}
                        >
                            {isLoading ? <CircularProgress size={20} color="success" style={{}} /> : 'Postar'}
                        </button>
                        <button className='button-grey' onClick={handleOpen}>Cancelar</button>
                    </Grid>

                </DialogContent>
            </Dialog>



        </Box>
    )
}

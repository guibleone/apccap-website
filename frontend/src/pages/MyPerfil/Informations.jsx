import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { reset, updateUser, addProfilePhoto, becomeProducer } from '../../features/auth/authSlice'
import './Styles.css'
import Resume from "./Resume"
import { getResume } from "../../features/resume/resumeSlice"
import { getDocuments } from "../../features/documents/documentsSlice"
import { Button, Stack, Avatar, Typography, Divider, Box, Container, CssBaseline, TextField, Grid, MenuItem, Select, Checkbox, CircularProgress } from '@mui/material'
import { useMediaQuery } from "@mui/material"
import { styleError, styleSuccess } from '../toastStyles'
import { AiFillInfoCircle } from "react-icons/ai"
import './Styles.css'
import { colors } from "../colors"

function Informations() {

    const matches = useMediaQuery('(min-width:600px)');

    const { user, isLoading, isError, pending, isSuccess, message } = useSelector((state) => state.auth)
    const fileInputRef = useRef(null);

    const [logo, setLogo] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    /* Dados Pessoais */
    const [dadosPessoaisData, setDadosPessoaisData] = useState({
        name: user && user.dados_pessoais ? user.dados_pessoais.name : '',
        cpf: user && user.dados_pessoais ? user.dados_pessoais.cpf : '',
        email: user && user.dados_pessoais ? user.dados_pessoais.email : '',
        telefone: user && user.dados_pessoais ? user.dados_pessoais.telefone : '',
        celular: user && user.dados_pessoais ? user.dados_pessoais.celular : '',
        cep: user && user.dados_pessoais ? user.dados_pessoais.cep : '',
        logradouro: user && user.dados_pessoais ? user.dados_pessoais.logradouro : '',
        numero: user && user.dados_pessoais ? user.dados_pessoais.numero : '',
        cidade: user && user.dados_pessoais ? user.dados_pessoais.cidade : '',
        estado: user && user.dados_pessoais ? user.dados_pessoais.estado : '',
    })

    const cidadesValidas = [
        'Águas de Lindóia',
        'Amparo',
        'Holambra',
        'Jaguariúna',
        'Lindóia',
        'Monte Alegre do Sul',
        'Pedreira',
        'Serra Negra',
        'Socorro',

    ]

    const handleChangeDadosPessoais = (e) => {
        setDadosPessoaisData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    /* propriedade */

    const [propriedadeData, setPropriedadeData] = useState({
        cpfProprietario: user && user.propriedade ? user.propriedade.cpfProprietario : '',
        logradouro_propriedade: user && user.propriedade ? user.propriedade.logradouro_propriedade : '',
        cidade_propriedade: user && user.propriedade ? user.propriedade.cidade_propriedade : '',
        estado_propriedade: user && user.propriedade ? user.propriedade.estado_propriedade : '',
        cep_propriedade: user && user.propriedade ? user.propriedade.cep_propriedade : '',
        numero_propriedade: user && user.propriedade ? user.propriedade.numero_propriedade : '',
        nome_propriedade: user && user.propriedade ? user.propriedade.nome_propriedade : '',
        area_total: user && user.propriedade ? user.propriedade.area_total : '',
        telefone_propriedade: user && user.propriedade ? user.propriedade.telefone_propriedade : '',
        celular_propriedade: user && user.propriedade ? user.propriedade.celular_propriedade : '',
        tempoProducao: user && user.propriedade ? user.propriedade.tempoProducao : '',
    })

    const handleChangePropriedade = (e) => {
        setPropriedadeData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    /* marca */

    const [marcaData, setMarcaData] = useState({
        site: user && user.marca ? user.marca.site : '',
        instagram: user && user.marca ? user.marca.instagram : '',
        whatsapp: user && user.marca ? user.marca.whatsapp : '',
        logo: user && user.marca ? user.marca.logo : '',
    })

    const handleChangeMarca = (e) => {
        setMarcaData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const handleLogo = (e) => {
        e.preventDefault();

        setLogo(e.target.files[0])
    };


    const sameCpf = (e) => {
        const isChecked = e.target.checked;

        setPropriedadeData((prevState) => ({
            ...prevState,
            cpfProprietario: isChecked ? dadosPessoaisData.cpf : ''
        }));
    };

    const sameAddress = (e) => {
        const isChecked = e.target.checked;

        setPropriedadeData((prevState) => ({
            ...prevState,
            logradouro_propriedade: isChecked ? dadosPessoaisData.logradouro : '',
            cidade_propriedade: isChecked ? dadosPessoaisData.cidade : '',
            cep_propriedade: isChecked ? dadosPessoaisData.cep : '',
            numero_propriedade: isChecked ? dadosPessoaisData.numero : '',
            estado_propriedade: isChecked ? dadosPessoaisData.estado : '',
        }));
    };

    /* foto de perfil */

    const photoInputRef = useRef(null);

    const handleFile = (e) => {
        e.preventDefault()

        const userData = {
            id: user._id,
            token: user.token,
            pathFoto: photoInputRef.current.files[0],
        }


        dispatch(addProfilePhoto(userData))

    }


    useEffect(() => {

        if (!user) {
            navigate('/')
        }
        if (user) {
            dispatch(getDocuments(user.token))
            dispatch(getResume(user.token))
        }

    }, [user])

    useEffect(() => {
        if (isError) {
            toast.error(message, styleError)
        }

        if (isSuccess) {
            toast.success('Dados atualizados com sucesso!', styleSuccess)
        }

        dispatch(reset())

    }, [isError, isSuccess, message, dispatch])


    // se tornar produtor

    const handleBecomeProducer = () => {

        dispatch(becomeProducer(user.token))

    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (!dadosPessoaisData || !propriedadeData || !marcaData) {
            return toast.error('Preencha todos os campos.', styleError)
        }

        else {

            const userData = {
                dadosPessoaisData,
                propriedadeData,
                marcaData,
                id: user._id,
                token: user.token
            }

            dispatch(updateUser({ userData, logo }))
        }

    }

    return (
        <Box sx={{
            backgroundColor: '#FAF8F8',
            paddingBottom: '120px'
        }}>
            <CssBaseline />

            <Grid container spacing={2} p={matches ? 9 : 4} pt={9} >
                <Grid item xs={12} lg={4} >
                    <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column', paddingLeft: !matches ? 0 : '60px' }}>
                        <h1 style={{ fontWeight: 700, fontSize: !matches ? '24px' : '' }}>
                            Seus Dados
                        </h1>

                        <p style={{ fontWeight: 400, fontSize: !matches ? '14px' : '' }}>
                            Confira e atualize seus dados pessoais, da sua propriedade e da sua marca.
                        </p>
                    </Box>

                </Grid>

                <Grid container spacing={2} p={matches ? 10 : 0} pt={4} columnSpacing={22} >
                    <Grid item xs={12}>
                        <Typography pb={1} variant={matches ? 'h5' : 'h6'}
                            sx={{
                                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '210px',
                                textAlign: matches ? 'left' : 'center'
                            }} >
                            Dados Pessoais
                        </Typography>
                    </Grid>


                    <Grid item xs={12} lg={6} mt={5}>
                        <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                            Nome Completo
                        </Typography>
                        <TextField
                            disabled
                            autoComplete="name"
                            required
                            fullWidth
                            placeholder='André Luiz'
                            autoFocus
                            onChange={handleChangeDadosPessoais} type="text" id="name" name="name" value={dadosPessoaisData.name}
                            sx={
                                {
                                    '& .MuiInputBase-root': {
                                        borderRadius: '0px',
                                    },
                                }
                            }
                        />

                        <Typography variant='body1' pb={2} mt={2} sx={{ fontWeight: 540 }}>
                            E-mail
                        </Typography>

                        <TextField
                            required
                            fullWidth
                            id="email"
                            placeholder='appcap@gmail.com'
                            name="email"
                            onChange={handleChangeDadosPessoais} type='email' value={dadosPessoaisData.email}

                            sx={
                                {
                                    '& .MuiInputBase-root': {
                                        borderRadius: '0px',
                                    },
                                }
                            }
                        />

                        <Box sx={{ display: 'flex', gap: '10px', flexDirection: !matches ? 'column' : 'row' }}>
                            <Grid item xs={12} lg={6} mt={3}>
                                <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                    CEP
                                </Typography>

                                <TextField
                                    required
                                    fullWidth
                                    id="cep"
                                    placeholder='00000-000'
                                    name="cep"
                                    autoComplete="cep" onChange={handleChangeDadosPessoais} type="number"
                                    value={dadosPessoaisData.cep}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                />
                            </Grid>


                            <Grid item xs={12} lg={6} mt={3}>

                                <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                    Número
                                </Typography>

                                <TextField
                                    required
                                    fullWidth
                                    id="number"
                                    placeholder='000'
                                    name="numero"
                                    autoComplete="number" onChange={handleChangeDadosPessoais} type="number"
                                    value={dadosPessoaisData.numero}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                />
                            </Grid>

                        </Box>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Logradouro
                            </Typography>
                            <TextField
                                required
                                fullWidth
                                id="logradouro"
                                placeholder='Rua das Flores'
                                name="logradouro"
                                autoComplete="logradouro" onChange={handleChangeDadosPessoais} type="text"
                                value={dadosPessoaisData.logradouro}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                            />

                        </Grid>

                    </Grid>

                    <Grid item xs={12} lg={6} mt={5}>
                        <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                            CPF
                        </Typography>
                        <TextField
                            disabled
                            required
                            fullWidth
                            id="cpf"
                            placeholder='000.000.000-00'
                            name="cpf"
                            autoComplete="cpf" onChange={handleChangeDadosPessoais} type="number"
                            value={dadosPessoaisData.cpf}
                            sx={
                                {
                                    '& .MuiInputBase-root': {
                                        borderRadius: '0px',
                                    },
                                }
                            }
                        />

                        <Box sx={{ display: 'flex', gap: '10px', flexDirection: !matches ? 'column' : 'row' }}>
                            <Grid item xs={12} lg={6} mt={2}>
                                <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                    Telefone
                                </Typography>

                                <TextField
                                    required
                                    fullWidth
                                    id="telefone"
                                    placeholder='(19) 3261-5485'
                                    name="telefone"
                                    autoComplete="telefone" onChange={handleChangeDadosPessoais} type="number"
                                    value={dadosPessoaisData.telefone}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                />
                            </Grid>


                            <Grid item xs={12} lg={6} mt={2}>

                                <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                    Celular
                                </Typography>

                                <TextField
                                    required
                                    fullWidth
                                    id="celular"
                                    placeholder='(19) 99999-9999'
                                    name="celular"
                                    autoComplete="celular" onChange={handleChangeDadosPessoais} type="number"
                                    value={dadosPessoaisData.celular}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                />

                            </Grid>
                        </Box>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Estado
                            </Typography>

                            <Select
                                fullWidth
                                onChange={handleChangeDadosPessoais}
                                defaultValue=""
                                value={dadosPessoaisData.estado || ''}
                                name='estado'
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                            >
                                <MenuItem value="">Selecione um estado</MenuItem>
                                <MenuItem value="SP">São Paulo</MenuItem>
                            </Select>

                        </Grid>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Cidade
                            </Typography>

                            <Select
                                fullWidth
                                onChange={handleChangeDadosPessoais}
                                defaultValue=""
                                value={dadosPessoaisData.cidade || ''}
                                name='cidade'
                                autoComplete='cidade'
                                MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },

                                    }
                                }
                            >
                                {cidadesValidas.map((cidade, index) => (
                                    <MenuItem key={index} value={cidade}>{cidade}</MenuItem>
                                ))}
                            </Select>
                        </Grid>

                    </Grid>


                    <Grid item xs={12} lg={6} mt={3} pt={matches ? 8 : 0}>

                        <Box sx={{ display: 'flex', gap: '20px', flexDirection: !matches ? 'column' : 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar sx={{ width: 120, height: 120 }} src={user && user.dados_pessoais && user.dados_pessoais.profilePhoto ? user.dados_pessoais.profilePhoto : ''} />

                            <Grid item xs={12} lg={6} mt={2} sx={{ textAlign: 'center' }}>
                                <h3 sx={{ fontWeight: 540, color: '#000000' }}>
                                    Foto de Perfil
                                </h3>

                                {!pending ? <>
                                    <TextField
                                        required
                                        fullWidth
                                        id="profilePhoto"
                                        name="profilePhoto"
                                        autoComplete="profilePhoto" type="file"
                                        inputRef={photoInputRef}
                                        onChange={handleFile}
                                        sx={
                                            {
                                                '& .MuiInputBase-root': {
                                                    borderRadius: '0px',
                                                },

                                            }
                                        }
                                    />
                                </> : <>
                                    <CircularProgress color="success" style={{ padding: '5px' }} />
                                </>
                                }


                            </Grid>

                        </Box>

                    </Grid>

                    <Grid item xs={12} lg={6} mt={3} pt={matches ? 8 : 0}>
                        <Resume />
                    </Grid>

                </Grid>




                <Grid container spacing={2} p={matches ? 10 : 0} pt={4} columnSpacing={22}  >
                    <Grid item xs={12}>
                        <Typography pb={1} variant={matches ? 'h5' : 'h6'}
                            sx={{
                                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '210px',
                                textAlign: matches ? 'left' : 'center'
                            }} >
                            Propriedade
                        </Typography>
                    </Grid>

                    <Grid item xs={12} lg={6} mt={5}>
                        <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                            CPF do Proprietário
                        </Typography>

                        <TextField
                            required
                            fullWidth
                            id="cpfProprietario"
                            placeholder='000.000.000-00'
                            name="cpfProprietario"
                            autoComplete="cpfProprietario" onChange={handleChangePropriedade} type="number"
                            value={propriedadeData.cpfProprietario}
                            sx={
                                {
                                    '& .MuiInputBase-root': {
                                        borderRadius: '0px',
                                    },
                                }
                            }
                        />

                        <Checkbox
                            onChange={sameCpf}
                            disabled={!dadosPessoaisData.cpf} sx={{ marginLeft: '-10px', marginTop: '-3px' }} />
                        <Typography variant='caption'
                            sx={{
                                varticalAlign: 'bottom',
                                fontSize: '1rem'
                            }}
                        >
                            Mesmo CPF
                        </Typography>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Logradouro
                            </Typography>

                            <TextField
                                required
                                fullWidth
                                id="logradouro_propriedade"
                                placeholder='Rua das Flores'
                                name="logradouro_propriedade"
                                autoComplete="logradouro_propriedade" onChange={handleChangePropriedade} type="text"
                                value={propriedadeData.logradouro_propriedade}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                            />

                            <Checkbox
                                disabled={!dadosPessoaisData.logradouro || !dadosPessoaisData.cep || !dadosPessoaisData.numero || !dadosPessoaisData.cidade || !dadosPessoaisData.estado}
                                onChange={sameAddress} sx={{ marginLeft: '-10px', marginTop: '-3px' }} />
                            <Typography variant='caption'
                                sx={{
                                    varticalAlign: 'bottom',
                                    fontSize: '1rem'
                                }}
                            >
                                Mesmo Endereço
                            </Typography>
                        </Grid>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Cidade
                            </Typography>


                            <Select
                                fullWidth
                                onChange={handleChangePropriedade}
                                defaultValue=""
                                value={propriedadeData.cidade_propriedade || ''}
                                name='cidade_propriedade'
                                autoComplete='cidade_propriedade'
                                MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },

                                    }
                                }
                            >
                                {cidadesValidas.map((cidade, index) => (
                                    <MenuItem key={index} value={cidade}>{cidade}</MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Estado
                            </Typography>
                            <Select
                                fullWidth
                                onChange={handleChangePropriedade}
                                defaultValue=""
                                value={propriedadeData.estado_propriedade || ''}
                                name='estado'
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                            >
                                <MenuItem value="">Selecione um estado</MenuItem>
                                <MenuItem value="SP">São Paulo</MenuItem>
                            </Select>

                        </Grid>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Há quanto tempo voçê produz cachaça ?
                            </Typography>

                            <TextField
                                required
                                fullWidth
                                id="tempoProducao"
                                placeholder='13 anos'
                                name="tempoProducao"
                                autoComplete="tempoProducao" onChange={handleChangePropriedade} type="text"
                                value={propriedadeData.tempoProducao}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                            />

                        </Grid>
                    </Grid>

                    <Grid item xs={12} lg={6} mt={5}>
                        <Box sx={{ display: 'flex', gap: '10px', flexDirection: !matches ? 'column' : 'row' }}>
                            <Grid item xs={12} lg={6} mt={2}>
                                <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                    CEP
                                </Typography>

                                <TextField
                                    required
                                    fullWidth
                                    id="cep-propriedade"
                                    placeholder='00000-000'
                                    name="cep-propriedade"
                                    autoComplete="cep-propriedade" onChange={handleChangePropriedade} type="number"
                                    value={propriedadeData.cep_propriedade}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                />



                            </Grid>

                            <Grid item xs={12} lg={6} mt={2}>

                                <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                    Número
                                </Typography>

                                <TextField
                                    required
                                    fullWidth
                                    id="numero-propriedade"
                                    placeholder='00000-000'
                                    name="numero-propriedade"
                                    autoComplete="numero-propriedade" onChange={handleChangePropriedade} type="number"
                                    value={propriedadeData.numero_propriedade}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                />

                            </Grid>
                        </Box>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Nome da Propriedade
                            </Typography>

                            <TextField
                                required
                                fullWidth
                                id="nome_propriedade"
                                placeholder='Fazenda São Pedro'
                                name="nome_propriedade"
                                autoComplete="nome_propriedade" onChange={handleChangePropriedade} type="text"
                                value={propriedadeData.nome_propriedade}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                            />

                        </Grid>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Área Total
                            </Typography>

                            <TextField
                                required
                                fullWidth
                                id="area_total"
                                placeholder='1000 m²'
                                name="area_total"
                                autoComplete="area_total" onChange={handleChangePropriedade} type="number"
                                value={propriedadeData.area_total}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                            />

                        </Grid>

                        <Box sx={{ display: 'flex', gap: '10px', flexDirection: !matches ? 'column' : 'row' }}>
                            <Grid item xs={12} lg={6} mt={2}>
                                <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                    Telefone
                                </Typography>

                                <TextField
                                    required
                                    fullWidth
                                    id="telefone_propriedade"
                                    placeholder='(19) 3261-5485'
                                    name="telefone_propriedade"
                                    autoComplete="telefone_propriedade" onChange={handleChangePropriedade} type="number"
                                    value={propriedadeData.telefone_propriedade}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                />
                            </Grid>


                            <Grid item xs={12} lg={6} mt={2}>

                                <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                    Celular
                                </Typography>

                                <TextField
                                    required
                                    fullWidth
                                    id="celular_propriedade"
                                    placeholder='(19) 99999-9999'
                                    name="celular_propriedade"
                                    autoComplete="celular_propriedade" onChange={handleChangePropriedade} type="number"
                                    value={propriedadeData.celular_propriedade}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                />

                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} p={matches ? 10 : 0} pt={4} columnSpacing={22} >
                    <Grid item xs={12}>
                        <Typography pb={1} variant={matches ? 'h5' : 'h6'}
                            sx={{
                                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '210px',
                                textAlign: matches ? 'left' : 'center'
                            }} >
                            Marca
                        </Typography>
                    </Grid>

                    <Grid item xs={12} lg={6} mt={5}>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Site
                            </Typography>

                            <TextField
                                required
                                fullWidth
                                id="site"
                                placeholder='Link do site'
                                name="site"
                                autoComplete="site" onChange={handleChangeMarca} type="text"
                                value={marcaData.site}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                            />
                        </Grid>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Instagram
                            </Typography>

                            <TextField
                                required
                                fullWidth
                                id="instagram"
                                placeholder='Link do Instagram'
                                name="instagram"
                                autoComplete="instagram" onChange={handleChangeMarca} type="text"
                                value={marcaData.instagram}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                            />

                        </Grid>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Número de Whatsapp
                            </Typography>

                            <TextField
                                required
                                fullWidth
                                id="whatsapp"
                                placeholder='(19) 99999-9999'
                                name="whatsapp"
                                autoComplete="whatsapp" onChange={handleChangeMarca} type="number"
                                value={marcaData.whatsapp}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                            />

                        </Grid>

                        {matches &&
                            <>
                                <Grid item xs={12} lg={12} mt={8}>
                                    <Box sx={{ display: 'flex', gap: '20px', flexDirection: !matches ? 'column' : 'row' }}>

                                        <button className='button-purple'
                                            onClick={onSubmit}
                                            disabled={isLoading}
                                            style={{
                                                backgroundColor: isLoading && colors.main_white
                                            }}
                                        >
                                            {isLoading ? <CircularProgress color="success" style={{ padding: '5px' }} /> : 'Salvar Alterações'}
                                        </button>

                                        <button className='button-white'
                                            onClick={() => navigate('/')}
                                        >
                                            Cancelar
                                        </button>


                                    </Box>

                                </Grid>
                            </>
                        }

                    </Grid>

                    <Grid item xs={12} lg={6} mt={5}>

                        <Grid item xs={12} lg={12} mt={3} pt={matches ? 8 : 0}>

                            <Box sx={{ display: 'flex', gap: '20px', flexDirection: !matches ? 'column' : 'row', alignItems: 'center' }}>
                                <Avatar sx={{ width: 120, height: 120 }} src={user && user.marca ? user.marca.logo : ''} />

                                <Grid item xs={12} lg={6} mt={2} sx={{ textAlign: 'center' }}>
                                    <h3 sx={{ fontWeight: 540, color: '#000000' }}>
                                        Logo da sua marca
                                    </h3>

                                    <TextField
                                        required
                                        fullWidth
                                        id="logo"
                                        name="logo"
                                        autoComplete="logo" type="file"
                                        inputRef={fileInputRef}
                                        onChange={handleLogo}
                                        sx={
                                            {
                                                '& .MuiInputBase-root': {
                                                    borderRadius: '0px',
                                                },

                                            }
                                        }
                                    />

                                </Grid>

                            </Box>

                            {!matches &&
                                <>
                                    <Grid item xs={12} lg={12} mt={8}>
                                        <Box sx={{ display: 'flex', gap: '20px', flexDirection: !matches ? 'column' : 'row' }}>

                                            <button className='button-purple'
                                                onClick={onSubmit}
                                                disabled={isLoading}
                                                style={{
                                                    backgroundColor: isLoading && colors.main_white
                                                }}
                                            >
                                                {isLoading ? <CircularProgress color="success" style={{ padding: '5px' }} /> : 'Salvar Alterações'}
                                            </button>

                                            <button className='button-white'
                                                onClick={() => navigate('/')}
                                            >
                                                Cancelar
                                            </button>


                                        </Box>

                                    </Grid>
                                </>
                            }

                        </Grid>

                    </Grid>

                </Grid>
            </Grid>
        </Box>

    )
}

export default Informations
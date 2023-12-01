import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { reset, updateUser, addProfilePhoto, becomeProducer } from '../../features/auth/authSlice'
import './Styles.css'
import Resume from "./Resume"
import { getResume } from "../../features/resume/resumeSlice"
import { getDocuments } from "../../features/documents/documentsSlice"
import { Avatar, Typography, Box, Container, CssBaseline, TextField, Grid, MenuItem, Select, Checkbox, CircularProgress } from '@mui/material'
import { useMediaQuery } from "@mui/material"
import { styleError, styleSuccess } from '../toastStyles'
import './Styles.css'
import { colors } from "../colors"
import { celularMask, cepMask, cpfMask, removeMask, telefoneMask } from "../Mask"
import { cpf } from "cpf-cnpj-validator"

function Informations() {

    const matches = useMediaQuery('(min-width:600px)');

    const { user, isLoading, isError, pending, isSuccess, message } = useSelector((state) => state.auth)
    const fileInputRef = useRef(null);

    const [logo, setLogo] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    /* Dados Pessoais */
    const [dadosPessoais, setdadosPessoais] = useState({
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

    const estadosValidos = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
        'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];


    const handleChangeDadosPessoais = (e) => {
        const { name, value } = e.target;

        let newValue;

        if (name === 'cpf') {
            newValue = cpfMask(value);
        } else if (name === 'cep') {
            newValue = cepMask(value);
        } else if (name === 'telefone') {
            newValue = telefoneMask(value)
        } else if (name === 'celular') {
            newValue = celularMask(value)
        } else {
            newValue = value;
        }

        setdadosPessoais((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));
    };

    /* propriedade */

    const [propriedade, setpropriedade] = useState({
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
        setpropriedade((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    /* marca */

    const [marca, setmarca] = useState({
        site: user && user.marca ? user.marca.site : '',
        instagram: user && user.marca ? user.marca.instagram : '',
        whatsapp: user && user.marca ? user.marca.whatsapp : '',
        logo: user && user.marca ? user.marca.logo : '',
    })

    const handleChangeMarca = (e) => {
        setmarca((prevState) => ({
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

        setpropriedade((prevState) => ({
            ...prevState,
            cpfProprietario: isChecked ? dadosPessoais.cpf : ''
        }));
    };

    const sameAddress = (e) => {
        const isChecked = e.target.checked;

        setpropriedade((prevState) => ({
            ...prevState,
            logradouro_propriedade: isChecked ? dadosPessoais.logradouro : '',
            cidade_propriedade: isChecked ? dadosPessoais.cidade : '',
            cep_propriedade: isChecked ? dadosPessoais.cep : '',
            numero_propriedade: isChecked ? dadosPessoais.numero : '',
            estado_propriedade: isChecked ? dadosPessoais.estado : '',
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


    const onSubmit = (e) => {
        e.preventDefault()

        if (!dadosPessoais || !propriedade || !marca) {
            return toast.error('Preencha todos os campos.', styleError)
        }

        if (!cpf.isValid(removeMask(propriedade.cpfProprietario))) {
            return toast.error('CPF do proprietário inválido.', styleError)
        }

        else {

            const dadosPessoaisData = {
                ...dadosPessoais,
                cpf: removeMask(dadosPessoais.cpf),
                cep: removeMask(dadosPessoais.cep),
                telefone: removeMask(dadosPessoais.telefone),
                celular: removeMask(dadosPessoais.celular),
            }

            const propriedadeData = {
                ...propriedade,
                cpfProprietario: removeMask(propriedade.cpfProprietario),
                cep_propriedade: removeMask(propriedade.cep_propriedade),
                telefone_propriedade: removeMask(propriedade.telefone_propriedade),
                celular_propriedade: removeMask(propriedade.celular_propriedade),
            }

            const marcaData = {
                ...marca,
                whatsapp: removeMask(marca.whatsapp)
            }


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

            <Container maxWidth='xl'>
                <Grid container spacing={2} pt={9} columnSpacing={22}   >
                    <Grid item xs={12} lg={12} >
                        <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
                            <h1 style={{ fontWeight: 700, fontSize: !matches ? '24px' : '' }}>
                                Seus Dados
                            </h1>

                            <p style={{ fontWeight: 400, fontSize: !matches ? '14px' : '' }}>
                                Confira e atualize seus dados pessoais, da sua propriedade e da sua marca.
                            </p>
                        </Box>

                    </Grid>


                    <Grid item xs={12} mt={5}>
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
                            onChange={handleChangeDadosPessoais} type="text" id="name" name="name" value={dadosPessoais.name}
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
                            placeholder='apccap@gmail.com'
                            name="email"
                            onChange={handleChangeDadosPessoais} type='email' value={dadosPessoais.email}

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
                                    autoComplete="cep"
                                    onChange={handleChangeDadosPessoais}
                                    type="text"
                                    value={cepMask(dadosPessoais.cep)}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                    inputProps={{
                                        maxLength: 9,
                                    }}
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
                                    value={dadosPessoais.numero}
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
                                value={dadosPessoais.logradouro}
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
                            autoComplete="cpf" onChange={handleChangeDadosPessoais} type="text"
                            value={cpfMask(dadosPessoais.cpf)}
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
                                    autoComplete="telefone"
                                    onChange={handleChangeDadosPessoais}
                                    type="text"
                                    value={telefoneMask(dadosPessoais.telefone)}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                    inputProps={{
                                        maxLength: 14,
                                    }}
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
                                    autoComplete="celular"
                                    onChange={handleChangeDadosPessoais}
                                    type="text"
                                    value={celularMask(dadosPessoais.celular)}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                    inputProps={{
                                        maxLength: 15,
                                    }}
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
                                value={dadosPessoais.estado || ''}
                                name='estado'
                                MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                            >
                                <MenuItem value="">Selecione um estado</MenuItem>
                                {estadosValidos.map((estado, index) => (
                                    <MenuItem key={index} value={estado}>{estado}</MenuItem>
                                ))}
                            </Select>

                        </Grid>

                        <Grid item xs={12} lg={12} mt={3}>
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Cidade
                            </Typography>

                            <TextField
                                fullWidth
                                onChange={handleChangeDadosPessoais}
                                value={dadosPessoais.cidade || ''}
                                name='cidade'
                                autoComplete='cidade'
                            />

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




                    {/**PROPRIEDADE */}


                    <Grid item xs={12} mt={5}>
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
                            autoComplete="cpfProprietario"
                            onChange={handleChangePropriedade}
                            type="text"
                            value={cpfMask(propriedade.cpfProprietario)}
                            sx={
                                {
                                    '& .MuiInputBase-root': {
                                        borderRadius: '0px',
                                    },
                                }
                            }
                            inputProps={{
                                maxLength: 14,
                            }}
                        />

                        <Checkbox
                            onChange={sameCpf}
                            disabled={!dadosPessoais.cpf} sx={{ marginLeft: '-10px', marginTop: '-3px' }} />
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
                                value={propriedade.logradouro_propriedade}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                            />

                            <Checkbox
                                disabled={!dadosPessoais.logradouro || !dadosPessoais.cep || !dadosPessoais.numero || !dadosPessoais.cidade || !dadosPessoais.estado}
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
                                defaultValue={propriedade.cidade_propriedade || ''}
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
                                defaultValue={propriedade.estado_propriedade || ''}
                                name='estado_propriedade'
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
                                value={propriedade.tempoProducao}
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
                                    id="cep_propriedade"
                                    placeholder='00000-000'
                                    name="cep_propriedade"
                                    autoComplete="cep_propriedade"
                                    onChange={handleChangePropriedade}
                                    type="text"
                                    value={cepMask(propriedade.cep_propriedade)}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                    inputProps={{
                                        maxLength: 9,
                                    }}
                                />



                            </Grid>

                            <Grid item xs={12} lg={6} mt={2}>

                                <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                    Número
                                </Typography>

                                <TextField
                                    required
                                    fullWidth
                                    id="numero_propriedade"
                                    placeholder='00000-000'
                                    name="numero_propriedade"
                                    autoComplete="numero_propriedade" onChange={handleChangePropriedade} type="number"
                                    value={propriedade.numero_propriedade}
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
                                value={propriedade.nome_propriedade}
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
                                value={propriedade.area_total}
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
                                    autoComplete="telefone_propriedade"
                                    onChange={handleChangePropriedade}
                                    type="text"
                                    value={telefoneMask(propriedade.telefone_propriedade)}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                    inputProps={{
                                        maxLength: 14,
                                    }}
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
                                    autoComplete="celular_propriedade"
                                    onChange={handleChangePropriedade}
                                    type="text"
                                    value={celularMask(propriedade.celular_propriedade)}
                                    sx={
                                        {
                                            '& .MuiInputBase-root': {
                                                borderRadius: '0px',
                                            },
                                        }
                                    }
                                    inputProps={{
                                        maxLength: 15,
                                    }}
                                />

                            </Grid>
                        </Box>
                    </Grid>

                    {/**MARCA */}

                    <Grid item xs={12} mt={5}>
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
                                value={marca.site}
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
                                placeholder='Nome de usuário'
                                name="instagram"
                                autoComplete="instagram" onChange={handleChangeMarca} type="text"
                                value={marca.instagram}
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
                                autoComplete="whatsapp"
                                onChange={handleChangeMarca}
                                type="text"
                                value={celularMask(marca.whatsapp)}
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }
                                inputProps={{
                                    maxLength: 15,
                                }}
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

                                <Grid item xs={12} lg={7} mt={2} sx={{ textAlign: 'center' }}>
                                    <h3 sx={{ fontWeight: 540, color: '#000000' }}>
                                        Logo da marca ou foto da fazenda
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

            </Container>
        </Box >

    )
}

export default Informations
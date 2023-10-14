import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reset, registerUser } from '../../features/auth/authSlice'
import { getResume, resetResume } from '../../features/resume/resumeSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Button, Typography, Box, Container, CssBaseline, TextField, CircularProgress,
  Avatar, FormControlLabel, Checkbox, Grid, Link, LockOutlinedIcon, Modal, useMediaQuery, Select, MenuItem, FormControl
} from '@mui/material';
import { AiFillInfoCircle, AiFillLock, AiFillWarning, AiOutlinePaperClip } from 'react-icons/ai'
import { styleError, styleSuccess } from '../toastStyles'
import './Style.css'
import Footer from '../../components/Footer/Footer'
import { colors } from '../colors'


function Register() {

  const matches = useMediaQuery('(min-width:600px)');

  const style = matches ? {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,

  } : {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,

  }

  /* Dados Pessoais */
  const [dadosPessoaisData, setDadosPessoaisData] = useState({
    name: '',
    cpf: '',
    email: '',
    telefone: '',
    celular: '',
    cep: '',
    logradouro: '',
    numero: '',
    cidade: '',
    estado: '',
    password: '',
    password2: ''
  })

  const handleChangeDadosPessoais = (e) => {
    setDadosPessoaisData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

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

  /* propriedade */

  const [propriedadeData, setPropriedadeData] = useState({
    cpfProprietario: '',
    logradouro_propriedade: '',
    cidade_propriedade: '',
    estado_propriedade: '',
    cep_propriedade: '',
    numero_propriedade: '',
    nome_propriedade: '',
    area_total: '',
    telefone_propriedade: '',
    celular_propriedade: '',
    tempoProducao: '',
  })

  const handleChangePropriedade = (e) => {
    setPropriedadeData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const [isAssociado, setIsAssociado] = useState(false)

  const handleIsAssociate = (e) => {
    const isChecked = e.target.checked;

    setIsAssociado(isChecked)

  };

  /* marca */

  const [marcaData, setMarcaData] = useState({
    site: '',
    instagram: '',
    whatsapp: '',
    logo: '',
  })

  const handleChangeMarca = (e) => {
    setMarcaData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }


  const [logo, setLogo] = useState('')
  const fileInputRef = useRef(null);

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


  const resume = useSelector((state) => state.resume.resume)

  const { user, isError, pending, isSuccess, message, isLoading } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()


  const [acceptTerms, setAcceptTerms] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

  const handleOpenTerms = () => (setOpenTerms(!openTerms))

  const handleAcceptTermsToggle = () => {
    setAcceptTerms(!acceptTerms);
  };


  useEffect(() => {
    if (isError) {
      toast.error(message, styleError)
    }

    if (isSuccess || user) {
      navigate('/')
    }

    if (isSuccess) {

      dispatch(resetResume())

      if (!resume) {
        dispatch(getResume(user.token))
      }

    }

    dispatch(reset())

  }, [user, isError, isSuccess, message, navigate, dispatch, resume])


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()

    if (dadosPessoaisData.password !== dadosPessoaisData.password2) {
      return toast.error('As senhas não coincidem.', styleError)
    }
    if (!dadosPessoaisData || !propriedadeData || !marcaData) {
      return toast.error('Preencha todos os campos.', styleError)
    }

    else {
      const userData = {
        dadosPessoaisData,
        propriedadeData,
        marcaData,
        isAssociado
      }

      dispatch(registerUser({ userData, logo }))
    }

  }

  if (isLoading) {
    return <Box sx={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }
    }>
      <CircularProgress sx={
        {
          margin: '100px',
        }
      } size={100} />
    </Box>
  }

  return (
    <>
      <Box sx={{
        backgroundColor: '#FAF8F8',
        minHeight: '100vh',
        paddingBottom: '120px'
      }}>

        <CssBaseline />

        <Grid container spacing={2} p={matches ? 9 : 0} pt={9} >
          <Grid item xs={12} lg={12}>
            <div className='title'>
              <h1>
                Cadastro
              </h1>

              <p>
                Para você que  não é um produtor associado, cumpre com os <br />
                <Link style={{ color: '#140C9F', fontWeight: 700, textDecorationColor: '#140C9F' }} >requisitos</Link> e deseja se associar.
              </p>
            </div>
          </Grid>

          <Grid container spacing={2} p={matches ? 10 : 4} columnSpacing={22} >
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

              <Grid item xs={12} lg={12} mt={3}>
                <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                  Senha
                </Typography>

                <TextField
                  required
                  fullWidth
                  id="password"
                  placeholder='*******'
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  onChange={handleChangeDadosPessoais}
                  value={dadosPessoaisData.password}

                  sx={
                    {
                      '& .MuiInputBase-root': {
                        borderRadius: '0px',
                      },
                    }
                  }
                />

                <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }} mt={3}>
                  <AiFillInfoCircle size={25} style={{ verticalAlign: 'bottom' }} /> Mínimo 8 caractéres
                </Typography>

              </Grid>
            </Grid>

            <Grid item xs={12} lg={6} mt={5}>
              <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                CPF
              </Typography>
              <TextField
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

              <Grid item xs={12} lg={12} mt={3}>
                <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                  Confirmar senha
                </Typography>

                <TextField
                  required
                  fullWidth
                  id="password2"
                  placeholder='*******'
                  name="password2"
                  type="password"
                  autoComplete="new-password"
                  onChange={handleChangeDadosPessoais}
                  value={dadosPessoaisData.password2}

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

          </Grid>

          <Grid container spacing={2} p={matches ? 10 : 4} columnSpacing={22}  >
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
                    id="cep_propriedade"
                    placeholder='00000-000'
                    name="cep_propriedade"
                    autoComplete="cep_propriedade" onChange={handleChangePropriedade} type="number"
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
                    id="numero_propriedade"
                    placeholder='00000-000'
                    name="numero_propriedade"
                    autoComplete="numero_propriedade" onChange={handleChangePropriedade} type="number"
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

          <Grid container spacing={2} p={matches ? 10 : 4} columnSpacing={22} >
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
                  placeholder='Nome de usuário'
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

                <Grid item xs={12} lg={12} mt={3}>
                  <Checkbox
                    onChange={handleIsAssociate} sx={{ marginLeft: '-10px', marginTop: '-3px' }} />
                  <Typography variant='caption'
                    sx={{
                      varticalAlign: 'bottom',
                      fontSize: '1rem'
                    }}
                  >
                    Tornar-se um associado ?
                  </Typography>
                  <Link style={{ color: '#140C9F', fontWeight: 700, textDecorationColor: '#140C9F' }}>Saiba mais</Link>



                </Grid>

              </Grid>

              {matches &&
                <>
                  <Grid item xs={12} lg={12} mt={8}>
                    <Box sx={{ display: 'flex', gap: '20px', flexDirection: !matches ? 'column' : 'row' }}>

                      <button className='button-purple'
                        onClick={onSubmit}
                        disabled={pending}
                        style={{ backgroundColor: pending && colors.main_white }}
                      >
                        {pending ? <CircularProgress color="success" style={{ padding: '5px' }} /> : 'Cadastrar'}
                      </button>

                      <button className='button-white'
                        onClick={() => navigate('/entrar')}
                      >
                        Entrar
                      </button>


                    </Box>

                  </Grid>
                </>
              }

            </Grid>

            <Grid item xs={12} lg={6} mt={5}>

              <Grid item xs={12} lg={12} mt={3} pt={matches ? 8 : 0}>

                <Box sx={{ display: 'flex', gap: '10px', flexDirection: !matches ? 'column' : 'row', alignItems: 'center' }}>
                  <img src="https://via.placeholder.com/150" alt="logo" style={{
                    borderRadius: '100px',
                    width: '150px',
                  }} />

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
                          disabled={pending}
                          style={{ backgroundColor: pending && colors.main_white }}
                        >
                          {pending ? <CircularProgress color="success" style={{ padding: '5px' }} /> : 'Cadastrar'}
                        </button>

                        <button className='button-white'
                          onClick={() => navigate('/entrar')}
                        >
                          Entrar
                        </button>


                      </Box>

                    </Grid>
                  </>
                }

              </Grid>

            </Grid>

          </Grid>
        </Grid>


        {/*
      <Modal
        open={openTerms}
        onClose={handleOpenTerms}
      >
        <Box sx={style}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant="h6" >Termos de Uso</Typography>
              <AiOutlinePaperClip size={30} />
            </Box>
            <Typography variant="body1" >
              Lorem ipsum dolor si
              amet, consectetur adipiscing elit. Nullam
              ac ante mollis quam tristique convallis
            </Typography>
            <Typography variant="body1" >
              Lorem ipsum dolor si
              amet, consectetur adipiscing elit. Nullam
              ac ante mollis quam tristique convallis
            </Typography>
            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button color='info' variant='contained' onClick={handleOpenTerms}>Voltar</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      */}



      </Box >
      <Footer />

    </>
  )
}

export default Register
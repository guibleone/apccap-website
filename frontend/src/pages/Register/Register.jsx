import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reset, registerUser } from '../../features/auth/authSlice'
import { getResume, resetResume } from '../../features/resume/resumeSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Typography, Box, Container, CssBaseline, TextField, CircularProgress,
  Checkbox, Grid, useMediaQuery, Select, MenuItem,
} from '@mui/material';
import { AiFillInfoCircle, } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { styleError, } from '../toastStyles'
import './Style.css'
import Footer from '../../components/Footer/Footer'
import { colors } from '../colors'
import TermsAcceptanceDialog from './Terms'
import { cpf } from 'cpf-cnpj-validator'
import { celularMask, cepMask, cpfMask, removeMask, telefoneMask } from '../Mask'


function Register() {

  const matches = useMediaQuery('(min-width:600px)');

  /* Dados Pessoais */
  const [dadosPessoais, setdadosPessoais] = useState({
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

  const handleChangeDadosPessoaisData = (e) => {
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


  /* propriedade */

  const [propriedade, setPropriedadeData] = useState({
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


    const { name, value } = e.target;

    let newValue;

    if (name === 'cpfProprietario') {
      newValue = cpfMask(value);
    } else if (name === 'cep_propriedade') {
      newValue = cepMask(value);
    } else if (name === 'telefone_propriedade') {
      newValue = telefoneMask(value)
    } else if (name === 'celular_propriedade') {
      newValue = celularMask(value)
    } else {
      newValue = value;
    }

    setPropriedadeData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  }

  const [isAssociado, setIsAssociado] = useState(false)

  const handleIsAssociate = (e) => {
    const isChecked = e.target.checked;

    setIsAssociado(isChecked)

  };

  /* marca */

  const [marca, setmarca] = useState({
    site: '',
    instagram: '',
    whatsapp: '',
    logo: '',
  })

  const handleChangeMarca = (e) => {

    const { name, value } = e.target;

    let newValue;

    if (name === 'whatsapp') {
      newValue = celularMask(value);
    } else {
      newValue = value;
    }

    setmarca((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
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
      cpfProprietario: isChecked ? dadosPessoais.cpf : ''
    }));
  };

  const sameAddress = (e) => {
    const isChecked = e.target.checked;

    setPropriedadeData((prevState) => ({
      ...prevState,
      logradouro_propriedade: isChecked ? dadosPessoais.logradouro : '',
      cidade_propriedade: isChecked ? dadosPessoais.cidade : '',
      cep_propriedade: isChecked ? dadosPessoais.cep : '',
      numero_propriedade: isChecked ? dadosPessoais.numero : '',
      estado_propriedade: isChecked ? dadosPessoais.estado : '',
    }));
  };


  const resume = useSelector((state) => state.resume.resume)

  const { user, isError, pending, isSuccess, message, isLoading } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()


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

  // termos e condições
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    handleOpen()
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()

    if(!dadosPessoais.name || !dadosPessoais.cpf || !dadosPessoais.email || !dadosPessoais.cep || !dadosPessoais.logradouro || !dadosPessoais.numero || !dadosPessoais.cidade || !dadosPessoais.estado || !dadosPessoais.password || !dadosPessoais.password2 || !propriedade.cpfProprietario || !propriedade.logradouro_propriedade || !propriedade.cidade_propriedade || !propriedade.estado_propriedade || !propriedade.cep_propriedade || !propriedade.numero_propriedade || !propriedade.nome_propriedade || !propriedade.area_total || !propriedade.telefone_propriedade || !propriedade.celular_propriedade || !propriedade.tempoProducao || !marca.site || !marca.instagram || !marca.whatsapp || !logo) {
      return toast.error('Preencha todos os campos.', styleError)
    }
    
    if (dadosPessoais.password !== dadosPessoais.password2) {
      return toast.error('As senhas não coincidem.', styleError)
    }

    if (!dadosPessoais || !propriedade || !marca) {
      return toast.error('Preencha todos os campos.', styleError)
    }

    if (!cpf.isValid(removeMask(dadosPessoais.cpf))) {
      return toast.error('CPF inválido.', styleError)
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
        isAssociado
      };

      dispatch(registerUser({ userData, logo }));
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

        <Container maxWidth='xl'>
          <CssBaseline />

          <Grid container spacing={2} pt={9} columnSpacing={22}>
            <Grid item xs={12} lg={12}>
              <div className='title'>
                <h1>
                  Cadastro
                </h1>

                <p>
                  Para você que é um produtor, cumpre com os <br />
                  <Link to={'/quem-somos#associar'} style={{ color: '#140C9F', fontWeight: 700, textDecorationColor: '#140C9F' }} >requisitos</Link> e deseja utilizar nossos selos.
                </p>
              </div>
            </Grid>

            {/**DADOS PESSOAIS */}

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
                autoComplete="name"
                required
                fullWidth
                placeholder='André Luiz'
                autoFocus
                onChange={handleChangeDadosPessoaisData} type="text" id="name" name="name" value={dadosPessoais.name}
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
                onChange={handleChangeDadosPessoaisData} type='email' value={dadosPessoais.email}

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
                    autoComplete="cep" onChange={handleChangeDadosPessoaisData}
                    value={dadosPessoais.cep}
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
                    autoComplete="number" onChange={handleChangeDadosPessoaisData} type="number"
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
                  autoComplete="logradouro" onChange={handleChangeDadosPessoaisData} type="text"
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
                  onChange={handleChangeDadosPessoaisData}
                  value={dadosPessoais.password}

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
                autoComplete="cpf" onChange={handleChangeDadosPessoaisData} type="text"
                value={dadosPessoais.cpf}
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
                    onChange={handleChangeDadosPessoaisData}
                    value={dadosPessoais.telefone}
                    type='text'
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
                    autoComplete="celular" onChange={handleChangeDadosPessoaisData} type="text"
                    value={dadosPessoais.celular}
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
                  onChange={handleChangeDadosPessoaisData}
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
                  onChange={handleChangeDadosPessoaisData}
                  value={dadosPessoais.cidade || ''}
                  name='cidade'
                  autoComplete='cidade'
                />

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
                  onChange={handleChangeDadosPessoaisData}
                  value={dadosPessoais.password2}

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
                autoComplete="cpfProprietario" onChange={handleChangePropriedade} type="text"
                value={propriedade.cpfProprietario}
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
                  value={propriedade.cidade_propriedade || ''}
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
                  value={propriedade.estado_propriedade || ''}
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
                    autoComplete="cep_propriedade" onChange={handleChangePropriedade}
                    value={propriedade.cep_propriedade}
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
                    type='text'
                    value={propriedade.telefone_propriedade}
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
                    autoComplete="celular_propriedade" onChange={handleChangePropriedade} type="text"
                    value={propriedade.celular_propriedade}
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
                  autoComplete="whatsapp" onChange={handleChangeMarca} type="text"
                  value={marca.whatsapp}
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

                  <Link to='/quem-somos#associar' style={{ color: '#140C9F', fontWeight: 700, textDecorationColor: '#140C9F' }}>

                    Saiba mais

                  </Link>

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

                  <Grid item xs={12} lg={7} mt={2} sx={{ textAlign: 'center' }}>
                    <h3 sx={{ fontWeight: 540, color: '#000000' }}>
                      Logo da marca ou foto da fazenda
                    </h3>

                    <TextField
                      required
                      fullWidth
                      id="logo"
                      name="logo"
                      type="file"
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

          <TermsAcceptanceDialog open={open} handleOpen={handleOpen} />

        </Container>
      </Box >
      <Footer />

    </>
  )
}

export default Register
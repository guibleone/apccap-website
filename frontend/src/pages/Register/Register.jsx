import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reset, registerUser } from '../../features/auth/authSlice'
import { getResume, resetResume } from '../../features/resume/resumeSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Button, Typography, Box, Container, CssBaseline, TextField, CircularProgress,
  Avatar, FormControlLabel, Checkbox, Grid, Link, LockOutlinedIcon, Modal, useMediaQuery, Select, MenuItem
} from '@mui/material';
import { AiFillInfoCircle, AiFillLock, AiFillWarning, AiOutlinePaperClip } from 'react-icons/ai'
import { styleError, styleSuccess } from '../toastStyles'
import './Style.css'


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

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    password: '',
    password2: ''
  })

  const resume = useSelector((state) => state.resume.resume)
  const { name, cpf, email, password, password2 } = formData

  const { user, isError, isLoading, isSuccess, message, pending } = useSelector((state) => state.auth)

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

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== password2) {
      toast.error('Senhas não conferem.', styleError)
    }
    else {
      const userData = {
        name,
        cpf,
        email,
        password
      }

      dispatch(registerUser(userData))
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
    <Box sx={{
      backgroundColor: '#FAF8F8',
      minHeight: '100vh',
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
              <Link style={{ color: '#140C9F', fontWeight: 700, textDecorationColor: '#140C9F' }} >requisitos </Link> e deseja se associar.
            </p>
          </div>
        </Grid>

        <Grid container spacing={2} p={5}  >
          <Grid item xs={12}>
            <Typography pb={1} variant='h5' sx={{ fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: '220px' }}>
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
              onChange={onChange} type="text" id="name" name="name" value={name}
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
              onChange={onChange} type='email' value={email}

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
                  autoComplete="cep" onChange={onChange} type="number"
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
                  name="number"
                  autoComplete="number" onChange={onChange} type="number"
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
                autoComplete="logradouro" onChange={onChange} type="text"
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
                onChange={onChange}
                value={password}

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
              autoComplete="cpf" onChange={onChange} type="number"
              value={cpf}
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
                  autoComplete="telefone" onChange={onChange} type="number"
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
                  autoComplete="celular" onChange={onChange} type="number"
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

              <Select fullWidth
                sx={
                  {
                    '& .MuiInputBase-root': {
                      borderRadius: '0px',
                    },
                  }
                }
              >
                <MenuItem value={'SP'}>São Paulo</MenuItem>
                <MenuItem value={'RJ'}>Rio de Janeiro</MenuItem>
                <MenuItem value={'MG'}>Minas Gerais</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} lg={12} mt={3}>
              <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                Cidade
              </Typography>

              <TextField
                required
                fullWidth
                id="cidade"
                placeholder='Campinas'
                name="cidade"
                autoComplete="cidade" onChange={onChange} type="text"
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
                onChange={onChange}
                value={password2}

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

        <Grid container spacing={2} p={5}  >
          <Grid item xs={12}>
            <Typography pb={1} variant='h5' sx={{ fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: '220px' }}>
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
              autoComplete="cpfProprietario" onChange={onChange} type="number"
              sx={
                {
                  '& .MuiInputBase-root': {
                    borderRadius: '0px',
                  },
                }
              }
            />

            <Checkbox sx={{ marginLeft: '-10px',marginTop:'-3px' }} />
            <Typography  variant='caption'
            sx={{
              varticalAlign: 'bottom',
              fontSize: '1rem'
            }}
            >
              Mesmo CPF
            </Typography>


          </Grid>
        </Grid>


      </Grid>







      {/*
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <AiFillLock />
        </Avatar>

        <Typography component="h1" variant="h5">
          Registrar
        </Typography>

        <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="name"
                required
                fullWidth
                label="Nome Completo"
                autoFocus
                onChange={onChange} type="text" id="name" name="name" value={name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="cpf"
                label="CPF"
                name="cpf"
                autoComplete="cpf" onChange={onChange} type="number" value={cpf}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                onChange={onChange} type='email' value={email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={onChange} value={password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Confirmar Senha"
                autoComplete="new-password"
                onChange={onChange} type="password" id="password2" name="password2" value={password2}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Checkbox sx={{marginLeft:'-10px'}} checked={acceptTerms} onClick={handleAcceptTermsToggle} />
            <Typography variant='caption'>
              Li e concordo com os <Link sx={{ cursor: 'pointer' }} onClick={handleOpenTerms} >termos</Link> de uso
            </Typography>
          </Grid>

          <Button
            disabled={pending || !acceptTerms}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {pending ? <CircularProgress size={25} color="success" /> : 'Cadastrar'}

          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/entrar" variant="body2">
                Já tem uma conta ? Entre
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>


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
  )
}

export default Register
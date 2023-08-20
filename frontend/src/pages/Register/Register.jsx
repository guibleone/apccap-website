import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reset, registerUser } from '../../features/auth/authSlice'
import { getResume, resetResume } from '../../features/resume/resumeSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Button, Typography, Box, Container, CssBaseline, TextField, CircularProgress,
  Avatar, FormControlLabel, Checkbox, Grid, Link, LockOutlinedIcon
} from '@mui/material';
import { AiFillLock } from 'react-icons/ai'


function Register() {

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    password: '',
    password2: ''
  })

  const resume = useSelector((state) => state.resume.resume)
  const { name, cpf, email, password, password2 } = formData

  const { user, isError, isLoading, isSuccess, message,pending } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isError) {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
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


  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== password2) {
      toast.error('Senhas não conferem.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
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
          <Button
            disabled={pending}
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
    </Container>
  )
}

export default Register
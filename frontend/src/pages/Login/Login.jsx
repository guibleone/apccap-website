import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { loginUser, reset } from '../../features/auth/authSlice'
import { getResume } from '../../features/resume/resumeSlice'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { Button, Typography, Box, Container, CssBaseline, TextField, CircularProgress, Avatar,Grid,Link  } from '@mui/material';
import { AiFillUnlock } from 'react-icons/ai'
import { styleError, styleSuccess } from '../toastStyles'

function Login() {
  const [formData, setFormData] = useState({
    cpf: '',
    password: ''
  })

  const { cpf, password } = formData

  const { user, isError, isLoading, isSuccess, message, pending } = useSelector((state) => state.auth)

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
      dispatch(getResume(user.token))
    }

    dispatch(reset())

  }, [user, isError, isLoading, isSuccess, message, navigate, dispatch])


  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      cpf,
      password
    }

    dispatch(loginUser(userData))
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
      <Avatar sx={{ m: 1, bgcolor: 'green' }}>
        <AiFillUnlock />
      </Avatar>

      <Typography component="h1" variant="h5">
        Entrar
      </Typography>

      <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} >
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
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="new-password"
              onChange={onChange} value={password}
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
          {pending ? <CircularProgress size={25} color="success" /> : 'Entrar'}

        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/registrar" variant="body2">
              Não possui conta ? Cadastre-se
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Container>

  
  )
}

export default Login
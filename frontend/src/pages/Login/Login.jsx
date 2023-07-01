import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { loginUser, reset } from '../../features/auth/authSlice'
import { getResume } from '../../features/resume/resumeSlice'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { Button, Typography, Box, Container, CssBaseline, TextField, CircularProgress, Stack, Alert } from '@mui/material';

function Login() {
  const [formData, setFormData] = useState({
    cpf: '',
    password: ''
  })

  const { cpf, password } = formData

  const { user, isError, isLoading, isSuccess, message } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {

    if (isError) {
      toast.error(message)
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
    <Container>
      <CssBaseline />
      <Box
        sx={
          {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh',
            marginTop: '-100px'
          }
        }
      >

        <Typography variant="h4" component="h1" gutterBottom>ENTRAR</Typography>

        <form onSubmit={onSubmit}>

          <TextField sx={
            {
              width: '100%',
              marginBottom: 2,
            }
          } label='CPF' variant='filled' onChange={onChange} type="number" id="cpf" name="cpf" value={cpf} />

          <TextField sx={
            {
              width: '100%',
              marginBottom: 2,
            }
          } label='Senha' variant='filled' onChange={onChange} type="password" id="password" name="password" value={password} />

          <Button sx={
            {
              width: '100%',
              marginBottom: 2,
            }
          } variant="contained" type="submit">Entrar</Button>

        </form>

        {isError && <Typography variant="h6" component="h1" gutterBottom sx={
          {
            color: 'red',
            border: '1px solid red',
            width: '100%',
            textAlign: 'center',
            padding: '10px',
          }
        }>{message}</Typography>}

      </Box>

    </Container>
  )
}

export default Login
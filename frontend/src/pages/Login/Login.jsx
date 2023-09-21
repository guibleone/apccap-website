import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { loginUser, reset } from '../../features/auth/authSlice'
import { getResume } from '../../features/resume/resumeSlice'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { Button, Typography, Box, Container, CssBaseline, TextField, CircularProgress, Avatar, Grid, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom'
import { AiFillUnlock } from 'react-icons/ai'
import { styleError, styleSuccess } from '../toastStyles'
import './Style.css'

function Login() {
  const matches = useMediaQuery('(min-width:600px)');

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
    <Box sx={{
      backgroundColor: '#FAF8F8',
      minHeight: '100vh',
    }}>
      <CssBaseline />
      <Container>

        <Grid container spacing={2} p={matches ? 9 : 0} pt={9} >
          <Grid item xs={12} lg={12}>
            <div className="title">
              <h1>Login</h1>
              <p>
                Para você que é um produtor já associado {matches ? <br /> : null}
                ou iniciou o processo de associação.
              </p>
            </div>
          </Grid>

          <Grid item xs={12} lg={12} mt={5} >
            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
              CPF
            </Typography>
            <TextField
              id="cpf"
              name="cpf"
              autoComplete="cpf"
              onChange={onChange}
              type="number"
              value={cpf}
              fullWidth
              placeholder="000.000.000-00"
              sx={
                {
                  '& .MuiInputBase-root': {
                    borderRadius: '0px',
                  },
                }
              }
            />
          </Grid>

          <Grid item xs={12} lg={12} mt={5} >
            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
              Senha
            </Typography>
            <TextField
              id="password"
              name="password"
              placeholder="*******"
              type="password"
              autoComplete="new-password"
              onChange={onChange} value={password}
              fullWidth
              sx={
                {
                  '& .MuiInputBase-root': {
                    borderRadius: '0px',
                  },
                }
              }

            />

          </Grid>

          <Grid item xs={12} lg={12} mt={5} >

            <div className="esqueci-senha">
              <Link to="/" style={{ color: '#140C9F', textDecoration: 'none', cursor: 'pointer' }}>Esqueci minha senha</Link>
            </div>

          </Grid>

          <Grid item xs={12} lg={12} mt={5} >
            <Box sx={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
             
            }}>
    
            <button style={{padding:'20px'}} className="cadastrar" onClick={() => navigate('/registrar')}>Cadastrar</button>
              <button disabled={pending} style={{ backgroundColor: pending && '#FAF8F8' }} className="entrar" onClick={onSubmit}>
                {pending ? <CircularProgress size={25} color="success" /> : 'Entrar'}
              </button>
            </Box>

          </Grid>

        </Grid>
      </Container>
  

    </Box >


  )
}

export default Login
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { loginUser, reset } from '../../features/auth/authSlice'
import { getResume } from '../../features/resume/resumeSlice'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { Button, Typography, Box, Container, CssBaseline, TextField, CircularProgress, Avatar, Grid } from '@mui/material';
import { Link } from 'react-router-dom'
import { AiFillUnlock } from 'react-icons/ai'
import { styleError, styleSuccess } from '../toastStyles'
import './Style.css'

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
    <Box >
      <CssBaseline />
      <div className="container-login">
        <div className="title">
          <h1>Login</h1>
          <p>
            Para você que é um produtor já associado <br />
            ou iniciou o processo de associação.
          </p>
        </div>

        <div className="form">
          <div className="cpf">
            <label htmlFor="cpf">CPF</label>
            <input required
              id="cpf"
              name="cpf"
              autoComplete="cpf"
              onChange={onChange}
              type="number"
              value={cpf}
              placeholder="000.000.000-00"
            />
          </div>
          <div className="senha">
            <label htmlFor="password">Senha</label>
            <input placeholder="*******"
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="new-password"
              onChange={onChange} value={password} />
          </div>

          <div className="esqueci-senha">
            <Link to="/" style={{ color: '#140C9F', textDecoration: 'none', cursor: 'pointer' }}>Esqueci minha senha</Link>
          </div>


          <div className="actions-login">
            <button className="cadastrar" onClick={() => navigate('/registrar')}>Cadastrar</button>
            <button disabled={pending} style={{backgroundColor: pending && '#FAF8F8' }} className="entrar" onClick={onSubmit}>
              {pending ? <CircularProgress size={25} color="success" /> : 'Entrar'}
            </button>
          </div>

        </div>
      </div>




      {/*<Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
    
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
    */}

    </Box>


  )
}

export default Login
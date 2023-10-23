import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../toastStyles'
import { useMediaQuery, Box, Container, Grid, Typography, TextField, CssBaseline, CircularProgress } from '@mui/material'
import Footer from '../../components/Footer/Footer'
import { resetEmailStatus, sendResetEmail } from '../../features/admin/adminSlice'
import NewPassword from './NewPassword'

export default function ForgotPassword() {

    const matches = useMediaQuery('(min-width:600px)');

    const resetCode = localStorage.getItem('resetCode')

    const [formData, setFormData] = useState({
        email: '',
        codigo: '',
    })

    const { email, codigo } = formData

    const { user, pending } = useSelector((state) => state.auth)
    const { emailStatus } = useSelector((state) => state.admin)
    const [isValidate, setIsValidate] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

        if (emailStatus.isError) {
            toast.error(emailStatus.message, styleError)
        }

        if (emailStatus.isSuccess) {
            toast.success(emailStatus.message, styleSuccess)
            timer()
        }

        dispatch(resetEmailStatus())

    }, [user, emailStatus.isSuccess, emailStatus.isError, navigate, emailStatus.message, dispatch])

    useEffect(() => {
        window.scrollTo(0, 0)

        if (resetCode) {
            localStorage.removeItem('resetCode')
        }

    }, [])


    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const [time, setTime] = useState(0);

    const timer = () => {

        const interval = setInterval(() => {
            setTime((prevTime) => prevTime + 1);

        }, 1000);

        const timeout = setTimeout(() => {
            setTime(0);
            clearInterval(interval);
            clearTimeout(timeout);
        }, 60000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };

    };

    const sendEmail = () => {

        if (!email) {
            toast.error('Insira um email válido', styleError)
            return
        }

        dispatch(sendResetEmail({ email }))
    }

    const sendResetCode = () => {

        if (!codigo) {
            return toast.error('Insira um código válido', styleError)

        }

        if (!email) {
            return toast.error('Insira um email válido', styleError)
        }

        if (codigo !== resetCode) {
            return toast.error('Código inválido', styleError)
        }

        setIsValidate(true)
        console.log(isValidate)
       
    }


    if(isValidate){
       return <NewPassword email={email} />

    }

    return (
        <>
            <Box sx={{
                backgroundColor: '#FAF8F8',
                minHeight: '100vh',
                paddingBottom: '120px'
            }}>
                <CssBaseline />
                <Container>

                    <Grid container spacing={2} p={matches ? 9 : 0} pt={9} >
                        <Grid item xs={12} lg={12}>
                            <div className="title">
                                <h1>Redefinir Senha</h1>
                                <p>
                                    Insira seu email e o código de verificação {matches ? <br /> : null}
                                    para redefinir sua senha.
                                </p>
                            </div>
                        </Grid>

                        <Grid item xs={12} lg={12} mt={5} >
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Email
                            </Typography>
                            <TextField
                                name="email"
                                autoComplete='email'
                                placeholder="apccap@gmail.com"
                                type="email"
                                onChange={onChange}
                                value={email}
                                fullWidth
                                sx={
                                    {
                                        '& .MuiInputBase-root': {
                                            borderRadius: '0px',
                                        },
                                    }
                                }

                            />

                            <Box sx={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'flex-end',
                                marginTop: '1rem'

                            }}>

                                {!time &&
                                    <button className='button-white' disabled={pending} style={{ backgroundColor: emailStatus.isLoading && '#FAF8F8' }} onClick={sendEmail}>
                                        {emailStatus.isLoading ? <CircularProgress size={20} color="success" /> : 'Enviar código'}
                                    </button>
                                }


                                {time > 0 &&   <button className='button-white'>Reenviar código em {60 - time} segundos</button>}



                            </Box>

                        </Grid>

                        <Grid item xs={12} lg={12} mt={5} >
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Código de verificação
                            </Typography>
                            <TextField
                                disabled={!resetCode}
                                id="codigo"
                                name="codigo"
                                placeholder="*******"
                                type="number"
                                onChange={onChange}
                                value={codigo}
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

                        <Grid item xs={12} lg={12}  >

                            <div className="esqueci-senha">
                                <Link to="/entrar" style={{ color: '#140C9F', textDecoration: 'none', cursor: 'pointer' }}>Fazer login</Link>
                            </div>

                        </Grid>

                        <Grid item xs={12} lg={12} mt={3} >
                            <Box sx={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'flex-end',

                            }}>
                                <button className='button-purple' onClick={sendResetCode} disabled={pending} style={{ backgroundColor: pending && '#FAF8F8' }} >
                                    {pending ? <CircularProgress size={20} color="success" /> : 'Validar código'}
                                </button>
                            </Box>

                        </Grid>

                    </Grid>
                </Container>

            </Box >

            <Footer />

        </>
    )
}

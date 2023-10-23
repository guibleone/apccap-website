import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../toastStyles'
import { useMediaQuery, Box, Container, Grid, Typography, TextField, CssBaseline, CircularProgress } from '@mui/material'
import Footer from '../../components/Footer/Footer'
import { resetEmailStatus, sendResetEmail } from '../../features/admin/adminSlice'
import { reset, resetPassword } from '../../features/auth/authSlice'

export default function NewPassword({ email }) {

    console.log(email)

    const matches = useMediaQuery('(min-width:600px)')
    const { user, pending, isSuccess, isError, message } = useSelector((state) => state.auth)

    const [formData, setFormData] = useState({
        password: '',
        password2: '',
    })

    const { password, password2 } = formData

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = (e) => {
        e.preventDefault()

        console.log(formData)

        if (password !== password2) {
            toast.error('As senhas não coincidem', styleError)
            return
        }

        const data = {
            email,
            password,
        }

        dispatch(resetPassword(data))

    }

    useEffect(() => {
        if (isSuccess) {
            navigate('/entrar')
            toast.success(message, styleSuccess)
        }

        if (isError) {
            toast.error(message, styleError)
        }

        dispatch(reset())

    }, [isSuccess, isError, message, navigate])

    useEffect(() => {

        window.scrollTo(0, 0)

    }
        , [])


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
                                    Insira sua nova senha e confirme {matches ? <br /> : null}
                                    em seguida.
                                </p>
                            </div>
                        </Grid>

                        <Grid item xs={12} lg={12} mt={5} >
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Nova senha
                            </Typography>
                            <TextField
                                name="password"
                                autoComplete='password'
                                placeholder="*******"
                                type="password"
                                onChange={onChange}
                                value={password}
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
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Confirme sua nova senha
                            </Typography>
                            <TextField
                                id="password2"
                                name="password2"
                                placeholder="*******"
                                type="password"
                                onChange={onChange}
                                value={password2}
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


                        <Grid item xs={12} lg={12} mt={3} >
                            <Box sx={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'flex-end',

                            }}>
                                <button className='button-purple' onClick={onSubmit} disabled={pending} style={{ backgroundColor: pending && '#FAF8F8' }} >
                                    {pending ? <CircularProgress size={20} color="success" /> : 'Salvar nova senha'}
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

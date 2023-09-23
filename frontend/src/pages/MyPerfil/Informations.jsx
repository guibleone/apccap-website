import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { reset, updateUser, addProfilePhoto, becomeProducer } from '../../features/auth/authSlice'
import './Styles.css'
import Resume from "./Resume"
import { getResume } from "../../features/resume/resumeSlice"
import { getDocuments } from "../../features/documents/documentsSlice"
import { Button, Stack, Avatar, Typography, Divider, Box, Container, CssBaseline, TextField, CircularProgress, Grid } from '@mui/material'
import { useMediaQuery } from "@mui/material"
import { styleError, styleSuccess } from '../toastStyles'


function Informations() {

    const matches = useMediaQuery('(max-width:600px)')

    const { user, pending, isError, isLoading, isSuccess, message } = useSelector((state) => state.auth)
    const fileInputRef = useRef(null);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [inputData, setInputData] = useState({
        id: user._id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        pathFoto: user.pathFoto,
        token: user.token,
        address: user.address

    })
    

    const { name, email, cpf } = inputData

    const { address } = inputData

    useEffect(() => {

        dispatch(getDocuments(user.token))
        dispatch(getResume(user.token))

        fileInputRef.current.value = null

    }, [])

    useEffect(() => {
        if (isError) {
            toast.error(message, styleError)
        }

        if (isSuccess) {
            toast.success('Dados atualizados com sucesso!', styleSuccess)
        }

        dispatch(reset())

    }, [isError, isSuccess, message, dispatch])


    const onChange = (e) => {
        const { name, value } = e.target
        setInputData({ ...inputData, [name]: value })
    }

    const handleChange = (e) => {
        e.preventDefault()

        dispatch(updateUser(inputData))
    }

    const handleFile = (e) => {
        e.preventDefault()

        dispatch(addProfilePhoto({ ...inputData, pathFoto: fileInputRef.current.files[0] }))

    }

    const onChangeAddress = (e) => {
        const { name, value } = e.target
        setInputData({ ...inputData, address: { ...inputData.address, [name]: value } })
    }

    const handleAddress = (e) => {
        e.preventDefault()

        dispatch(updateUser(inputData))
    }

      // se tornar produtor

      const handleBecomeProducer = () => {

        dispatch(becomeProducer(user.token))

    }

    return (
        <Container sx={{ minHeight: '100vh' }}>
            <CssBaseline />
            <Box>

                {user.status === '' ? 
                <>
                    <Button onClick={handleBecomeProducer} variant="outlined" color="info" fullWidth>Se torne um produtor!</Button>
                </> : 
                <>
                    <Button variant="contained" color="success" fullWidth href="/credencial-produtor">Credencial</Button>
                </>}


                <Divider sx={{ margin: '20px 0' }} />

                <Box sx={{ display: 'flex', flexDirection: matches ? 'column' : 'row', justifyContent: 'space-between' }}>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <Typography variant="h5" color="text.primary">Foto de Perfil</Typography>

                        {user.pathFoto ?
                            <>

                                <Avatar src={user.pathFoto ? user.pathFoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
                                    sx={{ width: 150, height: 150 }}
                                    variant="rounded"
                                />

                                <input type="file" ref={fileInputRef} />
                                <Button onClick={handleFile} variant="contained" disabled={pending} color="primary">
                                    {pending ? <CircularProgress size={25} color="success" /> : 'Atualizar'}
                                </Button>

                            </> :
                            <>

                                <Typography variant="body1" color="text.primary">Adicione uma foto de perfil</Typography>

                                <input type="file" ref={fileInputRef} />
                                <Button onClick={handleFile} variant="contained" disabled={pending} color="primary">
                                    {pending ? <CircularProgress size={25} color="success" /> : 'Atualizar'}
                                </Button>
                            </>
                        }
                    </Box>

                    <Divider orientation="vertical" variant="middle" flexItem />

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Typography variant="h5" color="text.primary">Dados Pessoais</Typography>

                        <form onSubmit={handleChange}>

                            <TextField sx={
                                { width: '100%', margin: '10px 0' }
                            } label='Nome' size="small" onChange={onChange} type="text" id="name" name="name" value={name} />

                            <TextField sx={
                                { width: '100%', margin: '10px 0' }
                            } label='Email' size="small" onChange={onChange} type="email" id="email" name="email" value={email} />


                            <TextField sx={
                                { width: '100%' }
                            } label='CPF' size="small" onChange={onChange} type="number" id="cpf" name="cpf" value={cpf} />


                            <Button sx={
                                { margin: '20px 0' }
                            } type="submit" fullWidth variant="contained" color="primary">Atualizar</Button>

                        </form>

                    </Box>

                </Box>


                <Divider sx={{ margin: '20px 0' }} />


                <Typography sx={
                    { margin: '20px 0', textAlign: 'center' }
                } variant="h5" color="text.primary">Endereço </Typography>


                <form onSubmit={handleAddress} >

                    <Stack spacing={2} direction={matches ? "column" : 'row'} alignItems="center">
                        <TextField label='CEP' size="small" fullWidth value={address ? address.cep : ''} type="number" name="cep" id="cep" placeholder="CEP" onChange={onChangeAddress} />

                        <TextField label='Logradouro' size="small" fullWidth value={address ? address.logradouro : ''} type="text" name="logradouro" id="logradouro" placeholder="Logradouro" onChange={onChangeAddress} />

                        <TextField label='Número' size="small" fullWidth value={address ? address.numero : ''} type="number" name="numero" id="numero" placeholder="Número" onChange={onChangeAddress} />

                        <TextField label='Complemento' size="small" fullWidth value={address ? address.complemento : ''} type="text" name="complemento" id="complemento" placeholder="Complemento" onChange={onChangeAddress} />
                    </Stack>

                    <Stack sx={{ margin: '10px 0' }} spacing={2} direction={"column"} alignItems="center">
                        <TextField label='Bairro' size="small" fullWidth value={address ? address.bairro : ''} type="text" name="bairro" id="bairro" placeholder="Bairro" onChange={onChangeAddress} />

                        <TextField fullWidth label='Cidade' size="small" value={address ? address.cidade : ''} type="text" name="cidade" id="cidade" placeholder="Cidade" onChange={onChangeAddress} />

                        <TextField fullWidth label='Estado' size="small" value={address ? address.estado : ''} type="text" name="estado" id="estado" placeholder="Estado" onChange={onChangeAddress} />

                    </Stack>

                    <Button fullWidth type="submit" variant="contained" color="primary">Atualizar</Button>

                </form>

                <Divider sx={{ margin: '20px 0' }} />

                <Resume />

                <Divider sx={{ margin: '20px 0' }} />
            </Box>

        </Container >

    )
}

export default Informations
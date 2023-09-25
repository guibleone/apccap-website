import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { getDocumentsData, getResumeData, getUserData, deleteUser, reset, aproveUser } from "../../features/admin/adminSlice"
import { downloadDocument } from '../../features/documents/documentsSlice'
import { FaDownload } from 'react-icons/fa'
import { Button, Stack, Avatar, Typography, Modal, Box, Container, CssBaseline, Divider, CircularProgress, Alert, useMediaQuery, TextareaAutosize, Grid } from '@mui/material';
import AccessLevel from "./AccessLevel"
import { toast } from 'react-toastify'
import Email from "../../components/Email/Email"
import SecretaryLevel from "./SecretaryLevel"
import PresidentLevel from "./PresidentLevel"


function UserSingle() {

    const { user } = useSelector((state) => state.auth)

    const { userData, resumeData, documentsData, isLoading, message, isError, isSuccess } = useSelector((state) => state.admin)

    const name = userData ? userData.name : ''
    const cpf = userData ? userData.cpf : ''
    const pathFoto = userData ? userData.pathFoto : ''
    const email = userData ? userData.email : ''

    const address = userData ? userData.address :
        {
            logradouro: '',
            cidade: '',
            estado: '',
            cep: '',
            numero: '',
            complemento: '',
            bairro: '',
        }


    const body = resumeData ? resumeData.body : ''

    const documents = documentsData ? documentsData : []

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()

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

    const styleBox1 = matches ? {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: '10px',
        padding: '10px 0'
    } : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        justifyItems: 'center',
        gap: '10px'
    }

    const styleBox2 = matches ? {
        display: 'flex',
        width: '100%',
        gap: '10px',
        flexDirection: 'column',
    } : {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyItems: 'center',
        gap: '10px'
    }

    const styleBox3 = matches ? {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        gap: '10px',
    } : {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyItems: 'center',
        gap: '10px'
    }

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    useEffect(() => {

        if (!user) {
            navigate('/')
        }
    
        if (user) {
            dispatch(getUserData({ id, token: user.token }))
            dispatch(getResumeData({ id, token: user.token }))
            dispatch(getDocumentsData({ id, token: user.token }))

            dispatch(reset())
        }

    }, [user])


    if (isLoading) {

        return <Box sx={
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FAF8F8',

            }
        }>
            <CircularProgress sx={
                {
                    marginBottom: '100px',
                }
            } size={100} />
        </Box>
    }
    if (user && user.role === 'secretario') {
        return <SecretaryLevel />
    }

    if (user && user.role === 'presidente') {
        return <PresidentLevel />
    }


    return (
        <Box sx={{
            backgroundColor: '#FAF8F8',
            paddingBottom: '120px',
        }}>

            <CssBaseline />

            <Container maxWidth='xl' >

                {user && userData.dados_pessoais && (
                    <>
                        <Grid rowSpacing={5} columnSpacing={{ xs: 8, sm: 6, md: 3 }} >

                            <Grid item md={4} sx={styleBox1}>

                                <Avatar src={userData.dados_pessoais ? userData.dados_pessoais.profilePhoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
                                    sx={{ width: 66, height: 66 }}

                                />


                                <Typography textAlign={'center'} variant="h5">{userData.dados_pessoais.name}</Typography>

                                {(userData._id !== id) && <Email email={userData.dados_pessoais.email} />}
                            </Grid>

                            <Divider sx={{ margin: '20px 0' }} />

                            <Grid item md={4} sx={styleBox2}>


                                <Typography variant="h5" component="div">Dados Pessoais</Typography>
                                <Typography variant="h7" component="div">CPF: {userData.dados_pessoais.cpf}</Typography>

                                <Typography variant="h5" component="div">Endereço</Typography>

                                {userData.dados_pessoais ? (
                                    <>
                                        <Typography variant="h7" component="div">{userData.dados_pessoais.cep ? `${userData.dados_pessoais.logradouro} ${userData.dados_pessoais.numero}` : 'Endereço não cadastrado'}</Typography>
                                        <Typography variant="h7" component="div">{userData.dados_pessoais.cep ? `${userData.dados_pessoais.cidade} - ${userData.dados_pessoais.estado}` : 'Endereço não cadastrado'}</Typography>
                                    </>
                                ) : (<Typography variant="h7" component="div">Endereço não cadastrado</Typography>)}

                            </Grid>

                            <Grid item md={4} sx={styleBox3}>
                                <Typography variant="h5" component="div">Resumo</Typography>
                                <Typography variant="h7" component="div">{body ? body : 'Nenhum resumo criado'}</Typography>
                            </Grid>

                            <Grid item md={4} sx={styleBox3}>

                                <Typography variant="h5" component="div">Documentos</Typography>
                                <Box sx={{ maxHeight: documents.length > 0 ? '200px' : '30px', paddingRight: '10px' }}>
                                    {documents.length > 0 ? documents.map((document) => (
                                        <Box sx={
                                            {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                width: '100%',
                                                border: '1px solid black',
                                                borderRadius: '5px',
                                                padding: '10px',
                                                margin: '10px 0'
                                            }
                                        } key={document._id}>
                                            <p>{document.name}</p>
                                            <Button variant="outlined" color="success" onClick={() => dispatch(downloadDocument(document))}>{<FaDownload />}</Button>
                                        </Box>

                                    )) : <p>Nenhum documento adicionado</p>

                                    }
                                </Box>

                            </Grid>

                            <Grid item md={4} sx={styleBox3}>
                                <Typography variant="h5" component="div">Alterar Acesso</Typography>
                                <AccessLevel id={id} token={user.token} />
                            </Grid>


                            <Box sx={
                                {
                                    display: 'flex',
                                    justifyContent: 'end',
                                    alignItems: 'center',
                                    gap: '10px',
                                }
                            }>
                                <Box>
                                    <Button color="error" variant="contained" onClick={handleOpen} disabled={user._id === id}>Excluir</Button>
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                                Tem certeza que deseja excluir?
                                            </Typography>
                                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                Voce não poderá desfazer essa ação.
                                                <Button onClick={handleClose}>Cancelar</Button>
                                                <Button color="error" onClick={() => (
                                                    dispatch(deleteUser({ id, token: user.token }),
                                                        (!isLoading && navigate('/'))
                                                    ))}>Excluir</Button>
                                            </Typography>
                                        </Box>
                                    </Modal>
                                </Box>

                                <div>
                                    <Button onClick={() => dispatch(aproveUser({ id, token: user.token }))} color="success" variant="contained" disabled={userData.status === 'aprovado' || user._id === id}>Aprovar</Button>
                                </div>

                            </Box>
                        </Grid>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', margin: '15px 0' }}>

                            {(userData.status === 'aprovado' && !isError)
                                ? <Alert severity="success">Usuário credenciado</Alert>
                                : <Alert severity="error">Usuário aguardando aprovação.</Alert>
                            }

                            {isError && <Alert severity="error">{message}</Alert>}

                        </Box>
                    </>)}
            </Container>

        </Box>

    )
}

export default UserSingle
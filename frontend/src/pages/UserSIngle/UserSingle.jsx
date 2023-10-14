import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { getDocumentsData, getResumeData, getUserData, deleteUser, reset, aproveUser } from "../../features/admin/adminSlice"
import { downloadDocument } from '../../features/documents/documentsSlice'
import { FaDownload } from 'react-icons/fa'
import { Button, Stack, Avatar, Typography, Modal, Box, Container, CssBaseline, Divider, CircularProgress, Alert, useMediaQuery, TextareaAutosize, Grid, TextField } from '@mui/material';
import AccessLevel from "./AccessLevel"
import { toast } from 'react-toastify'
import Email from "../../components/Email/Email"
import SecretaryLevel from "./SecretaryLevel"
import PresidentLevel from "./PresidentLevel"
import { colors } from '../colors'


function UserSingle() {

    const { user, isLoading: isLoadingAuth } = useSelector((state) => state.auth)

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


    if (isLoading || isLoadingAuth || !userData?.dados_pessoais?.name) {

        return <Box sx={
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.main_white,
                minHeight: '100vh'
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
            backgroundColor: colors.main_white,
            paddingBottom: '120px',
            minHeight: '100vh',
        }}>

            <CssBaseline />

            <Container maxWidth='xl' >
                <Grid container spacing={2} pb={5} pt={'72px'}>
                    <Grid item xs={12} md={12}>
                        <h3 style={{ color: '#000', fontWeight: 600 }}>
                            Gerencie os dados do usuário
                        </h3>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '15px',
                            alignItems: 'center',
                        }}>
                            <Avatar src={userData.dados_pessoais ? userData.dados_pessoais.profilePhoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
                                sx={{ width: 66, height: 66 }}

                            />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <h3 className='black bold'>
                                    {userData?.dados_pessoais?.name?.split(' ')[0]} {userData?.dados_pessoais?.name?.split(' ')[userData?.dados_pessoais?.name?.split(' ')?.length - 1]}
                                </h3>
                                <h3 className="regular black">
                                    {userData?.role === 'produtor_associado' ? 'Produtor Associado' : userData?.role.charAt(0)?.toUpperCase() + userData?.role?.slice(1)}
                                </h3>

                            </Box>

                        </Box>
                    </Grid>


                    <Grid item xs={12} md={6}>

                        <h3 style={{
                            fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                            textAlign: matches ? 'left' : 'center'
                        }} >
                            Alterar Acesso
                        </h3>

                        <AccessLevel id={id} token={user.token} />

                    </Grid>

                </Grid>


                {user && userData.dados_pessoais ? (

                    <>

                        <Grid container spacing={4} >


                            <Grid item xs={12} md={6}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                }}>

                                    <h3 style={{
                                        fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                                        textAlign: matches ? 'left' : 'center'
                                    }} >
                                        Dados Pessoais
                                    </h3>

                                    <Box sx={{
                                        display: 'flex',
                                        gap: '10px',
                                        flexWrap: 'wrap',
                                        flexDirection: 'column'
                                    }} >
                                        <div>
                                            <label style={{ fontWeight: 600 }}>Nome </label>
                                            <h4 className='regular black'>
                                                {userData?.dados_pessoais?.name}
                                            </h4>
                                        </div>

                                        <div>
                                            <label style={{ fontWeight: 600 }}>CPF</label>
                                            <h4 className='regular black'>
                                                {userData?.dados_pessoais?.cpf}
                                            </h4>
                                        </div>
                                        <div>
                                            <label style={{ fontWeight: 600 }}>Email</label>
                                            <h4 className='regular black'>
                                                {userData?.dados_pessoais?.email}
                                            </h4>
                                        </div>
                                        <div>
                                            <label style={{ fontWeight: 600 }}>Telefone</label>
                                            <h4 className='regular black'>
                                                {userData?.dados_pessoais?.telefone}
                                            </h4>
                                        </div>
                                        <div>
                                            <label style={{ fontWeight: 600 }}>Celular</label>
                                            <h4 className='regular black'>
                                                {userData?.dados_pessoais?.celular}
                                            </h4>
                                        </div>
                                        <div>
                                            <label style={{ fontWeight: 600 }}>CEP</label>
                                            <h4 className='regular black'>
                                                {userData?.dados_pessoais?.cep} <br />
                                            </h4>
                                        </div>
                                        <div>
                                            <label style={{ fontWeight: 600 }}>Endereço</label>
                                            <h4 className='regular black'>
                                                {userData?.dados_pessoais?.logradouro} , {userData?.dados_pessoais?.numero} - {userData?.dados_pessoais?.cidade} / {userData?.dados_pessoais?.estado}
                                            </h4>
                                        </div>
                                    </Box>

                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                }}>

                                    <h3 style={{
                                        fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                                        textAlign: matches ? 'left' : 'center'
                                    }} >
                                        Propriedade
                                    </h3>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: '10px',
                                        flexWrap: 'wrap',
                                        flexDirection: 'column'
                                    }} >

                                        <div>
                                            <label style={{ fontWeight: 600 }}>Nome </label>
                                            <h4 className='regular black'>
                                                {userData?.propriedade?.nome_propriedade}
                                            </h4>
                                        </div>

                                        <div>
                                            <label style={{ fontWeight: 600 }}>Área Total </label>
                                            <h4 className='regular black'>
                                                {userData?.propriedade?.area_total}
                                            </h4>
                                        </div>


                                        <div>
                                            <label style={{ fontWeight: 600 }}>CPF do Proprietário </label>
                                            <h4 className='regular black'>
                                                {userData?.propriedade?.cpfProprietario}
                                            </h4>
                                        </div>

                                        <div>
                                            <label style={{ fontWeight: 600 }}>CEP </label>
                                            <h4 className='regular black'>
                                                {userData?.propriedade?.cep_propriedade}
                                            </h4>
                                        </div>
                                        <div>
                                            <label style={{ fontWeight: 600 }}>Endereço </label>
                                            <h4 className='regular black'>
                                                {userData?.propriedade?.logradouro_propriedade} , {userData?.propriedade?.numero_propriedade} - {userData?.propriedade?.cidade_propriedade} / {userData?.propriedade?.estado_propriedade}
                                            </h4>
                                        </div>

                                        <div>
                                            <label style={{ fontWeight: 600 }}>Telefone</label>
                                            <h4 className='regular black'>
                                                {userData?.propriedade?.telefone_propriedade}
                                            </h4>
                                        </div>

                                        <div>
                                            <label style={{ fontWeight: 600 }}>Celular</label>
                                            <h4 className='regular black'>
                                                {userData?.propriedade?.celular_propriedade}
                                            </h4>
                                        </div>

                                        <div>
                                            <label style={{ fontWeight: 600 }}>Tempo de Produção</label>
                                            <h4 className='regular black'>
                                                {userData?.propriedade?.tempoProducao}
                                            </h4>
                                        </div>
                                    </Box>

                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                }}>

                                    <h3 style={{
                                        fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                                        textAlign: matches ? 'left' : 'center'
                                    }} >
                                        Marca
                                    </h3>


                                    <div>
                                        <label style={{ fontWeight: 600 }}>Site</label>
                                        <h4 className='regular black'>
                                            {userData?.marca?.site}
                                        </h4>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 600 }}>Instagram</label>
                                        <h4 className='regular black'>
                                            {userData?.marca?.instagram}
                                        </h4>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 600 }}>WhatsApp</label>
                                        <h4 className='regular black'>
                                            {userData?.marca?.whatsapp}
                                        </h4>
                                    </div>

                                    <div>

                                        <Avatar src={userData?.marca?.logo} alt="Logo da Marca"
                                            sx={{ width: 66, height: 66, }}
                                        />
                                    </div>

                                </Box>

                            </Grid>


                            <Grid item xs={12} md={6}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                }}>

                                    <h3 style={{
                                        fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                                        textAlign: matches ? 'left' : 'center'
                                    }} >
                                        Resumo da produção
                                    </h3>

                                    <div>

                                        <h4 className='regular black'>
                                            {body ? body : 'Nenhum resumo criado'}
                                        </h4>
                                    </div>


                                </Box>

                            </Grid>

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
                                <button className="button-white" onClick={handleOpen} disabled={user._id === id}>Excluir</button>
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
                                            <Button color="error" variant="outlined" onClick={() => (
                                                dispatch(deleteUser({ id, token: user.token }),
                                                    (!isLoading && navigate('/'))
                                                ))}>Excluir</Button>
                                        </Typography>
                                    </Box>
                                </Modal>
                            </Box>

                            <div>
                                <button className="button-purple" o onClick={() => dispatch(aproveUser({ id, token: user.token }))} color="success" disabled={userData.status === 'aprovado' || user._id === id}>Aprovar</button>
                            </div>

                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', margin: '15px 0' }}>

                            {(userData.status === 'aprovado' && !isError)
                                ? <Alert severity="success">Usuário credenciado</Alert>
                                : <Alert severity="error">Usuário aguardando aprovação.</Alert>
                            }

                            {isError && <Alert severity="error">{message}</Alert>}

                        </Box>

                    </>) : (
                    <Box sx={
                        {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.main_white,
                            minHeight: '100vh'
                        }
                    }>
                        <CircularProgress sx={
                            {
                                marginBottom: '100px',
                            }
                        } size={100} />
                    </Box>
                )}
            </Container>

        </Box>

    )
}

export default UserSingle
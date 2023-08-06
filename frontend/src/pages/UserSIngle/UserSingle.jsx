import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { getDocumentsData, getResumeData, getUserData, deleteUser, reset, aproveUser } from "../../features/admin/adminSlice"
import { downloadDocument } from '../../features/documents/documentsSlice'
import { FaDownload } from 'react-icons/fa'
import { Button, Stack, Avatar, Typography, Modal, Box, Container, CssBaseline, Divider, CircularProgress, Alert, isMuiElement, TextareaAutosize } from '@mui/material';
import AccessLevel from "./AccessLevel"
import { toast } from 'react-toastify'
import Email from "../../components/Email/Email"
import SecretaryLevel from "./SecretaryLevel"


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

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,

    }

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    useEffect(() => {

        dispatch(getUserData({ id, token: user.token }))
        dispatch(getResumeData({ id, token: user.token }))
        dispatch(getDocumentsData({ id, token: user.token }))

        dispatch(reset())

    }, [dispatch, id, user.token])


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

    if (user && user.role === 'secretario') {
        return <SecretaryLevel />
    }

    return (
        <Container sx={
            {
                height: '100vh',
            }
        }>

            <CssBaseline />

            <Stack spacing={3} direction="row" >
                <Avatar src={pathFoto ? pathFoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
                    sx={{ width: 56, height: 56 }}
                    variant="rounded"
                />
                <Typography variant="h5" component="div">{name}</Typography>

                {(user._id !== id) && <Email email={email} />}

            </Stack>

            <Stack spacing={2} direction="row" >

                <div>
                    <Typography variant="h5" component="div">Dados Pessoais</Typography>
                    <Typography variant="h7" component="div">CPF: {cpf}</Typography>
                </div>

                <div>
                    <Typography variant="h5" component="div">Endereço</Typography>

                    {address ? (
                        <>
                            <Typography variant="h7" component="div">{address ? `${address.logradouro} ${address.numero} - ${address.bairro}` : 'Endereço não cadastrado'}</Typography>
                            <Typography variant="h7" component="div">{address ? `${address.cidade} - ${address.estado}` : 'Endereço não cadastrado'}</Typography>
                        </>
                    ) : (<Typography variant="h7" component="div">Endereço não cadastrado</Typography>)}

                </div>

            </Stack>

            <div>
                <Typography variant="h5" component="div">Resumo</Typography>
                <Typography variant="h7" component="div">{body ? body : 'Nenhum resumo criado'}</Typography>
            </div>

            <Typography variant="h5" component="div">Documentos</Typography>


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
                    <Button variant="contained" color="success" onClick={() => dispatch(downloadDocument(document))}>{<FaDownload />}</Button>
                </Box>

            )) : <p>Nenhum documento adicionado</p>

            }

            <Box>
                <Typography variant="h5" component="div">Alterar Acesso</Typography>
                <AccessLevel id={id} token={user.token} />
            </Box>


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
                    <Button onClick={() => dispatch(aproveUser({ id, token: user.token }))} color="success" variant="contained" disabled={userData.status === true || user._id === id}>Aprovar</Button>
                </div>

            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', margin: '15px 0' }}>

                {(isSuccess && userData.status === true && !isError)
                    ? <Alert severity="success">{message ? message : 'Usuário credenciado.'}</Alert>
                    : <Alert severity="error">Usuário aguardando aprovação.</Alert>
                }

                {isError && <Alert severity="error">{message}</Alert>}

            </Box>

        </Container>

    )
}

export default UserSingle
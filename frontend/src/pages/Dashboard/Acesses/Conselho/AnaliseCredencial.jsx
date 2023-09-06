import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addRelatorys, deleteRelatorys, getDocumentsData, getUserData, resetStatus } from "../../../../features/admin/adminSlice"
import { Alert, Avatar, Box, Button, CircularProgress, Container, Divider, Grid, Typography, useMediaQuery } from "@mui/material"
import { AiOutlineDelete, AiOutlineDownload } from "react-icons/ai"
import { FcClock, FcPrivacy } from "react-icons/fc"
import { toast } from "react-toastify"
import { styleError, styleSuccess } from '../../../toastStyles'

export default function AnaliseCredencial() {
    const { id } = useParams()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
    const { userData, documentsData, isLoading, isSuccess, isError, message } = useSelector((state) => state.admin)

    const matches = useMediaQuery('(min-width:800px)')

    const fileInput = useRef(null)

    const recursoTime = userData.analise?.analise_pedido?.recurso?.time;

    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (recursoTime) {
            const targetDate = new Date(recursoTime);
            targetDate.setDate(targetDate.getDate() + 30);

            const interval = setInterval(() => {
                const now = new Date().getTime();
                const distance = targetDate.getTime() - now;

                if (distance <= 0) {
                    //dispatch(repproveRecurso())
                    setTimeLeft('Time has expired');
                    clearInterval(interval);
                } else {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    const timeLeftString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

                    setTimeLeft(timeLeftString);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [recursoTime]);


    // informação do documento
    const [documentData, setDocumentData] = useState({
        type: '',
        path: '',
        id,
        token: user.token
    })

    const onChange = (e) => {
        setDocumentData({ ...documentData, type: e.target.name, path: fileInput.current.files[0] })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!documentData.path) return toast.error('Selecione um arquivo', styleError)

        dispatch(addRelatorys(documentData))
    }

    const handleDelete = (type) => {

        const data = {
            id,
            token: user.token,
            type
        }

        dispatch(deleteRelatorys(data))
    }



    useEffect(() => {

        dispatch(getUserData({ id, token: user.token }))
        dispatch(getDocumentsData({ id, token: user.token }))

    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {

        if (isSuccess) {
            toast.success(message, styleSuccess)
        }

        if (isError) {
            toast.error(message, styleError)
        }

        dispatch(resetStatus())

    }, [isSuccess, isError, message])

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
                    marginBottom: '100px',
                }
            } size={100} />
        </Box>
    }


    return (
        <Container sx={{ minHeight: '100vh' }}>
            <Grid container spacing={2} sx={{ marginTop: '20px' }} >
                <Grid item xs={12} sm={8} lg={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Avatar sx={{ width: '100px', height: '100px' }} src={userData.pathFoto} />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={8} lg={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '5px' }}>
                        <Typography variant='h5'>{userData.name}</Typography>
                        <Typography variant='p'>{userData.email}</Typography>
                        <Typography variant='p'>CPF - {userData.cpf}</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={8} lg={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <Typography variant='h5'>Endereço</Typography>
                        {userData.address && (
                            <>
                                <Typography variant='p'>{userData.address.logradouro}, {userData.address.numero}</Typography>
                                <Typography variant='p'>{userData.address.cidade} / {userData.address.estado}</Typography>
                                <Typography variant='p'>{userData.address.cep}</Typography>
                            </>)}
                    </Box>
                </Grid>

                <Grid item xs={12} sm={12} lg={3} >
                    <Typography variant='h5'>Documentos</Typography>

                    <Box sx={{ height: '80px' }}>
                        {documentsData && documentsData.length > 0 ? documentsData.map((doc) => (
                            <>
                                <Box key={doc._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='p' noWrap>{doc.name}</Typography>
                                    <Button variant='outlined' color="success" href={doc.path} download={doc.name}><AiOutlineDownload /></Button>
                                </Box>

                                <Divider sx={{ margin: '5px 0' }} />
                            </>
                        )) : <Typography variant='p'>Nenhum documento enviado</Typography>}

                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ margin: '20px 0' }} />

            <Typography textAlign={'center'} variant='h5'>Etapas da Análise</Typography>

            <Grid container spacing={2} sx={{ marginTop: '20px', marginBottom: '40px' }} >

                <Grid item xs={12} sm={12} lg={3.9} >

                    <form name="analise_pedido" onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                            <Typography variant='h6'>Análise do pedido</Typography>
                            <Typography variant='p'>Parecer sobre os documentos do produtor</Typography>

                            {userData.analise && !userData.analise.analise_pedido.path ? (
                                <>
                                    <input onChange={onChange} type="file" name="analise_pedido" ref={fileInput} />
                                    <Button type="submit" variant="outlined" color="primary">Adicionar</Button>
                                </>) : (
                                <>
                                    {userData.analise && userData.analise.analise_pedido.status === 'pendente' &&
                                        <Box sx={{ display: 'flex' }}>
                                            <Button color="success" href={userData.analise && userData.analise.analise_pedido.path}><AiOutlineDownload size={25} /></Button>
                                            <Button onClick={() => handleDelete('analise_pedido')} color="error"><AiOutlineDelete size={25} /></Button>
                                        </Box>
                                    }

                                    {userData.analise && (
                                        <>
                                            {userData.analise.analise_pedido.status === 'pendente' &&
                                                <Alert severity="warning">Aguardando parecer da direção</Alert>
                                            }

                                            {userData.analise.analise_pedido.status === 'reprovado' &&
                                                <Alert severity="error">Relatório reprovado pela direção</Alert>
                                            }

                                            {userData.analise.analise_pedido.status === 'aprovado' &&
                                                <Alert severity="success">Análise de relatório concluída</Alert>
                                            }
                                        </>
                                    )}
                                </>

                            )}
                        </Box>
                    </form>


                </Grid>

                <Divider orientation="vertical" flexItem={matches} />

                <Grid item xs={12} sm={12} lg={3.9} >
                    <form name='vistoria' onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                            <Typography variant='h6'>Vistoria</Typography>
                            <Typography variant='p'>Parecer do técnico sobre a cadeia produtiva</Typography>

                            {(userData.analise && !userData.analise.vistoria.path) ?
                                (userData.analise && userData.analise.analise_pedido.status !== 'aprovado') ? (<FcPrivacy size={35} />) : (
                                    <>
                                        <input onChange={onChange} type="file" name="vistoria" id="vistoria" ref={fileInput} />
                                        <Button type="submit" variant="outlined" color="primary">Adicionar</Button>
                                    </>
                                )
                                : (
                                    <>
                                        {userData.analise && userData.analise.vistoria.status === 'pendente' &&
                                            <Box sx={{ display: 'flex' }}>
                                                <Button color="success" href={userData.analise && userData.analise.vistoria.path}><AiOutlineDownload size={25} /></Button>
                                                <Button onClick={() => handleDelete('vistoria')} color="error"><AiOutlineDelete size={25} /></Button>
                                            </Box>
                                        }
                                        {userData.analise && (
                                            <>
                                                {userData.analise.vistoria.status === 'pendente' &&
                                                    <Alert severity="warning">Aguardando parecer da direção</Alert>
                                                }

                                                {userData.analise.vistoria.status === 'reprovado' &&
                                                    <Alert severity="error">Relatório reprovado pela direção</Alert>
                                                }

                                                {userData.analise.vistoria.status === 'aprovado' &&
                                                    <Alert severity="success">Análise de relatório concluída</Alert>
                                                }
                                            </>
                                        )}
                                    </>
                                )}
                        </Box>
                    </form>
                </Grid>

                <Divider orientation={matches ? 'vertical' : ''} flexItem={matches} />

                <Grid item xs={12} sm={12} lg={3.8} >
                    <form name="analise_laboratorial" onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                            <Typography variant='h6'>Análise Laboratorial</Typography>
                            <Typography variant='p'>Parecer do laboratório credenciado</Typography>

                            {userData.analise && !userData.analise.analise_laboratorial.path ?
                                (userData.analise.analise_pedido.status !== 'aprovado' || userData.analise.vistoria.status !== 'aprovado') ? (<FcPrivacy size={35} />) : (
                                    <>
                                        <input onChange={onChange} type="file" name="analise_laboratorial" ref={fileInput} />
                                        <Button type="submit" variant="outlined" color="primary">Adicionar</Button>
                                    </>
                                ) : (
                                    <>
                                        {userData.analise && userData.analise.analise_laboratorial.status === 'pendente' &&
                                            <Box sx={{ display: 'flex' }}>
                                                <Button color="success" href={userData.analise && userData.analise.analise_laboratorial.path}><AiOutlineDownload size={25} /></Button>
                                                <Button onClick={() => handleDelete('analise_laboratorial')} color="error"><AiOutlineDelete size={25} /></Button>
                                            </Box>
                                        }

                                        {userData.analise && (
                                            <>
                                                {userData.analise.analise_laboratorial.status === 'pendente' &&
                                                    <Alert severity="warning">Aguardando parecer da direção</Alert>
                                                }

                                                {userData.analise.analise_laboratorial.status === 'reprovado' &&
                                                    <Alert severity="error">Relatório reprovado pela direção</Alert>
                                                }

                                                {userData.analise.analise_laboratorial.status === 'aprovado' &&
                                                    <Alert severity="success">Análise de relatório concluída</Alert>
                                                }
                                            </>
                                        )}
                                    </>
                                )}
                        </Box>
                    </form>
                </Grid>
            </Grid>

            <Divider sx={{ margin: '20px 0' }} />

            <Grid container spacing={2} >

                <Grid item xs={12} sm={12} lg={3} >
                    {userData.analise && userData.analise.analise_pedido.recurso.status &&
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='h6'>Recurso</Typography>
                            <Typography variant='p'>O produtor pode enviar um recurso sobre a análise do pedido</Typography>
                        </Box>
                    }
                </Grid>

                <Grid item xs={12} sm={12} lg={5.7} >
                    {userData.analise && userData.analise.analise_pedido.recurso.path === '' ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <FcClock size={50} />
                            <Typography variant='h6'>{timeLeft}</Typography>
                            <Typography variant='p'>Para invalidar recurso</Typography>
                        </Box>
                    ) :
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Button href={userData.analise && userData.analise.analise_pedido.recurso.path} target="_blank" variant='outlined' >Baixar Recurso</Button>
                            </Box>
                        </>}
                </Grid>

                <Grid item xs={12} sm={12} lg={2.3} >
                    {userData.analise && userData.analise.analise_pedido.recurso.status &&
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                            <Typography variant='h6'>Parecer do recurso</Typography>
                            <Button fullWidth disabled={userData.analise.analise_pedido.recurso.path === ''} variant="outlined" color="error">Reprovar</Button>
                            <Button fullWidth disabled={userData.analise.analise_pedido.recurso.path === ''} variant="outlined" color="success">Aprovar</Button>
                        </Box>
                    }

                </Grid>

            </Grid>


        </Container>
    )
}

import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addRelatorys, approveRecurso, approveRelatory, deleteRelatorys, getDocumentsData, getUserData, repproveRecurso, repproveRelatory, resetEmailStatus, sendRecursoEmail, sendRelatoryEmail } from "../../../../features/admin/adminSlice"
import { Alert, Avatar, Box, Button, CircularProgress, Container, Divider, Grid, Modal, TextField, Typography, useMediaQuery } from "@mui/material"
import { AiFillWarning, AiOutlineDelete, AiOutlineDownload } from "react-icons/ai"
import { FcClock, FcPrivacy } from "react-icons/fc"
import { toast } from "react-toastify"
import { styleError, styleSuccess } from '../../../toastStyles'
import { colors } from "../../../colors"

export default function AnaliseCredencial() {
    const { id } = useParams()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
    const { userData, documentsData, isLoading, isSuccess, isError, message, emailStatus } = useSelector((state) => state.admin)

    const matches = useMediaQuery('(min-width:800px)')

    const fileInput = useRef(null)

    const recursoTime = userData.analise?.analise_pedido?.recurso?.time;

    const [timeLeft, setTimeLeft] = useState('');

    const [openApprove, setOpenApprove] = useState(false)
    const [openRepprove, setOpenRepprove] = useState(false)
    const [type, setType] = useState('')

    const handleOpenApprove = () => setOpenApprove(!openApprove)
    const handleOpenRepprove = () => setOpenRepprove(!openRepprove)

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

    useEffect(() => {
        if (recursoTime) {
            const targetDate = new Date(recursoTime);
            targetDate.setDate(targetDate.getDate() + 30);

            const interval = setInterval(() => {
                const now = new Date().getTime();
                const distance = targetDate.getTime() - now;

                if (distance <= 0) {
                    const data = {
                        id,
                        token: user.token
                    }
                    dispatch(repproveRecurso(data))
                    setTimeLeft('Tempo esgotado!');
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

    const handleRepproveRecurso = () => {

        const data = {
            id,
            token: user.token
        }

        const emailData = {
            email: userData.dados_pessoais.email,
            result: 'REPROVADO'
        }

        dispatch(repproveRecurso(data)) && dispatch(sendRecursoEmail(emailData))
    }

    const handleApproveRecurso = () => {

        const data = {
            id,
            token: user.token
        }

        const emailData = {
            email: userData.dados_pessoais.email,
            result: 'REPROVADO'
        }

        dispatch(approveRecurso(data)) && dispatch(sendRecursoEmail(emailData))
    }


    const handleApprove = async () => {

        const data = {
            id: userData._id,
            type: type,
            token: user.token
        }

        const emailData = {
            email: userData.dados_pessoais.email,
            result: 'APROVADO',
            type: type
        }

        dispatch(approveRelatory(data)) && dispatch(sendRelatoryEmail(emailData))

        setOpenApprove(false)
    }

    const handleRepprove = async () => {
        const data = {
            id: userData._id,
            type: type,
            token: user.token
        }

        const emailData = {
            email: userData.dados_pessoais.email,
            result: 'REPROVADO',
            type: type
        }

        dispatch(repproveRelatory(data)) && dispatch(sendRelatoryEmail(emailData))

        setOpenRepprove(false)

    }

    useEffect(() => {

        dispatch(getUserData({ id, token: user.token }))
        dispatch(getDocumentsData({ id, token: user.token }))

    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {

        if (isError && !emailStatus.isError) {
            toast.error(message, styleError)
        }

        if (isSuccess && !emailStatus.isSuccess) {
            toast.success(message, styleSuccess)
        }

        if (emailStatus.isError) {
            toast.error('Erro ao enviar email', styleError)
        }

        if (emailStatus.isSuccess) {
            toast.success('Email enviado com sucesso', styleSuccess)
        }

        dispatch(resetEmailStatus())

    }, [isError, isSuccess, emailStatus.isError, emailStatus.isSuccess])

    if (isLoading) {

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


    return (
        <Box sx={{
            backgroundColor: colors.main_white,
            minHeight: '100vh',
        }}>
            {userData.dados_pessoais ? (<>
                <Container maxWidth='xl'>
                <Grid container spacing={2} p={matches ? 9 : 0} pt={!matches ? 9 : 2} >
                    <Grid item xs={12} lg={12}>
                        <div className='title'>
                            <Avatar src={userData.dados_pessoais ? userData.dados_pessoais.profilePhoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
                                sx={{ width: 66, height: 66 }}

                            />
                            <h2 className='black bold'>
                                {userData?.dados_pessoais?.name.split(' ')[0]} {userData?.dados_pessoais?.name.split(' ')[userData?.dados_pessoais?.name.split(' ').length - 1]}
                            </h2>

                            <h3 style={{textAlign:'center'}} className='regular black'>
                                Administre o precesso de credencimento do produtor
                            </h3>


                        </div>
                    </Grid>
                </Grid>

                    <Grid container spacing={2}  pt={!matches ? 9 : 2} >


                        <Grid item xs={12} md={3}>
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
                                <div>
                                    <label style={{ fontWeight: 600 }}>Nome </label>
                                    <h4 className='regular black'>
                                        {userData?.dados_pessoais?.name}
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
                                    <label style={{ fontWeight: 600 }}>Endereço</label>
                                    <h4 className='regular black'>
                                        {userData?.dados_pessoais?.cep} <br />
                                        {userData?.dados_pessoais?.logradouro} , {userData?.dados_pessoais?.numero} <br />
                                        {userData?.dados_pessoais?.cidade} / {userData?.dados_pessoais?.estado}
                                    </h4>
                                </div>

                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4} >


                            <h3 style={{
                                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                                textAlign: matches ? 'left' : 'center'
                            }} >
                                Propriedade
                            </h3>

                            <Box sx={{
                                display: 'flex',
                                
                                paddingTop: '10px',
                                gap: '20px'

                            }}>
                                <Box>
                                    <div>
                                        <label style={{ fontWeight: 600 }}>Nome </label>
                                        <h4 className='regular black'>
                                            {userData?.propriedade?.nome_propriedade}
                                        </h4>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 600 }}>CPF do proprietário </label>
                                        <h4 className='regular black'>
                                            {userData?.propriedade?.cpfProprietario}
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
                           
                                </Box>
                                <Box>

                                    <div>
                                        <label style={{ fontWeight: 600 }}>Endereço </label>
                                        <h4 className='regular black'>
                                            {userData?.propriedade?.logradouro_propriedade} , {userData?.propriedade?.numero_propriedade} <br />
                                            {userData?.propriedade?.cidade_propriedade} / {userData?.propriedade?.estado_propriedade}
                                        </h4>
                                    </div>


                                    <div>
                                        <label style={{ fontWeight: 600 }}>Área Total </label>
                                        <h4 className='regular black'>
                                            {userData?.propriedade?.area_total}
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
                        <Grid item xs={12} md={5}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>

                                <h3 style={{
                                    fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                                    textAlign: matches ? 'left' : 'center'
                                }} >
                                    Documentos
                                </h3>

                            </Box>

                            <Box >
                                {documentsData && documentsData.length > 0 ? documentsData.map((doc) => (
                                    <>
                                        <Box key={doc._id} sx={{ display: 'flex', justifyContent: 'space-between',paddingTop:'10px' }}>
                                            <h4 className='regular black'>{doc.name}</h4>
                                            <Button variant='outlined' color="success" href={doc.path} download={doc.name}><AiOutlineDownload /></Button>
                                        </Box>

                                        <Divider sx={{ margin: '5px 0' }} />
                                    </>
                                )) : <h4 >Nenhum documento enviado</h4>}

                            </Box>
                        </Grid>
                    </Grid>

    

                   
                  

                    <Grid container spacing={2} sx={{ marginTop: '20px', marginBottom: '40px' }} >
                        <Grid item xs={12} sm={12} lg={12} pb={4} >
                        <h3 style={{
                                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                                textAlign: matches ? 'left' : 'center'
                            }} >
                                Etapas da análise
                            </h3>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={3.9} >

                            <form name="analise_pedido" onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                                    <h3 >Análise do pedido</h3>
                                    <h4 style={{textAlign:'center'}} className="regular black">Parecer sobre os documentos do produtor</h4>

                                    {userData.analise && !userData.analise.analise_pedido.path ? (
                                        <>
                                            <TextField size="small" type='file' onChange={onChange} name="analise_pedido" inputRef={fileInput} />
                                            <button type="submit" className="button-purple">Adicionar</button>
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
                                                        <Box sx={{ display: 'flex', gap: '5px' }}>
                                                            <Button onClick={() => { handleOpenRepprove(); setType('analise_pedido'); }} color='error'>Reprovar</Button>
                                                            <Button onClick={() => { handleOpenApprove(); setType('analise_pedido'); }} color='success'>Aprovar</Button>
                                                        </Box>
                                                    }

                                                    {userData.analise && userData.analise.analise_pedido.status === 'aprovado' &&
                                                        <>
                                                            <Alert severity="success">Análise aprovada !</Alert>
                                                        </>
                                                    }
                                                    {userData.analise && userData.analise.analise_pedido.status === 'reprovado' &&
                                                        <>
                                                            <Alert severity="error">Análise reprovada !</Alert>
                                                        </>
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

                                    <h3 >Vistoria</h3>
                                    <h4 style={{textAlign:'center'}}  className="regular black" >Parecer do técnico sobre a cadeia produtiva</h4>

                                    {(userData.analise && !userData.analise.vistoria.path) ?
                                        (userData.analise && userData.analise.analise_pedido.status !== 'aprovado') ? (<FcPrivacy size={35} />) : (
                                            <>
                                                <TextField size="small"  onChange={onChange} type="file" name="vistoria" id="vistoria" inputRef={fileInput} />
                                                <button type="submit" className="button-purple">Adicionar</button>
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
                                                        {userData.analise.vistoria.status === 'pendente' && <>
                                                            <Box sx={{ display: 'flex', gap: '5px' }}>
                                                                <Button onClick={() => { handleOpenRepprove(); setType('vistoria'); }} color='error'>Reprovar</Button>
                                                                <Button onClick={() => { handleOpenApprove(); setType('vistoria'); }} color='success'>Aprovar</Button>
                                                            </Box>
                                                        </>
                                                        }
                                                        {userData.analise && userData.analise.vistoria.status === 'aprovado' &&
                                                            <>
                                                                <Alert severity="success">Análise aprovada !</Alert>
                                                            </>
                                                        }
                                                        {userData.analise && userData.analise.vistoria.status === 'reprovado' &&
                                                            <>
                                                                <Alert severity="error">Análise reprovada !</Alert>
                                                            </>
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

                                    <h3 >Análise Laboratorial</h3>
                                    <h4 style={{textAlign:'center'}}  className="regular black" >Parecer do laboratório credenciado</h4>

                                    {userData.analise && !userData.analise.analise_laboratorial.path ?
                                        (userData.analise.analise_pedido.status !== 'aprovado' || userData.analise.vistoria.status !== 'aprovado') ? (<FcPrivacy size={35} />) : (
                                            <>
                                                <TextField size="small"  onChange={onChange} type="file" name="analise_laboratorial" inputRef={fileInput} />
                                                <button type="submit" className="button-purple">Adicionar</button>
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
                                                        {userData.analise && userData.analise.analise_laboratorial.status === 'pendente' &&
                                                            <Box sx={{ display: 'flex', gap: '5px' }}>
                                                                <Button onClick={() => { handleOpenRepprove(); setType('analise_laboratorial'); }} color='error'>Reprovar</Button>
                                                                <Button onClick={() => { handleOpenApprove(); setType('analise_laboratorial'); }} color='success'>Aprovar</Button>
                                                            </Box>
                                                        }
                                                        {userData.analise && userData.analise.analise_laboratorial.status === 'aprovado' &&
                                                            <>
                                                                <Alert severity="success">Análise aprovada !</Alert>
                                                            </>
                                                        }
                                                        {userData.analise && userData.analise.analise_laboratorial.status === 'reprovado' &&
                                                            <>
                                                                <Alert severity="error">Análise reprovada !</Alert>
                                                            </>
                                                        }
                                                    </>
                                                )}
                                            </>
                                        )}
                                </Box>
                            </form>
                        </Grid>
                    </Grid>

           
                    <Grid container spacing={2} >

                        <Grid item xs={12} sm={12} lg={3} >
                            {userData.analise && userData.analise.analise_pedido.recurso.status &&
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <h4 >Recurso</h4>
                                    <h4 >O produtor pode enviar um recurso sobre a análise do pedido</h4>
                                </Box>
                            }
                        </Grid>

                        <Grid item xs={12} sm={12} lg={5.7} >
                            {userData.analise && userData.analise.analise_pedido.recurso.status && <>
                                {userData.analise.analise_pedido.recurso.path === '' ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <FcClock size={50} />
                                        <h4 >{timeLeft}</h4>
                                        <h4 >Para invalidar recurso</h4>
                                    </Box>
                                ) :
                                    <>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <h4 >Recurso Produtor</h4>
                                            <Button href={userData.analise && userData.analise.analise_pedido.recurso.path} target="_blank" variant='outlined' >Baixar Recurso</Button>
                                        </Box>
                                    </>
                                }
                            </>}
                        </Grid>

                        <Grid item xs={12} sm={12} lg={2.3} >
                            {userData.analise && userData.analise.analise_pedido.recurso.status &&
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>

                                    <h4 >Parecer do recurso</h4>

                                    {userData.analise.analise_pedido.recurso.status === 'pendente' &&
                                        <>
                                            {emailStatus.isLoading ? <CircularProgress sx={{ margin: '20px' }} size={60} /> :
                                                <>
                                                    <Button
                                                        fullWidth
                                                        disabled={userData.analise.analise_pedido.recurso.path === ''}
                                                        onClick={handleRepproveRecurso} variant="outlined" color="error">Reprovar</Button>
                                                    <Button
                                                        fullWidth
                                                        disabled={userData.analise.analise_pedido.recurso.path === ''}
                                                        onClick={handleApproveRecurso} variant="outlined" color="success">Aprovar</Button>
                                                </>
                                            }
                                        </>
                                    }

                                    {userData.analise.analise_pedido.recurso.status === 'reprovado' &&
                                        <>
                                            <Alert severity="error">Recurso reprovado</Alert>
                                        </>
                                    }

                                    {userData.analise.analise_pedido.recurso.status === 'aprovado' &&
                                        <>
                                            <Alert severity="success">Recurso Aprovado</Alert>
                                        </>
                                    }

                                </Box>


                            }

                        </Grid>

                    </Grid>


                    <Modal
                        open={openApprove}
                        onClose={handleOpenApprove}
                    >
                        <Box sx={style}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                <Box display={'flex'} justifyContent={'space-between'}>
                                    <h4 variant="h6" >Tem certeza ? </h4>
                                    <AiFillWarning color='red' size={30} />
                                </Box>

                                <h4 variant="h7" > Essa ação é permanente. </h4>
                                <h4 color='error' variant="p" > Será enviado um email ao produtor.</h4>

                                <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <Button color='error' variant='contained' onClick={handleOpenApprove}>Cancelar</Button>

                                    <Button
                                        disabled={isLoading}
                                        color="success"
                                        variant='contained'
                                        onClick={handleApprove}
                                    >
                                        {isLoading ? <CircularProgress color="success" size={24} /> : 'Aprovar'}
                                    </Button>

                                </Box>
                            </Box>
                        </Box>
                    </Modal>


                    <Modal
                        open={openRepprove}
                        onClose={handleOpenRepprove}
                    >
                        <Box sx={style}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                <Box display={'flex'} justifyContent={'space-between'}>
                                    <h4 variant="h6" >Tem certeza ? </h4>
                                    <AiFillWarning color='red' size={30} />
                                </Box>

                                <h4 variant="h7" > Essa ação é permanente. </h4>
                                <h4 color='error' variant="p" > Será enviado um email ao produtor.</h4>

                                <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <Button color='error' variant='contained' onClick={handleOpenRepprove}>Cancelar</Button>

                                    <Button
                                        disabled={isLoading}
                                        color="success"
                                        variant='contained'
                                        onClick={handleRepprove}
                                    >
                                        {isLoading ? <CircularProgress color="success" size={24} /> : 'Reprovar'}
                                    </Button>

                                </Box>
                            </Box>
                        </Box>
                    </Modal>


                </Container>
            </>) : (<><Box sx={
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
            </Box> </>)}
        </Box>
    )
}

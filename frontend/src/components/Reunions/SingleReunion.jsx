import { Alert, Box, Button, Checkbox, CircularProgress, Container, Grid, Modal, Typography, useMediaQuery } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { colors } from '../../pages/colors'
import { useDispatch, useSelector } from 'react-redux'
import { addReunionAta, finishReunion, getOneReunion, handleVoto, presenceList, reset, signAta } from '../../features/reunion/reunionSlice'
import { Link, useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { styleError, styleSuccess } from '../../pages/toastStyles'
import { toast } from 'react-toastify'
import { BsInfoCircle, BsPen } from 'react-icons/bs'
import { AiFillBook, AiOutlineDropbox } from 'react-icons/ai'
import { FcCancel, FcCheckmark } from 'react-icons/fc'

export default function SingleReunion() {

    const matches = useMediaQuery('(min-width:600px)')

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


    // incializar o redux
    const { user } = useSelector((state) => state.auth)
    const { reunionData, isLoading, isSuccess, isError, message } = useSelector((state) => state.reunions)
    const dispatch = useDispatch()

    const { id } = useParams()

    const [assinaturas, setAssinaturas] = useState([])
    const [members, setMembers] = useState([])
    const [expectedAssinaturas, setExpectedAssinaturas] = useState([])

    const [openAta, setOpeneAta] = useState(false)
    const handleOpenAta = () => setOpeneAta(!openAta)

    const [openDelete, setOpenDelete] = useState(false)
    const handleOpenDelete = () => setOpenDelete(!openDelete)

    const [openDetailsSign, setOpenDetailsSign] = useState(false)
    const handleOpenDetailsSign = () => setOpenDetailsSign(!openDetailsSign)

    const [openList, setOpenList] = useState(false)
    const handleOpenList = () => setOpenList(!openList)

    // concluir reunião
    const handleFinishReunion = () => {

        const reunions = {
            id,
            token: user.token
        }

        dispatch(finishReunion(reunions))

    }

    const [file, setFile] = useState(null)

    // on drop arquivos
    const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {

        if (rejectedFiles.length > 0) {
            // Handle files with invalid extensions here
            console.error('Arquivos inválidos', rejectedFiles);
            return;
        }

        setFile(acceptedFiles)
    }, []);

    // configurações do dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'application/pdf',
        multiple: false,
    });

    const handleAddAta = () => {

        if (!file) return toast.error('Selecione um arquivo', styleError)

        const reunionData = {
            id,
            ata: file[0],
            token: user.token
        }

        dispatch(addReunionAta(reunionData))

        handleOpenAta()

        setFile(null)


    }

    // lista de presença

    const [presence, setPresence] = useState({});

    const togglePresence = (member) => {
        setPresence((prevPresence) => ({
            ...prevPresence,
            [member]: !prevPresence[member],
        }));
    };

    const handlePresenceList = () => {

        const reunionData = {
            id,
            presence,
            token: user.token
        }

        dispatch(presenceList(reunionData))

        handleOpenList()

        setPresence({})



    }

    // ver pauta 

    const [pauta, setPauta] = useState({})
    const [indexPauta, setIndexPauta] = useState(0)
    const [openPauta, setOpenPauta] = useState(false)
    const handleOpenPauta = () => setOpenPauta(!openPauta)

    // votos

    const [voto, setVoto] = useState('')

    const submitVoto = (e) => {
        e.preventDefault();

        const selectedVoto = e.target.name;

        const data = {
            id,
            token: user.token,
            name: `${user.dados_pessoais.name} - ${user.role}`,
            voto: selectedVoto,
            pauta: indexPauta
        };

        console.log(data)

        dispatch(handleVoto(data))
        handleOpenPauta()

        setVoto(selectedVoto);
    }



    useEffect(() => {

        window.scrollTo(0, 0)

    }, [])


    useEffect(() => {

        const reunionData = {
            id,
            token: user.token
        }

        dispatch(getOneReunion(reunionData))

    }, [])

    useEffect(() => {

        if (isError) {
            toast.error(message, styleError)
        }

        if (isSuccess) {
            toast.success(message, styleSuccess)
        }

        dispatch(reset())


    }, [isError, isSuccess])


    if (isLoading) return <Box sx={
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



    return (
        <Box sx={{
            backgroundColor: colors.main_white,
            minHeight: '100vh',
        }}>
            <Container maxWidth='xl'>

                <Grid container spacing={2} pb={5}>
                    <Grid item xs={12} md={12}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '72px 0',
                            gap: '10px'
                        }}>
                            <h1 className='bold black'>
                                Reunião {reunionData?.title}
                            </h1>
                            <h5 className='regular black'>
                                Gerencie a reunião como {user?.role}
                            </h5>

                            <h5 className='italic'>
                                {reunionData?.status}
                            </h5>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} pb={5}>
                    <Grid item xs={12} md={3}>
                        <Box sx={{
                            maxHeight: '500px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <h2 className='bold black'>
                                Membros Convocados
                            </h2>
                            {reunionData?.membros?.convocados.map((member, index) => {
                                return (
                                    <h3 className='regular black' key={index}>
                                        {member}
                                    </h3>
                                )
                            })}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <h2 className='bold black'>
                                Informações
                            </h2>
                            <h3 className='regular black'>
                                {reunionData?.date}
                            </h3>
                            <h3 className='regular black'>
                                {reunionData?.message}
                            </h3>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <h2 className='bold black'>
                                Pautas
                            </h2>

                            {reunionData?.pautas?.length > 0 ? reunionData?.pautas?.map((pauta, index) => {
                                return (
                                    <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column' }} key={index}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px'
                                        }}>
                                            <h3 className='regular black'>
                                                {pauta.title}
                                            </h3>

                                            <Link className='regular black italic' onClick={() => { handleOpenPauta(); setPauta(pauta); setIndexPauta(index) }}>
                                                <h5>Ver Pauta</h5>
                                            </Link>

                                        </Box>

                                        {/** <button 
                                        disabled={reunionData.status === 'agendada'}
                                        style={{
                                            cursor: reunionData.status === 'agendada' ? 'not-allowed' : 'pointer',
                                            backgroundColor: reunionData.status === 'agendada' ? '#ccc' : colors.main_purple,
                                        }}
                                        className='button-purple' 
                                        onClick={() => window.location.href = pauta.path} >Votos</button>
                                        */}
                                    </Box>
                                )

                            }) : 'Sem pautas discutidas'
                            }

                        </Box>

                    </Grid>



                    <Grid item xs={12} md={3}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <h2 className='bold black'>
                                Documentos
                            </h2>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>


                                {reunionData?.pathPdf ? <button className='button-purple' onClick={() => window.location.href = reunionData?.pathPdf} target='_blank' >PDF</button> : 'Sem PDF da reunião'}

                                {reunionData?.ata?.path ? <button className='button-purple' onClick={() => window.location.href = reunionData?.ata?.path} target='_blank' >Ata</button> : 'Sem ata adicionada'}

                            </Box>

                        </Box>
                    </Grid>


                </Grid>



                <Grid container spacing={2} pb={5}>
                    <Grid item xs={12}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                        }}>

                            {reunionData?.ata?.path && (
                                <Box sx={{ display: 'flex', gap: '5px' }}>
                                    <Link sx={{ cursor: 'pointer' }} onClick={() => { handleOpenDetailsSign(); setAssinaturas(reunionData?.ata?.assinaturas); setExpectedAssinaturas(reunionData?.membros?.presentes) }}>
                                        Assinaturas
                                    </Link>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                {user.role === 'presidente' && (
                                    <Grid container spacing={2}>
                                        {reunionData && reunionData?.status === 'nao_assinada' && reunionData?.ata?.path && (
                                            <>
                                                <Grid item xs={12} lg={12}>
                                                    <Box sx={{ display: 'flex', gap: '5px' }}>
                                                        {reunionData?.ata?.path && !reunionData.ata?.assinaturas.includes((`${user.dados_pessoais.name} - ${user.role}`)) && reunionData?.membros?.presentes.includes(`${user.dados_pessoais.name} - ${user.role}`) && (
                                                            <Button variant='outlined' color='success' onClick={() => {
                                                                const data = {
                                                                    id: reunionData._id,
                                                                    memberName: `${user.dados_pessoais.name} - ${user.role}`,
                                                                    token: user.token
                                                                }
                                                                dispatch(signAta(data))
                                                            }}>Assinar</Button>
                                                        )}
                                                    </Box>
                                                </Grid>
                                                {!reunionData?.ata === 'assinada' && reunionData?.ata?.assinaturas.includes(`${user.dados_pessoais.name} - ${user.role}`) && (
                                                    <Grid item xs={12} lg={7}>
                                                        <Alert severity="success" >
                                                            Assinado
                                                        </Alert>
                                                    </Grid>
                                                )}
                                            </>
                                        )}
                                        {reunionData && reunionData.status === 'requer_ata' && !reunionData?.ata?.path && !reunionData?.membros?.faltantes.includes(`${user.dados_pessoais.name} - ${user.role}`) && (
                                            <Grid item xs={12} lg={12}>
                                                <Alert severity="warning">Aguardando Ata</Alert>
                                            </Grid>
                                        )}
                                        {reunionData && reunionData.membros && reunionData.membros.faltantes.includes(`${user.dados_pessoais.name} - ${user.role}`) && (
                                            <Grid item xs={12} lg={12}>
                                                <Alert severity="error" >
                                                    <Typography variant='h7'>Você faltou</Typography>
                                                </Alert>
                                            </Grid>
                                        )}
                                        {reunionData && reunionData.status === 'agendada' && (
                                            <Grid item xs={12} lg={12}>
                                                <Button variant='outlined' color='success' onClick={() => handleFinishReunion()} >Concluir</Button>
                                            </Grid>
                                        )}
                                        {reunionData && reunionData.status === 'assinada' && (
                                            <Grid item xs={12} lg={12}>
                                                <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                                    <Alert severity="success">Ata Assinada</Alert>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}
                                {user.role === 'secretario' && (
                                    <Grid container spacing={2}>
                                        {reunionData?.ata?.path ? (
                                            <></>
                                        ) : (
                                            <Grid item xs={12} lg={12}>
                                                {reunionData?.membros && reunionData?.membros?.convocados.length > 0 && reunionData?.membros?.presentes.length < 1 ? (
                                                    <Button variant='outlined' color='warning' onClick={() => { handleOpenList(); setMembers(reunionData?.membros?.convocados); }} >
                                                        Lista de Presença
                                                    </Button>
                                                ) : (
                                                    <Button variant='outlined' color='success' onClick={() => { handleOpenAta(); setFile(null); }} >Adicionar Ata</Button>
                                                )}
                                            </Grid>
                                        )}
                                        {reunionData?.ata?.path && !reunionData.ata?.assinaturas.includes((`${user.dados_pessoais.name} - ${user.role}`)) && reunionData?.membros?.presentes.includes(`${user.dados_pessoais.name} - ${user.role}`) && (
                                            <Grid item xs={12} lg={6}>
                                                <Button variant='outlined' color='success' onClick={() => {
                                                    const data = {
                                                        id: reunionData._id,
                                                        memberName: `${user.dados_pessoais.name} - ${user.role}`,
                                                        token: user.token
                                                    }
                                                    dispatch(signAta(data))
                                                }}>Assinar</Button>
                                            </Grid>
                                        )}
                                        {reunionData?.ata !== 'assinada' && reunionData?.ata?.assinaturas.includes(`${user.dados_pessoais.name} - ${user.role}`) && (
                                            <Grid item xs={12} lg={12}>
                                                <Alert severity="success" >
                                                    Assinado
                                                </Alert>
                                            </Grid>
                                        )}
                                        {reunionData?.membros && reunionData?.membros?.faltantes.includes(`${user.dados_pessoais.name} - ${user.role}`) && (
                                            <Grid item xs={12} lg={12}>
                                                <Alert severity="error" >
                                                    <Typography variant='h7'>Você faltou</Typography>
                                                </Alert>
                                            </Grid>
                                        )}
                                        {reunionData?.status === 'assinada' && (
                                            <Grid item xs={12} lg={12}>
                                                <Alert severity="success">Ata Assinada</Alert>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}
                                {user.role !== 'presidente' && user.role !== 'secretario' && (
                                    <Grid container spacing={2}>
                                        {reunionData?.ata?.path && (
                                            <></>
                                        )}
                                        {reunionData?.ata?.path && !reunionData.ata?.assinaturas.includes((`${user.dados_pessoais.name} - ${user.role}`)) && reunionData?.membros?.presentes.includes(`${user.dados_pessoais.name} - ${user.role}`) && (
                                            <Grid item xs={12} lg={6}>
                                                <Button variant='outlined' color='success' onClick={() => {
                                                    const data = {
                                                        id: reunionData._id,
                                                        memberName: `${user.dados_pessoais.name} - ${user.role}`,
                                                        token: user.token
                                                    }
                                                    dispatch(signAta(data))
                                                }}>Assinar</Button>
                                            </Grid>
                                        )}
                                        {!reunionData?.ata === 'assinada' && reunionData?.ata?.assinaturas.includes(`${user.dados_pessoais.name} - ${user.role}`) && (
                                            <Grid item xs={12} lg={7}>
                                                <Alert severity="success" >
                                                    Assinado
                                                </Alert>
                                            </Grid>
                                        )}
                                        {reunionData?.membros && reunionData?.membros?.faltantes.includes(`${user.dados_pessoais.name} - ${user.role}`) && (
                                            <Grid item xs={12} lg={12}>
                                                <Alert severity="error" >
                                                    <Typography variant='h7'>Você faltou</Typography>
                                                </Alert>
                                            </Grid>
                                        )}
                                        {reunionData?.status === 'assinada' && (
                                            <Grid item xs={12} lg={12}>
                                                <Alert severity="success">Ata Assinada</Alert>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}
                            </Box>

                        </Box>

                    </Grid>

                </Grid>


                <Modal
                    open={openAta}
                >
                    <Box sx={style}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <Box display={'flex'} justifyContent={'space-between'}>
                                <Typography variant="h6" >Selecione um documento </Typography>
                                <AiFillBook size={30} />
                            </Box>

                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                                p: 1,
                                border: isDragActive ? '1px solid #E4E3E3' : '',
                                borderRadius: '5px',
                                boxShadow: isDragActive ? '0px 0px 5px 0px rgba(0,0,0,0.75)' : '',
                            }} {...getRootProps()}>
                                <input multiple {...getInputProps()} />
                                <Button variant='outlined' color='success'><AiOutlineDropbox size={80} /> </Button>
                                <Typography textAlign={'center'} variant='p'>Arraste e solte o arquivo ou clique para selecionar</Typography>
                            </Box>

                            {file && <Typography textAlign={'center'} variant='p'>Arquivo selecionado: {file[0].name}</Typography>}

                            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <Button color='error' variant='outlined' onClick={handleOpenAta}>Cancelar</Button>

                                <Button
                                    disabled={isLoading}
                                    color="success"
                                    variant='outlined'
                                    onClick={handleAddAta}
                                >
                                    {isLoading ? <CircularProgress color="success" size={24} /> : 'Adicionar'}
                                </Button>

                            </Box>
                        </Box>
                    </Box>
                </Modal>


                {
                    <Modal
                        open={openDetailsSign}
                    >
                        <Box sx={style}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                            }}>

                                <Box display={'flex'} justifyContent={'space-between'}>
                                    <Typography variant="h6" >Status das assinaturas </Typography>
                                    <BsPen size={30} />
                                </Box>

                                {assinaturas && assinaturas.length > 0 ?
                                    expectedAssinaturas.map((assinatura, index) => (
                                        <Box key={index} sx={{ display: 'flex', gap: '5px' }}>
                                            <Typography variant='p'>{assinatura.charAt(0).toUpperCase() + assinatura.slice(1)}
                                                {assinaturas.includes(assinatura) ?
                                                    <FcCheckmark style={{ verticalAlign: 'bottom' }} size={30} />
                                                    :
                                                    <FcCancel style={{ verticalAlign: 'bottom' }} size={30} />
                                                }
                                            </Typography>
                                        </Box>
                                    ))
                                    :
                                    <Typography variant='p'>Nenhuma assinatura</Typography>
                                }


                                <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <Button color='info' variant='outlined' onClick={handleOpenDetailsSign}>Voltar</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Modal>
                }


                <Modal
                    open={openList}
                >
                    <Box sx={style}>

                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Typography variant="h6" >Presença dos convocados </Typography>
                            <BsPen size={30} />
                        </Box>

                        <Box sx={{ maxHeight: '300px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {reunionData && reunionData?.membros?.convocados?.length > 0 ? (
                                    reunionData?.membros?.convocados?.map((member, index) => (
                                        <Box key={index} sx={{ display: 'flex', gap: '5px' }}>
                                            <Typography variant="body1">
                                                {member}
                                                <Checkbox
                                                    checked={presence[member] || false}
                                                    onChange={() => togglePresence(member)}
                                                />
                                            </Typography>

                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body1">Nenhum membro</Typography>
                                )}
                            </Box>
                        </Box>


                        <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <Button color='info' variant='outlined' onClick={handleOpenList}>Voltar</Button>
                            <Button color='success' variant='outlined' onClick={handlePresenceList}>Salvar</Button>
                        </Box>
                    </Box>

                </Modal >

                <Modal open={openPauta} onClose={handleOpenPauta}>
                    <Box sx={style}>
                        <Grid container spacing={2} >
                            <Grid item xs={12} md={12}>
                                <Box display={'flex'} justifyContent={'space-between'}>
                                    <h2 className='bold black'>
                                        {pauta?.title}
                                    </h2>
                                    <BsInfoCircle size={30} />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <h3 className='medium black'>
                                    {pauta?.description}
                                </h3>
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <h3 className='semi-bold black'>
                                    Votos
                                </h3>

                                <Box sx={{
                                    display: 'flex',
                                    gap: '10px'
                                }}>
                                    <h3 className='regular black'>
                                        A favor: {pauta?.votos?.favor.length}
                                    </h3>

                                    <h3 className='regular black'>
                                        Contra: {pauta?.votos?.contra.length}
                                    </h3>
                                </Box>
                            </Grid>


                            <Grid item xs={12} md={12}>
                                <Box sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    justifyContent: 'flex-end'
                                }}>
                                    {reunionData?.membros?.presentes.includes(`${user.dados_pessoais.name} - ${user.role}`) ? (<>
                                        {user?.credencial === 'active' && (pauta?.votos?.favor.includes(`${user.dados_pessoais.name} - ${user.role}`) || pauta?.votos?.contra.includes(`${user.dados_pessoais.name} - ${user.role}`)) ? (
                                            <Alert severity="success">Voto submetido.</Alert>
                                        ) : (<>
                                            <button name='contra' onClick={submitVoto} className='button-white' >Contra</button>
                                            <button name='favor' onClick={submitVoto} className='button-purple' >A favor</button>
                                        </>
                                        )}

                                    </>)
                                        : (<>
                                            <Alert severity="warning">Confirme sua presença.</Alert>
                                        </>)}

                                    {user?.credencial !== 'active' &&
                                        (<>
                                            <Alert severity="warning">Assine a credencial.</Alert>
                                        </>
                                        )}


                                </Box>
                            </Grid>

                        </Grid>

                    </Box>


                </Modal>

            </Container>
        </Box >
    )
}

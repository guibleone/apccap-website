import { Alert, Box, Button, Checkbox, CircularProgress, Container, Grid, Modal, Typography, useMediaQuery } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { colors } from '../../pages/colors'
import { useDispatch, useSelector } from 'react-redux'
import { addReunionAta, finishReunion, getOneReunion, handleVoto, presenceList, reset, signAta } from '../../features/reunion/reunionSlice'
import { Link, useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { styleError, styleSuccess } from '../../pages/toastStyles'
import { toast } from 'react-toastify'
import { BsDownload, BsInfoCircle, BsPen, BsPlusCircle } from 'react-icons/bs'
import { AiFillBook, AiOutlineDropbox, AiOutlineEdit } from 'react-icons/ai'
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



    // ref do input file
    const fileInputRef = useRef(null);

    // função para abrir o input file
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const [selectedFile, setSelectedFile] = useState(null); // armazena o arquivo selecionado

    // função para pegar o arquivo selecionado
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    // função para enviar a planilha
    const handleSubmit = (e) => {
        e.preventDefault()

        const data = {
            id,
            ata: fileInputRef.current?.files[0],
            token: user.token
        }

        dispatch(addReunionAta(data))

        handleOpenAta()
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

                <Grid container spacing={2} pb={5} pt={'72px'}>
                    <Grid item xs={12} md={12}>
                        <h3 style={{ color: '#000', fontWeight: 600 }}>
                            Gerencie a reunião como {user?.role}
                        </h3>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>

                            <Box>
                                <h3 className='bold black'>
                                    Reunião {reunionData?.title}
                                </h3>
                                <h4 className='italic black medium'>
                                    {reunionData?.status?.toUpperCase()}
                                </h4>
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
                                Informações
                            </h3>
                            <h4 className='regular black'>
                                {reunionData?.date}
                            </h4>
                            <h4 className='regular black'>
                                {reunionData?.message}
                            </h4>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} pb={5}>


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
                                Pautas
                            </h3>

                            {reunionData?.pautas?.length > 0 ? reunionData?.pautas?.map((pauta, index) => {
                                return (
                                    <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column' }} key={index}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px'
                                        }}>
                                            <h4 className='regular black'>
                                                {pauta.title}
                                            </h4>

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
                                Documentos
                            </h3>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                {reunionData?.pathPdf ? <button style={{ maxWidth: '350px' }} c className='button-purple' onClick={() => window.location.href = reunionData?.pathPdf} target='_blank' >Convocação</button> : 'Sem convocação da reunião'}
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px'
                                }}>

                                    {reunionData?.ata?.path ? <button style={{ maxWidth: '350px' }} className='button-purple' onClick={() => window.location.href = reunionData?.ata?.path} target='_blank' >Ata</button> : 'Sem ata adicionada'}
                                    {reunionData?.ata?.path && (
                                        <Box sx={{ display: 'flex', gap: '5px', maxWidth: '350px', justifyContent: 'flex-end' }}>
                                            <Link sx={{ cursor: 'pointer' }} onClick={() => { handleOpenDetailsSign(); setAssinaturas(reunionData?.ata?.assinaturas); setExpectedAssinaturas(reunionData?.membros?.presentes) }}>
                                                Assinaturas
                                            </Link>
                                        </Box>
                                    )}

                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>


                                    <Box sx={{ display: 'flex', gap: '10px', maxWidth: '350px' }}>
                                        {user.role === 'presidente' && (
                                            <Grid container spacing={2}>
                                                {reunionData && reunionData?.status === 'nao_assinada' && reunionData?.ata?.path && (
                                                    <>
                                                        <Grid item xs={12} lg={12}>
                                                            <Box sx={{ display: 'flex', gap: '5px' }}>
                                                                {reunionData?.ata?.path && !reunionData.ata?.assinaturas.includes((`${user.dados_pessoais.name} - ${user.role}`)) && reunionData?.membros?.presentes.includes(`${user.dados_pessoais.name} - ${user.role}`) && (
                                                                    <button className='button-white' onClick={() => {
                                                                        const data = {
                                                                            id: reunionData._id,
                                                                            memberName: `${user.dados_pessoais.name} - ${user.role}`,
                                                                            token: user.token
                                                                        }
                                                                        dispatch(signAta(data))
                                                                    }}>Assinar</button>
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
                                                        <button className='button-white' onClick={() => {
                                                            const data = {
                                                                id: reunionData._id,
                                                                memberName: `${user.dados_pessoais.name} - ${user.role}`,
                                                                token: user.token
                                                            }
                                                            dispatch(signAta(data))
                                                        }}>Assinar</button>
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
                                                        <button className='button-white' onClick={() => {
                                                            const data = {
                                                                id: reunionData._id,
                                                                memberName: `${user.dados_pessoais.name} - ${user.role}`,
                                                                token: user.token
                                                            }
                                                            dispatch(signAta(data))
                                                        }}>Assinar</button>
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

                            </Box>

                        </Box>
                    </Grid>


                </Grid>

                <Grid container spacing={2} pb={10}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            maxHeight: '500px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <h3 style={{
                                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                                textAlign: matches ? 'left' : 'center'
                            }} >
                                Membros convocados
                            </h3>
                            {reunionData?.membros?.convocados.map((member, index) => {
                                return (
                                    <h4 className='regular black' key={index}>
                                        {member}
                                    </h4>
                                )
                            })}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            maxHeight: '500px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <h3 style={{
                                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                                textAlign: matches ? 'left' : 'center'
                            }} >
                                Membros Presentes
                            </h3>
                            {reunionData?.membros?.presentes ? reunionData?.membros?.presentes.map((member, index) => {
                                return (
                                    <h4 className='regular black' key={index}>
                                        {member}
                                    </h4>
                                )
                            }) : (
                                <h4 className='regular black'>
                                    Sem membros presentes
                                </h4>
                            )}
                        </Box>
                    </Grid>

                </Grid>

                <Modal
                    open={openAta}
                    onClose={handleOpenAta}                >
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
                            }} >
                                <input
                                    style={{ display: 'none' }}
                                    accept='.pdf, .csv'
                                    type='file'
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <button onClick={handleButtonClick} className='button-white-bottom-border' style={{ width: '220px' }}>
                                    {selectedFile ? <>{selectedFile.name.slice(0, 10)} ... <AiOutlineEdit size={25} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /> </> : <>Selecionar Arquivo<BsPlusCircle size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /></>}
                                </button>

                            </Box>

                            {file && <Typography textAlign={'center'} variant='p'>Arquivo selecionado: {file[0].name}</Typography>}

                            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button className='button-white' onClick={handleOpenAta}>Cancelar</button>

                                <button onClick={handleSubmit} className='button-purple' style={{ marginLeft: '10px', backgroundColor: isLoading && colors.main_white }}>
                                    {isLoading ? <CircularProgress color="success" style={{ padding: '5px' }} /> : <> <BsDownload size={20} style={{ verticalAlign: 'bottom', marginRight: '5px' }} /> Adicionar</>}
                                </button>
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

                                    {user?.credencial === 'active' ? (
                                        <>
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
                                                    <Alert severity="warning">Aguardando presença.</Alert>
                                                </>)}

                                        </>)
                                        :
                                        <Alert severity="warning">Assine a credencial.</Alert>
                                    }

                                </Box>
                            </Grid>

                        </Grid>

                    </Box>


                </Modal>

            </Container>
        </Box >
    )
}

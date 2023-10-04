import { Box, Grid, Typography, Button, MenuItem, TextField, Alert, Modal, useMediaQuery, CircularProgress, Checkbox, Divider, Container } from '@mui/material'
import React, { useCallback } from 'react'
import {Link} from 'react-router-dom'
import ReunionPagination from '../Pagination/Reunions'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteReunion, finishReunion, getReunions, presenceList, signAta } from '../../features/reunion/reunionSlice'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../../pages/toastStyles'
import { addReunionAta } from '../../features/reunion/reunionSlice'
import { useDropzone } from 'react-dropzone'
import { AiFillBook, AiFillWarning, AiOutlineDropbox, AiOutlineEdit } from 'react-icons/ai'
import { reset } from '../../features/reunion/reunionSlice'
import { BsPen, BsTrash } from 'react-icons/bs'
import { FcCheckmark, FcCancel, FcLock } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { getSubscription } from '../../features/payments/paymentsSlice'
import { colors } from '../../pages/colors'


export default function Reunion() {
    const navigate = useNavigate()

    const { isSuccess, isError, message } = useSelector((state) => state.reunions)
    const { user } = useSelector((state) => state.auth)
    const { payments, isLoading } = useSelector((state) => state.payments)

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


    const [reunions, setReunions] = useState([])
    const [selectStatus, setSelectStatus] = useState('')
    const [selectedType, setSelectType] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
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


    const dispatch = useDispatch()


    // concluir reunião
    const handleFinishReunion = (id) => {

        const reunions = {
            id,
            token: user.token
        }

        dispatch(finishReunion(reunions))

    }

    const [file, setFile] = useState(null)
    const [id, setId] = useState(null)

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
        setId(null)

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

        setId(null)

    }

    // deletar reunião

    const handleDeleteReunion = () => {

        const reunionData = {
            id,
            token: user.token
        }

        dispatch(deleteReunion(reunionData))

        handleOpenDelete()

        setId(null)

    }


    useEffect(() => {

        if (isError) {
            toast.error(message, styleError)
        }

        if (isSuccess) {
            toast.success(message, styleSuccess)
        }

        dispatch(reset())


    }, [isError, isSuccess])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    {/* if ((payments && user && (payments.subscription !== 'active')) || (user && user.status === 'reprovado')) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', gap: '10px' }}>
                <FcLock size={100} />
                <Typography textAlign={'center'} variant="h5">Reuniões Bloqueadas</Typography>
                <Typography textAlign={'center'} variant="p">Verifique a situação da sua credencial</Typography>
                <Button color='success' variant='outlined' onClick={() => navigate('/credencial-produtor')} >Credencial</Button>
            </Box>
        )
    }
*/}

    return (
        <Box sx={{ backgroundColor: colors.main_white, minHeight: '100vh' }}>
            <Container maxWidth='xl'>
                <Grid container spacing={2} >
                    <Grid item xs={12} lg={12} >
                        <Box sx={{ textAlign: 'center',  padding: '72px 0', }}>
                            <h1 className='bold black'>
                                Reuniões
                            </h1>
                            <h5 className='regular black'>
                                Gerencie, organize e confira as reuniões da APCCAP
                            </h5>
                        </Box>

                    </Grid>

                    {reunions && reunions.length > 0 ?
                        reunions
                            .map((reunion, index) => (
                                <Grid item xs={12} md={3} pr={matches ? 2 : 0} key={reunion._id}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: colors.main_grey, padding: '20px' }}>
                                        <Box sx={{
                                            backgroundColor: colors.main_grey,
                                            padding: '6px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '24px'
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}>
                                                <h4 className='semi-bold black'>
                                                    {reunion.date}
                                                </h4>
                                                <AiOutlineEdit size={25} />

                                            </Box>

                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '5px'
                                            }}>
                                                <h4 className='semi-bold black'>{reunion.title}</h4>
                                                <Link style={{cursor:'pointer'}} className='regular black italic' to={`/reuniao/${reunion._id}`}>
                                                    <h5>Ver Reunião</h5>
                                                </Link>
                                            </Box>
                                        </Box>

                                        {/*    {(reunion.ata.path && reunion.ata.assinaturas_restantes.length > 0 && !reunion.membros.faltantes.includes(`${user.name} - ${user.role}`)) &&
                                            <Box sx={{ display: 'flex', gap: '5px' }}>
                                                <Link sx={{ cursor: 'pointer' }} onClick={() => { handleOpenDetailsSign(); setAssinaturas(reunion.ata.assinaturas); setExpectedAssinaturas(reunion.membros.presentes) }}>
                                                    Assinaturas Restantes
                                                </Link>
                                            </Box>}

                                        <Box sx={{ display: 'flex', gap: '10px' }}>

                                            {user.role === 'presidente' &&
                                                <Grid container spacing={2}>
                                                    {reunion.status === 'nao_assinada' && reunion.ata && reunion.ata.path &&
                                                        <>
                                                            <Grid item xs={12} lg={12}>
                                                                <Box sx={{ display: 'flex', gap: '5px' }}>
                                                                    <Button variant='outlined' color='warning' href={reunion.ata && reunion.ata.path} target='_blank' >Ver ata</Button>

                                                                    {reunion.ata.path && !reunion.ata.assinaturas.includes((`${user.name} - ${user.role}`)) && reunion.membros.presentes.includes(`${user.name} - ${user.role}`) &&

                                                                        <Button variant='outlined' color='success' onClick={() => {
                                                                            const reunionData = {
                                                                                id: reunion._id,
                                                                                memberName: `${user.name} - ${user.role}`,
                                                                                token: user.token
                                                                            }

                                                                            dispatch(signAta(reunionData))

                                                                        }} >Assinar</Button>
                                                                    }
                                                                </Box>

                                                            </Grid>

                                                            {!reunion.ata === 'assinada' && reunion.ata.assinaturas.includes(`${user.name} - ${user.role}`) &&
                                                                <Grid item xs={12} lg={7}>
                                                                    <Alert severity="success" >
                                                                        Assinado
                                                                    </Alert>
                                                                </Grid>
                                                            }

                                                        </>
                                                    }

                                                    {reunion.status === 'requer_ata' && !reunion.ata.path && !reunion.membros.faltantes.includes(`${user.name} - ${user.role}`) &&
                                                        <Grid item xs={12} lg={12}>
                                                            <Alert severity="warning">Aguardando Ata</Alert>
                                                        </Grid>
                                                    }

                                                    {reunion.membros && reunion.membros.faltantes.includes(`${user.name} - ${user.role}`) &&
                                                        <Grid item xs={12} lg={12}>
                                                            <Alert severity="error" >
                                                                <Typography variant='h7'>Você faltou</Typography>
                                                            </Alert>
                                                        </Grid>
                                                    }

                                                    {reunion.status === 'agendada' &&
                                                        <Grid item xs={12} lg={12}>
                                                            <Button variant='outlined' color='success' onClick={() => handleFinishReunion(reunion._id)} >Concluir</Button>
                                                        </Grid>
                                                    }

                                                    {reunion.status === 'assinada' &&
                                                        <Grid item xs={12} lg={12}>
                                                            <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                                                <Alert severity="success">Ata Assinada</Alert>
                                                                <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                                                    <Button variant='outlined' color='success' href={reunion.ata && reunion.ata.path} target='_blank' >Ver ata</Button>
                                                                    <Button variant='outlined' color='error' onClick={() => { handleOpenDelete(); setId(reunion._id) }} >Deletar</Button>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    }

                                                </Grid>}

                                            {user.role === 'secretario' &&
                                                <Grid container spacing={2}>
                                                    {reunion.ata && reunion.ata.path ?
                                                        <Grid item xs={12} lg={6}>
                                                            <Button variant='outlined' color='warning' href={reunion.ata && reunion.ata.path} target='_blank' >Visualizar</Button>
                                                        </Grid>
                                                        :
                                                        <Grid item xs={12} lg={12}>

                                                            {reunion.membros && reunion.membros.convocados.length > 0 && reunion.membros.presentes.length < 1 ?
                                                                <Button variant='outlined' color='warning'
                                                                    onClick={() => { handleOpenList(); setMembers(reunion.membros.convocados); setId(reunion._id) }} >
                                                                    Lista de Presença</Button>
                                                                :
                                                                <Button variant='outlined' color='success'
                                                                    onClick={() => { handleOpenAta(); setFile(null); setId(reunion._id) }} >Adicionar Ata</Button>

                                                            }
                                                        </Grid>
                                                    }

                                                    {reunion.ata.path && !reunion.ata.assinaturas.includes((`${user.name} - ${user.role}`)) && reunion.membros.presentes.includes(`${user.name} - ${user.role}`) &&
                                                        <Grid item xs={12} lg={6}>
                                                            <Button variant='outlined' color='success' onClick={() => {
                                                                const reunionData = {
                                                                    id: reunion._id,
                                                                    memberName: `${user.name} - ${user.role}`,
                                                                    token: user.token
                                                                }

                                                                dispatch(signAta(reunionData))

                                                            }} >Assinar</Button>
                                                        </Grid>
                                                    }

                                                    {!reunion.ata === 'assinada' && reunion.ata.assinaturas.includes(`${user.name} - ${user.role}`) &&
                                                        <Grid item xs={12} lg={7}>
                                                            <Alert severity="success" >
                                                                Assinado
                                                            </Alert>
                                                        </Grid>
                                                    }

                                                    {reunion.membros && reunion.membros.faltantes.includes(`${user.name} - ${user.role}`) &&
                                                        <Grid item xs={12} lg={12}>
                                                            <Alert severity="error" >
                                                                <Typography variant='h7'>Você faltou</Typography>
                                                            </Alert>
                                                        </Grid>
                                                    }


                                                    {reunion.status === 'assinada' &&
                                                        <Grid item xs={12} lg={12}>
                                                            <Alert severity="success">Ata Assinada</Alert>
                                                        </Grid>

                                                    }


                                                </Grid>}

                                            {user.role !== 'presidente' && user.role !== 'secretario' &&
                                                <Grid container spacing={2}>
                                                    {reunion.ata && reunion.ata.path &&
                                                        <Grid item xs={12} lg={6}>
                                                            <Button variant='outlined' color='warning' href={reunion.ata && reunion.ata.path} target='_blank' >Visualizar</Button>
                                                        </Grid>
                                                    }

                                                    {reunion.ata.path && !reunion.ata.assinaturas.includes((`${user.name} - ${user.role}`)) && reunion.membros.presentes.includes(`${user.name} - ${user.role}`) &&
                                                        <Grid item xs={12} lg={6}>
                                                            <Button variant='outlined' color='success' onClick={() => {
                                                                const reunionData = {
                                                                    id: reunion._id,
                                                                    memberName: `${user.name} - ${user.role}`,
                                                                    token: user.token
                                                                }

                                                                dispatch(signAta(reunionData))

                                                            }} >Assinar</Button>
                                                        </Grid>
                                                    }

                                                    {!reunion.ata === 'assinada' && reunion.ata.assinaturas.includes(`${user.name} - ${user.role}`) &&
                                                        <Grid item xs={12} lg={7}>
                                                            <Alert severity="success" >
                                                                Assinado
                                                            </Alert>
                                                        </Grid>
                                                    }

                                                    {reunion.membros && reunion.membros.faltantes.includes(`${user.name} - ${user.role}`) &&
                                                        <Grid item xs={12} lg={12}>
                                                            <Alert severity="error" >
                                                                <Typography variant='h7'>Você faltou</Typography>
                                                            </Alert>
                                                        </Grid>
                                                    }

                                                    {reunion.status === 'assinada' &&
                                                        <Grid item xs={12} lg={12}>
                                                            <Alert severity="success">Ata Assinada</Alert>
                                                        </Grid>

                                                    }

                                                </Grid>
                                            }

                                        </Box>*/}
                                    </Box>
                                </Grid>

                            ))
                        :
                        <Grid item sm={12} lg={3}>
                            <Typography variant='h7'>Nenhuma reunião marcada</Typography>
                        </Grid>
                    }


                    <Grid container spacing={2} sx={{ margin: '20px 0' }} >

                        <Grid item xs={12} lg={4}>
                            <TextField
                                value={selectStatus}
                                onChange={(e) => setSelectStatus(e.target.value)}
                                select
                                label="Status"
                                fullWidth
                            >
                                <MenuItem key={0} value=''>Todas</MenuItem>
                                <MenuItem key={1} value='requer_ata'>Requer Ata</MenuItem>
                                <MenuItem key={2} value='nao_assinada'>Requer Assinatura</MenuItem>
                                <MenuItem key={3} value='assinada'>Assinada</MenuItem>
                                <MenuItem key={4} value='agendada'>Agendada</MenuItem>

                            </TextField>

                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <TextField
                                value={selectedType}
                                onChange={(e) => setSelectType(e.target.value)}
                                select
                                label="Tipo de Reunião"
                                fullWidth
                            >
                                <MenuItem key={0} value=''>Todos</MenuItem>
                                <MenuItem key={1} value='administrativa'>Administrativa</MenuItem>
                                <MenuItem key={2} value='assembleia_ordinal'>Assembleia Ordinal</MenuItem>
                                <MenuItem key={3} value='assembleia_extraordinaria'>Assembleia Extraordinária</MenuItem>

                            </TextField>

                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <TextField
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                select
                                label="Data da Reunião"
                                fullWidth
                            >
                                <MenuItem key={0} value=''>Todos</MenuItem>
                                <MenuItem key={1} value='antiga'>Mais Distante</MenuItem>
                                <MenuItem key={2} value='nova'>Mais Próxima</MenuItem>
                            </TextField>

                        </Grid>

                    </Grid>

                </Grid>




                <ReunionPagination setReunionData={(r) => setReunions(r)} status={selectStatus} type={selectedType} date={selectedDate} token={user.token} />



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


                <Modal
                    open={openDelete}
                >
                    <Box sx={style}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>

                            <Box display={'flex'} justifyContent={'space-between'}>
                                <Typography variant="h6" >Tem certeza que deseja deletar essa reunião? </Typography>
                                <BsTrash size={30} />
                            </Box>

                            <Typography variant='p'>Essa ação não pode ser desfeita</Typography>

                            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <Button color='success' variant='outlined' onClick={handleOpenDelete}>Cancelar</Button>

                                <Button
                                    disabled={isLoading}
                                    color="error"
                                    variant='outlined'
                                    onClick={handleDeleteReunion}
                                >
                                    {isLoading ? <CircularProgress color="success" size={24} /> : 'Deletar'}
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
                                {members && members.length > 0 ? (
                                    members.map((member, index) => (
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

            </Container>
        </Box >
    )
}

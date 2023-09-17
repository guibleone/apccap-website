import { Box, Grid, Typography, Button, MenuItem, TextField, Alert, Modal, useMediaQuery, CircularProgress } from '@mui/material'
import React, { useCallback } from 'react'
import ReunionPagination from '../Pagination/Reunions'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteReunion, finishReunion, getReunions, signAta } from '../../features/reunion/reunionSlice'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../../pages/toastStyles'
import { addReunionAta } from '../../features/reunion/reunionSlice'
import { useDropzone } from 'react-dropzone'
import { AiFillBook, AiFillWarning, AiOutlineDropbox } from 'react-icons/ai'
import { reset } from '../../features/reunion/reunionSlice'
import { BsTrash } from 'react-icons/bs'




export default function Reunion() {

    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.reunions)
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

    const [openAta, setOpeneAta] = useState(false)
    const handleOpenAta = () => setOpeneAta(!openAta)

    const [openDelete, setOpenDelete] = useState(false)
    const handleOpenDelete = () => setOpenDelete(!openDelete)

    const { user } = useSelector((state) => state.auth)
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


    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>
                    <Typography textAlign={'center'} variant='h5'>Reuniões Convocadas</Typography>
                </Grid>

                {reunions && reunions.length > 0 ?
                    reunions
                        .map((reunion, index) => (
                            <Grid item sm={12} lg={3} key={index}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Typography variant='h6'>{reunion.title}</Typography>
                                    <Typography variant='h7'>Data: {reunion.date}</Typography>
                                    <Typography variant='h7'>Tipo: {reunion.type}</Typography>
                                    {(reunion.ata && reunion.assinaturas_faltantes > 0) && <Typography variant='h7'>Assinaturas Restantes: {reunion.assinaturas_faltantes}</Typography>}
                                    <Box sx={{ display: 'flex', gap: '10px' }}>

                                        {user.role === 'presidente' && <>
                                            {reunion.status === 'nao_assinada' && reunion.ata && reunion.ata.path &&
                                                <>
                                                    <Button variant='outlined' color='warning' href={reunion.ata && reunion.ata.path} target='_blank' >Ver ata</Button>

                                                    {!reunion.assinaturas.includes(user.role) ? <Button variant='outlined' color='success' onClick={() => {

                                                        const reunionData = {
                                                            id: reunion._id,
                                                            role: user.role,
                                                            token: user.token
                                                        }

                                                        dispatch(signAta(reunionData))

                                                    }} >Assinar</Button> :
                                                        <Alert severity="success" >
                                                            <Typography variant='h7'>Assinado</Typography>
                                                        </Alert>
                                                    }
                                                </>
                                            }

                                            {reunion.status === 'requer_ata' && !reunion.ata &&
                                                <Alert severity="warning">Aguardando Ata</Alert>
                                            }

                                            {reunion.status === 'agendada' && <Button variant='outlined' color='success' onClick={() => handleFinishReunion(reunion._id)} >Concluir</Button>}

                                            {reunion.status === 'assinada' &&
                                                <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                                    <Alert severity="success">Ata Assinada</Alert>
                                                    <Box sx={{ display: 'flex', gap: '5px' }}>
                                                        <Button variant='outlined' color='success' href={reunion.ata && reunion.ata.path} target='_blank' >Ver ata</Button>
                                                        <Button variant='outlined' color='error' onClick={() => { handleOpenDelete(); setId(reunion._id) }} >Deletar</Button>
                                                    </Box>
                                                </Box>
                                            }
                                        </>}

                                        {user.role === 'secretario' &&
                                            <>
                                                {reunion.ata && reunion.ata.path ?
                                                    <>
                                                        <Button variant='outlined' color='warning' href={reunion.ata && reunion.ata.path} target='_blank' >Visualizar</Button>
                                                    </>
                                                    :
                                                    <Button variant='outlined' color='success' onClick={() => { handleOpenAta(); setFile(null); setId(reunion._id) }} >Adicionar Ata</Button>
                                                }

                                                {!reunion.assinaturas.includes(user.role) && reunion.ata && <Button variant='outlined' color='success' onClick={() => {

                                                    const reunionData = {
                                                        id: reunion._id,
                                                        role: user.role,
                                                        token: user.token
                                                    }

                                                    dispatch(signAta(reunionData))

                                                }} >Assinar</Button>
                                                }

                                                {reunion.assinaturas.includes(user.role) &&
                                                    <Alert severity="success" >
                                                        <Typography variant='h7'>Assinado</Typography>
                                                    </Alert>
                                                }

                                            </>}

                                        {user.role !== 'presidente' && user.role !== 'secretario' &&
                                            <>
                                                {reunion.ata && reunion.ata.path &&
                                                    <>
                                                        <Button variant='outlined' color='warning' href={reunion.ata && reunion.ata.path} target='_blank' >Visualizar</Button>
                                                    </>
                                                }

                                                {!reunion.assinaturas.includes(user.role) && reunion.ata && <Button variant='outlined' color='success' onClick={() => {

                                                    const reunionData = {
                                                        id: reunion._id,
                                                        role: user.role,
                                                        token: user.token
                                                    }

                                                    dispatch(signAta(reunionData))

                                                }} >Assinar</Button>
                                                }

                                                {reunion.assinaturas.includes(user.role) &&
                                                    <Alert severity="success" >
                                                        <Typography variant='h7'>Assinado</Typography>
                                                    </Alert>
                                                }
                                            </>
                                        }

                                    </Box>
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
                            <MenuItem key={2} value='assembleia_ordinal'>Assembleia Ordinária</MenuItem>
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
                            <MenuItem key={1} value='antiga'>Da mais antiga</MenuItem>
                            <MenuItem key={2} value='nova'>Da mais nova</MenuItem>
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

        </Box>
    )
}

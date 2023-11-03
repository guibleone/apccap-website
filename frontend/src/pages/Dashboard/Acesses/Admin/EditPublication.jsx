import { Avatar, Box, Checkbox, CircularProgress, Dialog, DialogContent, FormControl, Grid, InputLabel, MenuItem, Select, TextField, useMediaQuery } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../../../colors'
import { AiOutlineDownload, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../../../toastStyles'
import { deletePublication, editPublication, reset, resetSinglePublication } from '../../../../features/blog/blogSlice'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditPublicationDialog({ openEdit, handleOpenEdit }) {
    const dispatch = useDispatch()

    const matches = useMediaQuery('(min-width:600px)')
    const { user } = useSelector((state) => state.auth)
    const { singlePublication } = useSelector((state) => state.blog)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // criar publicação

    const [openDelete, setOpenDelete] = useState(false);
    const handleCloseDelete = () => setOpenDelete(!openDelete);

    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.blog)

    const temas = [
        'Produção',
        'Resultados de Competições',
        'Tendências e Inovações',
        'Mercado e Vendas',
        'Legislação',
        'História e Cultura',
        'Selos e IG',
        'Associação'
    ]

    // ref do input file
    const fileInputRef = useRef(null);

    // função para abrir o input file
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const [thumbnail, setThumbnail] = useState(null); // armazena o arquivo selecionado

    // função para pegar o arquivo selecionado
    const handleFileChange = (event) => {
        setThumbnail(event.target.files[0]);
    };

    const [description, setDescription] = useState('')

    const [values, setValues] = useState({
        title: '',
        theme: '',
        description: '',
        isDestaque: false,
        author: user._id
    })

    useEffect(() => {
        setValues({
            ...values,
            description: description
        });
    }, [description]);

    // função para editar publicação
    const [editValues, setEditValues] = useState({
        title: '',
        theme: '',
        description: '',
        isDestaque: false,
    });

    const [editDescription, setEditDescription] = useState('');

    const editOnChange = (event) => {
        const { name, value } = event.target;
        setEditValues({ ...editValues, [name]: value });
    }

    useEffect(() => {
        setEditValues({
            ...editValues,
            description: editDescription,
        });
    }, [editDescription]);

    const changeIsDestaqueEdit = () => {
        setEditValues({ ...editValues, isDestaque: !editValues.isDestaque });
    }

    const onSubmitEdit = (event) => {
        event.preventDefault()

        if (!editValues.title || !editDescription || !editValues.theme) {
            return toast.error('Preencha todos os campos', styleError)
        }

        dispatch(editPublication({ editValues, thumbnail, id: singlePublication._id }))
        setThumbnail(null)

    }

    // Handle the description changes
    const handleDescriptionChange = (value) => {
        setEditDescription(value);
    }

    useEffect(() => {
        if (singlePublication) {
            setEditValues({
                ...editValues,
                title: singlePublication.title,
                theme: singlePublication.theme,
                isDestaque: singlePublication.isDestaque,
            });
            setEditDescription(singlePublication.description);
        }
    }, [singlePublication]);



    useEffect(() => {

        if (isSuccess) {
            toast.success(message, styleSuccess)
            if (message === 'Publicação deletada com sucesso.') {
                handleOpenEdit()
            } if (message === 'Publicação editada com sucesso.') {
                handleOpenEdit()
            }
            setDescription('')
        }

        if (isError) {
            toast.error(message, styleError)
        }

        dispatch(reset())

    }, [isSuccess, isError, message])


    return (
        <>
            <Dialog open={openEdit} onClose={() => { handleOpenEdit(); dispatch(resetSinglePublication()) }} maxWidth="lg" fullWidth>
                <DialogContent sx={{
                    backgroundColor: colors.main_white,
                    padding: matches ? '72px 24px' : '36px 15px',
                }}>
                    <Grid container columnSpacing={8} rowSpacing={5}>
                        <Grid item xs={12} md={12}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textAlign: 'center',
                                    gap: '10px',
                                    marginBottom: matches ? '36px' : '0px',
                                }}
                            >
                                <h1 className="black bold">Editar Publicação</h1>
                                <h4 className="regular black" style={{ maxWidth: '500px', margin: '0 auto' }}>
                                    Edite as infromações da publicação
                                </h4>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px',
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <h4 className="medium black">Título</h4>
                                    <TextField
                                        name='title'
                                        value={editValues?.title || ''}
                                        onChange={editOnChange}
                                        fullWidth
                                        placeholder="Cachaça ganha prêmio"
                                        inputProps={
                                            {
                                                maxLength: 90,
                                            }
                                        }
                                        sx={
                                            {
                                                '& .MuiInputBase-root': {
                                                    borderRadius: '0px',
                                                    '& fieldset': {
                                                        borderColor: '#4AC97E',
                                                    },
                                                },
                                            }
                                        } />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Checkbox
                                        checked={editValues?.isDestaque || false}
                                        onChange={changeIsDestaqueEdit}
                                        sx={
                                            {
                                                marginLeft: '-10px', marginTop: '-3px',
                                                '& .MuiSvgIcon-root': {
                                                    color: '#4AC97E',
                                                },
                                            }
                                        } />
                                    <h4 className="medium black">
                                        Publicação Destaque
                                    </h4>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <h4 className="medium black">Tema</h4>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="tema">Selecione o tema </InputLabel>
                                        <Select
                                            name='theme'
                                            value={editValues?.theme || ''}
                                            onChange={editOnChange}
                                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                                            sx={{
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderRadius: '0px',
                                                    borderColor: '#4AC97E',

                                                },
                                            }}
                                        >
                                            {temas.map((tema) => (
                                                <MenuItem key={tema} value={tema}>{tema}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6} alignSelf={'center'} >
                            <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', flexDirection: matches ? 'row' : 'column' }}>
                                <Avatar sx={{ width: '143px', height: '143px' }} src={singlePublication?.thumbnail.url} />
                                <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: matches ? 'flex-start' : 'center' }}>
                                    <h4 className="medium black">Imagem de capa</h4>
                                    <input
                                        style={{ display: 'none' }}
                                        accept='.jpeg, .png, .gif, .jpg'
                                        type='file'
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <button onClick={handleButtonClick} className='button-white-file' style={{
                                        width: '220px',
                                        textAlign: matches ? 'start' : 'center'
                                    }}>
                                        {thumbnail ? <>{thumbnail.name.slice(0, 20)} ... <AiOutlineEdit size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /> </> : <>Escolher arquivo <AiOutlineDownload size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /></>}
                                    </button>
                                </Box>
                            </Box>
                        </Grid>


                        <Grid item xs={12} md={12}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <h4 className="medium black">Descrição</h4>
                                <ReactQuill
                                    className="black"
                                    name='description'
                                    theme="snow"
                                    value={editDescription}
                                    onChange={handleDescriptionChange}
                                    placeholder="Escreva o corpo do notícia aqui ..."

                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                            ['link', 'clean'],
                                        ],


                                    }}
                                    style={{ height: '150px' }}
                                />

                            </Box>
                        </Grid>

                    </Grid>

                    <Grid item xs={12} md={12} mt={matches ? 7 : 12} sx={{
                        display: 'flex',
                        flexDirection: matches ? 'row' : 'column',
                        justifyContent: matches ? 'space-between' : 'center',
                        gap: '20px'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            gap: '10px',

                        }}>
                            <button
                                onClick={onSubmitEdit}
                                className='button-purple'
                                style={{ backgroundColor: isLoading && colors.main_white }}
                            >
                                {isLoading ? <CircularProgress size={20} color="success" style={{}} /> : 'Salvar edições'}
                            </button>
                            <button className='button-grey' onClick={() => { handleOpenEdit(); dispatch(resetSinglePublication()) }}>Cancelar</button>
                        </Box>

                        <Box sx={{
                            alignSelf: 'center',
                            justifySelf: 'flex-end',
                        }}>
                            <button className='button-grey' onClick={() => { handleCloseDelete(); }}>Excluir</button>
                        </Box>
                    </Grid>

                </DialogContent>

            </Dialog>


            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
            >
                <DialogContent>

                    <h3 className="semi-bold" >
                        Tem certeza que deseja excluir?
                    </h3>


                    <h4 className="regular black" style={{ marginTop: '20px' }}>
                        Voce não poderá desfazer essa ação.
                    </h4>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '30px'
                    }}>
                        <button className="button-white" onClick={handleCloseDelete}>Cancelar</button>
                        <button className="button-purple" onClick={() => { dispatch(deletePublication(singlePublication?._id)); handleCloseDelete(); }}>Excluir</button>

                    </Box>

                </DialogContent>
            </Dialog>
        </>
    )
}

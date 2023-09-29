import { useCallback, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { Button, Typography, Box, Stack, CircularProgress, Grid, Divider, Alert, TextField, OutlinedInput } from '@mui/material';
import { FaDownload, FaTrash } from 'react-icons/fa'
import { styleError, styleSuccess } from '../../toastStyles'
import { useDropzone } from "react-dropzone"
import { AiOutlineDropbox } from "react-icons/ai"
import { addDocument, deleteDocument, getDocuments, resetDocuments } from "../../../features/documents/documentsSlice"
import { colors } from "../../colors";
import axios from "axios";

function Documentos() {

    // inicializar redux
    const { user } = useSelector((state) => state.auth)
    const { documents } = useSelector((state) => state.documents)
    const dispatch = useDispatch()

    // informação do documento
    const [documentData, setDocumentData] = useState({
        name: '',
        path: '',
        type: '',
    })

    const [documentsList, setDocumentsList] = useState([])

    // estados do documento
    const { isError, isLoading, isSuccess, message } = useSelector((state) => state.documents)

    const [types, setTypes] = useState([])

    // pegar documento

    const inputRefs = {
        cnpj_cpf: useRef(null),
        mapa: useRef(null),
        art: useRef(null),
        parecer: useRef(null),
    }


    const handleDocument = (type) => {

        const newDocument = {
            ...documentData,
            path: inputRefs[type].current.files[0],
            type: type,
            name: inputRefs[type].current.files[0].name,
        };

        const existingIndex = documentsList.findIndex((doc) => doc.type === type);

        if (existingIndex !== -1) {
            const updatedDocumentsList = [...documentsList];
            updatedDocumentsList[existingIndex] = newDocument;
            setDocumentsList(updatedDocumentsList);
        } else {
            setDocumentsList([...documentsList, newDocument]);
        }

        setDocumentData({
            name: '',
            path: '',
            type: '',
        });

    };

    // enviar documentos

    const [isLoaded, setIsLoaded] = useState(false)

    const onSubmitDocuments = () => {

        if (documentsList.length < 4) {
            return toast.error('Você deve enviar todos os documentos', styleError)

        }

        setIsLoaded(true)
        const formData = new FormData();

        formData.append('id', user._id);
        formData.append('token', user.token);

        for (let i = 0; i < documentsList.length; i++) {
            formData.append('files', documentsList[i].path, documentsList[i].type, documentsList[i].name);
        }

        axios.post('/api/documentos/adicionar', formData, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((response) => {
                toast.success(response.data.message, styleSuccess)
                setDocumentsList([])
                setIsLoaded(false)
                dispatch(getDocuments(user.token))
            })
            .catch((error) => {
                console.log(error)
                toast.error(error.response.data.error, styleError)
                setIsLoaded(false)
            });
    };


    useEffect(() => {
        if (documents && isError) {
            toast.error(message, styleError)
        }


        dispatch(resetDocuments())

    }, [isError, isSuccess, message, documents, dispatch])

    useEffect(() => {
        if (documents && documents.length > 0) {
            setTypes(documents.map((document) => document.type))
        }

    }, [documents]);



    if (isLoading || isLoaded) {
        return <Box sx={
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }
        }>
            <CircularProgress sx={
                {
                    margin: '100px',
                }
            } size={100} />
        </Box>
    }

    return (
        <Box sx={{
            paddingBottom: '120px',
        }}>
            <Box sx={{ textAlign: 'center' }}>
                <h1 className='bold black'>
                    Documentos
                </h1>
                <h5 className='regular black'>
                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                </h5>
            </Box>

            <Grid container columnSpacing={30} spacing={2} sx={{ marginTop: '20px' }}>

                <Grid item xs={12} sm={6} lg={6}>
                    {types.includes('cnpj_cpf') ?
                        <>
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                                p: 1,
                                borderRadius: '5px',
                            }}>
                                <Typography textAlign={'center'} variant='h7'>Cartão de CNPJ e CPF</Typography>
                                <Alert color='success'>Adicionado</Alert>
                            </Box>
                        </> :
                        <>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                            }} >
                                <h4 className="medium black">Cartão de CNPJ e CPF</h4>
                                <TextField inputRef={inputRefs.cnpj_cpf} onChange={() => handleDocument('cnpj_cpf')} type="file" placeholder="Selecione o arquivo" />
                            </Box>

                        </>
                    }

                </Grid>


                <Grid item xs={12} sm={6} lg={6}>
                    {types.includes('mapa') ?
                        <>
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                                p: 1,
                                borderRadius: '5px',
                            }}>
                                <Typography textAlign={'center'} variant='h7'>MAPA</Typography>
                                <Alert color='success'>Adicionado</Alert>
                            </Box>
                        </> :
                        <>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                            }} >
                                <h4 className="medium black">MAPA</h4>
                                <OutlinedInput inputRef={inputRefs.mapa} onChange={() => handleDocument('mapa')} type="file" placeholder="Selecione o arquivo" />
                            </Box>

                        </>}
                </Grid>


                <Grid item xs={12} sm={6} lg={6}>
                    {types.includes('art') ?
                        <>
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                                p: 1,
                                borderRadius: '5px',
                            }}>
                                <Typography textAlign={'center'} variant='h7'>ART</Typography>
                                <Alert color='success'>Adicionado</Alert>
                            </Box>
                        </> :
                        <>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                            }} >
                                <h4 className="medium black">ART</h4>
                                <OutlinedInput inputRef={inputRefs.art} onChange={() => handleDocument('art')} type="file" placeholder="Selecione o arquivo" />
                            </Box>

                        </>}

                </Grid>


                <Grid item xs={12} sm={6} lg={6}>
                    {types.includes('parecer') ?
                        <>
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                                p: 1,
                                borderRadius: '5px',
                            }}>
                                <Typography textAlign={'center'} variant='h7'>Parecer Técnico</Typography>
                                <Alert color='success'>Adicionado</Alert>
                            </Box>
                        </> :
                        <>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                            }} >
                                <h4 className="medium black">Parecer Técnico</h4>
                                <OutlinedInput inputRef={inputRefs.parecer} onChange={() => handleDocument('parecer')} type="file" placeholder="Selecione o arquivo" />
                            </Box>

                        </>
                    }
                </Grid>

            </Grid>

            <Box sx={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
                marginTop: '20px'
            }}>
                <button className="button-white" >Cancelar</button>
                <button className='button-purple' onClick={onSubmitDocuments}>Enviar</button>
            </Box>

        </Box>
    )
}

export default Documentos
import { Alert, Box, CircularProgress, Container, Grid, OutlinedInput, TextField, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../colors'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { styleError, styleSuccess } from '../toastStyles'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../../features/products/productsSlice'

export default function RegisterProduct() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const matches = useMediaQuery('(min-width:600px)');

    // gerencimento dos arquivos

    // informação do documento
    const [documentData, setDocumentData] = useState({
        name: '',
        path: '',
        type: '',
    })

    const [documentsList, setDocumentsList] = useState([])


    const [types, setTypes] = useState([])

    // pegar documentos

    const inputRefs = {
        cnpj_cpf: useRef(null),
        inscricao_regulacao: useRef(null),
        art: useRef(null),
        propriedade: useRef(null),
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

    // pegar dados do produto

    const [productFormData, setProductFormData] = useState({
        name: '',
        description: '',
        quantity: '',
    })

    const { name, description, quantity } = productFormData

    const onChangeProduct = (e) => {
        setProductFormData({ ...productFormData, [e.target.name]: e.target.value })
    }

    // enviar documentos

    const [isLoaded, setIsLoaded] = useState(false)

    const onSubmitProduct = () => {

        if (!productFormData.name || !productFormData.description || !productFormData.quantity) {
            return toast.error('Você deve preencher todos os campos', styleError)
        }


        if (documentsList.length < 4) {
            return toast.error('Você deve enviar todos os documentos', styleError)

        }


        setIsLoaded(true)
        const formData = new FormData();

        formData.append('id', user._id);
        formData.append('token', user.token);
        formData.append('name', productFormData.name);
        formData.append('description', productFormData.description);
        formData.append('quantity', productFormData.quantity);

        for (let i = 0; i < documentsList.length; i++) {
            formData.append('files', documentsList[i].path, documentsList[i].type, documentsList[i].name);
        }


        axios.post('/api/products', formData, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((response) => {
                toast.success(response.data.message, styleSuccess)
                setDocumentsList([])
                setIsLoaded(false)
                dispatch(getProducts())
                toast.success('Produto cadastrado com sucesso', styleSuccess)
                navigate('/produtos')
            })
            .catch((error) => {
                console.log(error)
                toast.error(error.response.data.error, styleError)
                setIsLoaded(false)
            });
    };


    return (
        <Box sx={{
            backgroundColor: colors.main_white,
            minHeight: '100vh',
        }}>
            <Container maxWidth='xl'>
                <Grid container spacing={2} p={matches ? 9 : 0} pt={!matches ? 9 : 2} >
                    <Grid item xs={12} lg={12}>
                        <div className='title'>
                            <h1 className='black bold'>
                                Cadastrar Produto
                            </h1>

                            <h3 className='regular black'>
                                Cadastre um novo produto que irá possuir selos da IG
                            </h3>

                        </div>
                    </Grid>
                </Grid>

                <Grid container columnSpacing={25} spacing={2} sx={{ marginTop: '20px' }}>

                    <Grid item xs={12}>
                        <h3
                            style={{
                                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                                textAlign: matches ? 'left' : 'center'
                            }} >
                            Sobre o produto e o lote
                        </h3>
                    </Grid>

                    <Grid mt={!matches ? 2 : 8} item xs={12}  lg={12}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                        }} >
                            <TextField name='name' value={name} onChange={onChangeProduct} fullWidth label="Nome do Produto" variant="outlined" />

                            <TextField name='description' value={description} onChange={onChangeProduct} fullWidth label="Descrição do Produto" variant="outlined" multiline rows={4} />

                            <TextField name='quantity' value={quantity} onChange={onChangeProduct} fullWidth label="Quatidade de selos" variant="outlined" type='number' />
                        </Box>

                    </Grid>



                </Grid>

                <Grid container columnSpacing={20} spacing={2} sx={{ marginTop: '20px' }}>

                    <Grid item xs={12}>
                        <h3
                            style={{
                                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                                textAlign: matches ? 'left' : 'center'
                            }} >
                            Documentos Necessários
                        </h3>
                    </Grid>

                    <Grid mt={!matches ? 2 : 8} item xs={12} sm={6} lg={6}>
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


                    <Grid mt={!matches ? 2 : 8} item xs={12} sm={6} lg={6}>
                        {types.includes('inscricao_regulacao') ?
                            <>
                                <Box sx={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                                    p: 1,
                                    borderRadius: '5px',
                                }}>
                                    <Typography textAlign={'center'} variant='h7'>Inscrição nos órgão públicos de regulação</Typography>
                                    <Alert color='success'>Adicionado</Alert>
                                </Box>
                            </> :
                            <>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px',
                                }} >
                                    <h4 className="medium black">Inscrição nos órgão públicos de regulação</h4>
                                    <OutlinedInput inputRef={inputRefs.inscricao_regulacao} onChange={() => handleDocument('inscricao_regulacao')} type="file" placeholder="Selecione o arquivo" />
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
                                    <Typography textAlign={'center'} variant='h7'>Anotação de responsabilidade técnica (ART)</Typography>
                                    <Alert color='success'>Adicionado</Alert>
                                </Box>
                            </> :
                            <>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px',
                                }} >
                                    <h4 className="medium black">Anotação de responsabilidade técnica (ART)</h4>
                                    <OutlinedInput inputRef={inputRefs.art} onChange={() => handleDocument('art')} type="file" placeholder="Selecione o arquivo" />
                                </Box>

                            </>}

                    </Grid>


                    <Grid item xs={12} sm={6} lg={6}>
                        {types.includes('propriedade') ?
                            <>
                                <Box sx={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                                    p: 1,
                                    borderRadius: '5px',
                                }}>
                                    <Typography textAlign={'center'} variant='h7'>Informações sobre a propriedade</Typography>
                                    <Alert color='success'>Adicionado</Alert>
                                </Box>
                            </> :
                            <>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px',
                                }} >
                                    <h4 className="medium black">Informações sobre a propriedade</h4>
                                    <OutlinedInput inputRef={inputRefs.propriedade} onChange={() => handleDocument('propriedade')} type="file" placeholder="Selecione o arquivo" />
                                </Box>

                            </>
                        }
                    </Grid>

                </Grid>

                <Box sx={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'flex-end',
                    marginTop: '20px',
                    paddingBottom: '120px'
                }}>
                    <button onClick={() => navigate('/produtos')} className="button-white" >Cancelar</button>
                    <button className='button-purple' onClick={onSubmitProduct}
                        disabled={isLoaded}
                        style={{ backgroundColor: isLoaded && colors.main_white }}
                    >
                        {isLoaded ? <CircularProgress color="success" style={{ padding: '5px' }} /> : 'Cadastrar'}
                    </button>
                </Box>


            </Container >
        </Box >

    )
}

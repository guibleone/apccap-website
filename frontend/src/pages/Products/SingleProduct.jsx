import { Container, Box, Typography, CircularProgress, TextField, useMediaQuery, Grid, } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSingleProduct, updateProduct, addProductPhoto, getSelos, reset } from '../../features/products/productsSlice'
import { colors } from '../colors'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../toastStyles'

function SingleProduct() {
    const { productData, isLoading, isError, message, isSuccess } = useSelector((state) => state.products)

    const { id } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const matches = useMediaQuery('(max-width:800px)')

    const user = JSON.parse(localStorage.getItem('user'))

    const [inputData, setInputData] = useState({
        id: id,
        token: user.token,
        name: '',
        selo: '',
        description: '',
    })

    const fileInputRef = useRef(null)

    useEffect(() => {

        const userData = {
            id: user._id,
            token: user.token
        }

        dispatch(getSelos(userData))

    }, [user._id, user.token])

    useEffect(() => {

        dispatch(getSingleProduct(id));

    }, [id, dispatch]);

    useEffect(() => {
        if (productData) {
            setInputData(prevInputData => ({
                ...prevInputData,
                name: productData.name,
                selo: productData.selo,
                description: productData.description
            }));
        }
    }, [productData]);

    const onChange = (e) => {
        const { name, value } = e.target
        setInputData({ ...inputData, [name]: value })
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            id: user._id,
            token: user.token
        }

        dispatch(updateProduct({ inputData, userData }))

        inputData.quantity = ''
    }

    const handlePhoto = (e) => {
        e.preventDefault()

        const product = {
            id: id,
            token: user.token,
            path: fileInputRef.current.files[0]
        }

        dispatch(addProductPhoto(product))
    }

    useEffect(() => {

        if (isSuccess) {
            toast.success('Produto editado com sucesso!', styleSuccess)
            navigate('/produtos')
        }

        if (isError) {
            toast.error(message, styleError)
        }

        dispatch(reset())

    }, [isSuccess, message, navigate, isError])


    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
    

    if (isLoading || !productData) {
        return <Box sx={
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: colors.main_white
            }
        }>
            <CircularProgress sx={
                {
                    margin: '100px',
                }
            } size={100} />
        </Box>
    }

    if (productData && productData.status === 'pendente') {
        return <Box sx={
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }
        }>
            <Typography variant='h5'>Produto pendente de aprovação</Typography>
        </Box>
    }

    return (

        <Box sx={
            {
                minHeight: '100vh',
                backgroundColor: colors.main_white
            }}
        >
            <Container maxWidth='xl' >

                <Grid container spacing={2} p={!matches ? 9 : 0} pt={matches ? 9 : 2} >
                    <Grid item xs={12} lg={12}>
                        <div className='title'>
                            <h1 className='black bold'>
                                Editar Produto
                            </h1>

                            <h3 className='regular black'>
                                Edite as informações do produto
                            </h3>
                            {productData.selo ? <h3 className='regular ' style={{ textAlign: 'center'}}>{`${productData.selo && productData.selo.startSelo} - ${productData.selo && productData.selo.endSelo}`}</h3> : ''}


                        </div>
                    </Grid>
                </Grid>

                <Grid container columnSpacing={25} spacing={2} sx={{ marginTop: '20px' }}>

                    <Grid item xs={12}>
                        <h3
                            style={{
                                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: matches ? '100%' : '270px',
                                textAlign: !matches ? 'left' : 'center'
                            }} >
                            Sobre o produto e o lote
                        </h3>


                    </Grid>

                    <Grid mt={matches ? 2 : 8} item xs={12} sm={6} lg={8}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                        }} >
                            
                            
                            <Typography variant='body1' pb={2} sx={{ fontWeight: 540 }}>
                                Descrição do Produto
                            </Typography>


                            <TextField name='description' defaultValue={productData ? productData.description : ''} onChange={onChange} fullWidth variant="outlined" multiline rows={4} />


                        </Box>

                        <Box sx={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'flex-end',
                            marginTop: '20px',
                            paddingBottom: '30px'
                        }}>
                            <button onClick={() => navigate('/produtos')} className="button-white" >Cancelar</button>
                            <button className='button-purple' onClick={onSubmit}
                                disabled={isLoading}
                                style={{ backgroundColor: isLoading && colors.main_white }}
                            >
                                {isLoading ? <CircularProgress color="success" style={{ padding: '5px' }} /> : 'Editar'}
                            </button>
                        </Box>

                    </Grid>
                
  
                    <Grid pb={10} item xs={12} lg={4} pr={!matches ? 10 : 0}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '56px',
                        }} >

                        <h3
                            style={{
                                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: matches ? '100%' : '270px',
                                textAlign: !matches ? 'right' : 'center'
                            }} >
                            Foto do produto
                        </h3>

   

                        <Box sx={
                            {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                width: matches ? '100%' : '100%',
                            }
                        }>
                            <img width={'200px'} style={{ alignSelf: 'center' }} src={productData.path ? productData.path : 'https://placehold.co/300x300'} alt="Foto do produto" />

                            {productData.path ?
                                <>
                                    <TextField type="file" inputRef={fileInputRef} />
                                    <button className='button-purple' onClick={handlePhoto} variant='contained'>Alterar</button>
                                </>

                                :
                                <>
                                    <TextField type="file" inputRef={fileInputRef} />
                                    <button className='button-purple' onClick={handlePhoto} variant='contained'>Adicionar</button>
                                </>
                            }
                            </Box>

                        </Box>
                    </Grid>

                </Grid>

            </Container>

        </Box>
    )
}

export default SingleProduct
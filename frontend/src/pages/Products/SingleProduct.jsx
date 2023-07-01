import { Container, Box, Typography, CircularProgress, TextField, Button, useMediaQuery } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSingleProduct, updateProduct, addProductPhoto } from '../../features/products/productsSlice'


function SingleProduct() {
    const { productData, isLoading, isError, message } = useSelector((state) => state.products)

    const { id } = useParams()

    const dispatch = useDispatch()
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

        dispatch(updateProduct(inputData))
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

    if (isLoading) {
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

        <Container sx={{
            height: '100vh',
        }}>

            {productData ? <Box sx={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }
            }>


                <form onSubmit={onSubmit}>
                    <Box sx={
                        {
                            display: 'flex',
                            flexDirection: matches ? 'column' : 'row',
                            gap: '10px',

                        }
                    }>
                        <Box sx={
                            {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                width: matches ? '100%' : '50%',
                                alignItems: 'center',
                            }
                        }>
                            <img width={300} src={productData.path ? productData.path : 'https://placehold.co/300x300'} alt="Foto do produto" />

                            {productData.path ? 
                            <>
                                 <input type="file" ref={fileInputRef} />
                                 <Button onClick={handlePhoto} variant='contained'>Alterar</Button> 
                            </>

                            : 
                            <>
                                <input type="file" ref={fileInputRef} />
                                <Button onClick={handlePhoto} variant='contained'>Adicionar</Button>
                            </>
                            }

                        </Box>

                        <Box sx={
                            {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                width: '100%',
                            }
                        }>
                            <Typography variant='h5'>Nome</Typography>
                            <TextField onChange={onChange} size='small' defaultValue={productData ? productData.name : ''} name='name' />

                            <Typography variant='h5'>Descrição</Typography>
                            <TextField onChange={onChange} size='small' defaultValue={productData ? productData.description : ''} name='description' />


                            <Typography variant='h5'>Selo</Typography>
                            <TextField disabled size='small' defaultValue={productData ? productData.selo : ''} name='selo' />

                            <Button variant='contained' type='submit'>Salvar</Button>
                        </Box>
                    </Box>
                </form>

                {isError && <Typography variant='h5'>{message}</Typography>}
                
            </Box> :

                <Box>
                    <CircularProgress sx={
                        {
                            margin: '100px',
                        }
                    } size={100} />
                </Box>
            }


        </Container>
    )
}

export default SingleProduct
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Container, Box, Typography, Avatar, CircularProgress, useMediaQuery, Button } from '@mui/material'
import { useEffect } from 'react'
import { getProducer, getProducerResume } from '../../features/products/productsSlice'
import Email from '../../components/Email/Email'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'

function SingleProducer() {
    const navigate = useNavigate()
    const { id } = useParams()

    const { producer, isLoading, producerResume } = useSelector(state => state.products)

    const dispatch = useDispatch()


    const matches = useMediaQuery('(max-width:600px)');

    const styleBox = matches ? {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'

    } : {
        display: 'flex',
        gap: '10px',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    }


    useEffect(() => {
        dispatch(getProducer(id))
        dispatch(getProducerResume(id))
    }, [dispatch, id])

    if (isLoading) {
        return <Box sx={
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
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
        <>
            <Container sx={{ minHeight: '100vh' }}>

                <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center', flexDirection: 'column' }}>
                    <Box sx={styleBox}>
                        <Avatar variant='rounded' src={producer.pathFoto ? producer.pathFoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
                            sx={{ width: 150, height: 150 }}
                        />

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='h4'>{producer ? producer.name : ''}</Typography>
                            <Typography variant='h6'>{producer.address ? `${producer.address.logradouro}, ${producer.address.numero} ` : ''}</Typography>
                            <Typography variant='h6'>{producer.address ? `${producer.address.cidade} / ${producer.address.estado} ` : ''}</Typography>
                        </Box>

                        <Email email={producer.email} />

                    </Box>

                    <Box sx={{ border: '1px solid black', padding: '10px' }}>
                        <Typography variant='h5'>{producerResume[0] ? producerResume[0].body : 'Produtor não possui resumo'}</Typography>
                    </Box>
                    <Button variant='contained' color='primary' onClick={() => navigate('/rastreabilidade')}>Produto</Button>

                </Box>

            </Container>

            <Footer />

        </>


    )
}

export default SingleProducer
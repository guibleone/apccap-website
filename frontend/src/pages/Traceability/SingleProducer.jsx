import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Container, Box, Typography, Avatar, CircularProgress, Divider, Button } from '@mui/material'
import { useEffect } from 'react'
import { getProducer, getProducerResume } from '../../features/products/productsSlice'

function SingleProducer() {
    const { id } = useParams()

    const { producer, isLoading, producerResume } = useSelector(state => state.products)

    const dispatch = useDispatch()

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
                height: '100vh'
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
        <Container sx={{ height: '100vh' }}>

            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Avatar variant='square' src={producer.pathFoto ? producer.pathFoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
                    sx={{ width: 150, height: 150 }}
                />

                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='h4'>{producer ? producer.name : ''}</Typography>
                    <Typography variant='h6'>{producer.address ? `${producer.address.logradouro}, ${producer.address.numero} ` : ''}</Typography>
                    <Typography variant='h6'>{producer.address ? `${producer.address.cidade} / ${producer.address.estado} ` : ''}</Typography>
                    <Typography variant='h6'>{producer ? `${producer.email} ` : ''}</Typography>
                </Box>

                <Box>
                    <Divider sx={{ margin: '0 20px' }} orientation="vertical" />
                </Box>
                <Box sx={{width:'300px'}}>
                    <Typography variant='h5'>{producerResume[0] ? producerResume[0].body : ''}</Typography>
                </Box>
                <Button variant='contained' color='primary' href='/rastreabilidade'>Produto</Button>

            </Box>


        </Container>
    )
}

export default SingleProducer
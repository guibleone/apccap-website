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

            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center', flexDirection:'column' }}>
                <Box sx={{display:'flex', gap:'10px', border:'1px solid black'}}>
                <Avatar variant='square' src={producer.pathFoto ? producer.pathFoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
                    sx={{ width: 150, height: 150 }}
                />

                <Box sx={{ display: 'flex', flexDirection: 'column'  }}>
                    <Typography variant='h4'>{producer ? producer.name : ''}</Typography>
                    <Typography variant='h6'>{producer.address ? `${producer.address.logradouro}, ${producer.address.numero} ` : ''}</Typography>
                    <Typography variant='h6'>{producer.address ? `${producer.address.cidade} / ${producer.address.estado} ` : ''}</Typography>
                    <Typography variant='h6'>{producer ? `${producer.email} ` : ''}</Typography>
                </Box>

                <Box sx={{
                    display:'flex', 
                    flexDirection:'column', 
                    gap:'10px', 
                    justifyContent:'center', 
                    marginLeft:'auto',
                    marginRight:'50px'

                    }}>
                    <Button variant='contained' color='success'>Contatar</Button>
                </Box>

                </Box>

                <Box sx={{border:'1px solid black', padding:'10px'}}>
                    <Typography variant='h5'>{producerResume[0] ? producerResume[0].body : ''}</Typography>
                </Box>
                <Button variant='contained' color='primary' href='/rastreabilidade'>Produto</Button>

            </Box>


        </Container>
    )
}

export default SingleProducer
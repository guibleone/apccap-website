import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, CardMedia, Container, Divider, Grid, Typography, useMediaQuery } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, getUserData } from '../../../../../features/admin/adminSlice'
import { BiTrashAlt } from 'react-icons/bi'
import { AiOutlineEdit } from 'react-icons/ai'

export default function UserProducts() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { productsData } = useSelector((state) => state.admin)
    const matches = useMediaQuery('(max-width: 600px)')

    const { id } = useParams()

    const { userData } = useSelector((state) => state.admin)
    const { user } = useSelector((state) => state.auth)


    useEffect(() => {
        dispatch(getUserData({ id, token: user.token }))
        dispatch(getProducts({ id, token: user.token }))
    }, [])

    return (
        <Container sx={{ minHeight: '100vh' }}>
            <Grid container spacing={2}>

                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', padding: '10px' }}>
                        <Avatar src={userData && userData.pathFoto} sx={{ width: '100px', height: '100px' }} />
                    </Box>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'center', flexDirection: 'column', padding: '10px' }}>
                        {userData && userData.address ? (
                            <>
                                <Typography variant='p'>CEP - {userData.address.cep} </Typography>
                                <Typography variant='p'>{userData.address.logradouro} , {userData.address.numero} </Typography>
                                <Typography variant='p'>{userData.address.cidade} / {userData.address.estado} </Typography>
                            </>
                        ) :
                            <>
                                <Typography variant='p'>{userData.name} não possui endereço registrado</Typography>
                            </>
                        }
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ margin: '10px 0' }} />

            {productsData && productsData.length === 0 ?

                (<Typography variant="h5" gutterBottom>Nenhum produto cadastrado</Typography>)

                : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px',overflow:'hidden'  }}>

                        <Typography sx={{ textAlign: 'center', padding:1,  }} variant={'h5'} >Produtos Para Análise</Typography>

                        <Grid
                            sx={{ margin: '10px 0', display: 'flex', flexDirection: matches ? 'column' : 'row', gap: matches ? '20px' : '0' }}
                            container={!matches}
                            rowSpacing={{ xs: 8, sm: 6, md: 3 }}
                            columnSpacing={{ xs: 8, sm: 6, md: 3 }}
                        >

                            {productsData && productsData.map((product) => (

                                <>
                                    {product.status === '' &&

                                        <Grid alignSelf={'center'} item key={product._id} md={3}>

                                            <Card
                                                sx={{
                                                    maxWidth: matches ? 352 : 252,
                                                    minWidth: 262,
                                                    border: matches ? '1px solid #E4E3E3' : 'none',
                                                    borderRadius: '5px',
                                                }}>

                                                <CardMedia
                                                    sx={{ height: 252 }}
                                                    image={product.path ? product.path : 'https://as1.ftcdn.net/jpg/02/68/55/60/220_F_268556012_c1WBaKFN5rjRxR2eyV33znK4qnYeKZjm.jpg'}
                                                />

                                                <CardContent>
                                                    <Typography sx={{ textAlign: 'center' }} variant="h6" component="h1">{product.name}</Typography>
                                                </CardContent>


                                                <CardActions sx={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                                                    <Button variant='outlined' color='warning' onClick={() => navigate(`/unico-produto-usuario/${product._id}`)}>Ver Produto</Button>
                                                </CardActions>
                                            </Card>

                                        </Grid>
                                    }
                                </>
                            ))}
                        </Grid>
                    </Box>
                    )}
        </Container>
    )
}

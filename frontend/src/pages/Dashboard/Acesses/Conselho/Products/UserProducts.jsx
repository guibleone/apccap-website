import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Container, Divider, Grid, Typography, useMediaQuery } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, getUserData } from '../../../../../features/admin/adminSlice'
import { BiTrashAlt } from 'react-icons/bi'
import { AiOutlineEdit } from 'react-icons/ai'
import { colors } from '../../../../colors'
import { MdLiquor } from 'react-icons/md'
import ProductsPagination from '../../../../../components/Pagination/Products'

export default function UserProducts() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const matches = useMediaQuery('(min-width: 600px)')

    const { id } = useParams()

    const { userData } = useSelector((state) => state.admin)
    const { user } = useSelector((state) => state.auth)

    const [products, setProducts] = useState()


    useEffect(() => {
        dispatch(getUserData({ id, token: user.token }))
        dispatch(getProducts({ id, token: user.token }))
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);
    if (!userData || !userData.dados_pessoais) {

        return <Box sx={
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.main_white,
                minHeight: '100vh'
            }
        }>
            <CircularProgress sx={
                {
                    marginBottom: '100px',
                }
            } size={100} />
        </Box>
    }


    return (
        <Box sx={{
            backgroundColor: colors.main_white,
            minHeight: '100vh',
        }}>
            <Container maxWidth='xl'>
                {userData && userData.dados_pessoais && (
                    <Grid container spacing={2} p={matches ? 9 : 0} pt={!matches ? 9 : 2} >
                        <Grid item xs={12} lg={12}>
                            <div className='title'>
                                <Avatar src={userData.dados_pessoais ? userData.dados_pessoais.profilePhoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
                                    sx={{ width: 66, height: 66 }}

                                />
                                <h2 className='black bold'>
                                    {userData?.dados_pessoais?.name.split(' ')[0]} {userData?.dados_pessoais?.name.split(' ')[userData?.dados_pessoais?.name.split(' ').length - 1]}
                                </h2>

                                <h3 style={{ textAlign: 'center' }} className='regular black'>
                                    Requer análise dos produtos
                                </h3>


                            </div>
                        </Grid>

                    </Grid>
                )}

                <Grid container rowSpacing={3} pt={5} >
                    <Grid item >
                        {(products?.length === 0) && (
                            <h3 className='regular black'>
                                Nenhum produto cadastrado
                            </h3>
                        )}
                    </Grid>

                    {products &&
                        products?.filter((product) => product).slice(0, 4).map((product) => (
                            <Grid item xs={12} md={3} pr={matches ? 2 : 0} key={product._id}>
                                <Box sx={{
                                    backgroundColor: colors.main_grey,
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '24px'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}>
                                        <h3 className='semi-bold black'>
                                            {product.name}
                                        </h3>
                                        <MdLiquor size={30} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} />
                                    </Box>
                                    <Box>
                                        <button className='button-grey-bottom-border' onClick={() => navigate(`/unico-produto-usuario/${product._id}`)}>
                                            ver produto
                                        </button>
                                    </Box>

                                </Box>
                            </Grid>
                        ))}
                </Grid>
                <ProductsPagination setProductsData={(u) => setProducts(u)} status={true} />
            </Container>
        </Box>
    )
}

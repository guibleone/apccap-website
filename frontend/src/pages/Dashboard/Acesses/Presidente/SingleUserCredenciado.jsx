import { Avatar, Box, Button, Container, Divider, Grid, Skeleton, Typography, Modal, CircularProgress, TextareaAutosize, Card, CardMedia, CardContent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector, } from 'react-redux'
import { getProducts, getUserData, sendEmail, sendRelatory } from '../../../../features/admin/adminSlice'
import { getSubscription } from '../../../../features/payments/paymentsSlice'
import { useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router'
import { AiFillWarning, AiOutlineDownload } from 'react-icons/ai'
import { styleError, styleSuccess } from '../../../toastStyles'
import { toast } from 'react-toastify'
import { disapproveUser } from '../../../../features/admin/adminSlice'
import { FcCancel, FcDeleteDatabase, FcOk } from 'react-icons/fc'
import ProductsPagination from '../../../../components/Pagination/Products'

export default function User() {
    const { user } = useSelector((state) => state.auth)
    const { userData: produtor, isLoading: isLoadingAdmin, } = useSelector((state) => state.admin)
    const { payments, isLoading: isLoadingPayment } = useSelector((state) => state.payments)
    const matches = useMediaQuery('(min-width:800px)')

    const [productsData, setProductsData] = useState([])

    const [openDesaprove, setOpenDesaprove] = useState(false);

    const handleOpenDesaprove = () => setOpenDesaprove(true);
    const handleCloseDesaprove = () => setOpenDesaprove(false);

    const dispatch = useDispatch()

    const { id } = useParams()

    const navigate = useNavigate()

    const style = matches ? {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,

    } : {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,

    }

    const [relatory, setRelatory] = useState('')

    const handleDessaprove = () => {

        if (!relatory) return toast.error('Preencha o relatório', styleError)

        dispatch(sendEmail({
            email: produtor.email,
            title: 'Descredenciamento de produtor',
            message: relatory,
        }))

        const relatoryData = {
            relatory,
            id: produtor._id,
            token: user.token
        }

        dispatch(sendRelatory(relatoryData))
        dispatch(disapproveUser({ id, token: user.token }))

        toast.success('Usuário descredenciado com sucesso', styleSuccess)
        navigate('/')
    }

    useEffect(() => {

        dispatch(getUserData({ id, token: user.token }))

        const data = {
            id,
            token: user.token
        }

        dispatch(getProducts(data))

    }, [id, user.token, dispatch])

    useEffect(() => {

        if (produtor && produtor.email) {
            dispatch(getSubscription({ email: produtor.email, token: user.token }))
        }

    }, [produtor, user.token, dispatch])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (isLoadingPayment || isLoadingAdmin) {
        return <Box sx={
            {
                display: 'flex',
                justifyContent: 'center',
                padding: '50px',
                minHeight: '100vh'
            }
        }>
            <CircularProgress size={100} />
        </Box>
    }

    return (
        <Container sx={{ minHeight: '100vh' }}>
            <Grid container  >
                <Grid item xs={12} md={4} >
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '10px' }}>

                        <Typography textAlign={'center'} variant="h5" >{`${produtor && produtor.name}`}</Typography>



                        <Avatar variant='square' src={produtor && produtor.pathFoto ? produtor.pathFoto : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'} alt=""
                            sx={{
                                width: '100%',
                                height: '200px',
                            }}
                        />

                    </Box>

                </Grid>

                <Divider orientation={'vertical'} flexItem />

                <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', padding: '10px' }}  >
                            <Typography textAlign={'center'} variant="h5" >Análises do Produtor</Typography>
                            {produtor.analise && produtor.analise.analise_pedido.path && 
                            <>
                                <Button startIcon={<AiOutlineDownload />} fullWidth variant='outlined' color='primary' href={produtor.analise.analise_pedido.path}>Análise de pedido</Button>
                            </>}

                            {produtor.analise && produtor.analise.vistoria.path && 
                            <>
                                <Button startIcon={<AiOutlineDownload />}  fullWidth variant='outlined' color='primary' href={produtor.analise.vistoria.path}>Vistoria</Button>
                            </>}

                            {produtor.analise && produtor.analise.analise_laboratorial.path && 
                            <>
                                <Button startIcon={<AiOutlineDownload />}  fullWidth variant='outlined' color='primary' href={produtor.analise.analise_laboratorial.path}>Análise Laboratorial</Button>
                            </>}
                
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid item xs={12} md={2} >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItens: 'center', gap: '10px', padding: '10px' }}>


                        <Typography textAlign={'center'} variant='h7'>Status Credencial {produtor && produtor.status ?
                            (<FcOk style={{ verticalAlign: 'bottom' }} size={25} />) : (<FcCancel style={{ verticalAlign: 'bottom' }} size={25} />)}
                        </Typography>

                        <Typography sx={{ textAlign: 'center' }} variant='h7'>Assinatura Mensal {payments && payments.subscription ?
                            (<FcOk style={{ verticalAlign: 'bottom' }} size={25} />) : (<FcCancel style={{ verticalAlign: 'bottom' }} size={25} />)}
                        </Typography>


                    </Box>

                </Grid>

                <Grid item xs={12} md={12} sx={{ margin: '10px 0' }}  >

                    <Button fullWidth onClick={handleOpenDesaprove} color='error' variant='outlined'>Descredenciar</Button>

                    <Modal
                        open={openDesaprove}
                        onClose={handleCloseDesaprove}
                    >
                        <Box sx={style}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                alignItems: 'center',
                            }}>
                                <Box display={'flex'} justifyContent={'space-between'}>
                                    <Typography variant="h6" >Tem certeza ? </Typography>
                                    <AiFillWarning color='red' size={30} />
                                </Box>

                                <Typography textAlign={'center'} variant="h7" >Digite o motivo do descredenciamento.</Typography>

                                <TextareaAutosize onChange={(e) => setRelatory(e.target.value)} minRows={8} style={{ width: '100%', padding: '10px', border: '1px solid black' }} />

                                <Typography color={'red'} variant="h7" >Será enviado um email ao produtor.</Typography>

                                <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>

                                    <Button color='error' variant='outlined' onClick={handleCloseDesaprove}>Cancelar</Button>

                                    <Button
                                        disabled={isLoadingAdmin}
                                        color="success"
                                        variant='outlined'
                                        onClick={handleDessaprove}
                                    >
                                        {isLoadingAdmin ? <CircularProgress color="success" size={24} /> : 'Descredenciar'}
                                    </Button>

                                </Box>
                            </Box>
                        </Box>
                    </Modal>


                    <Button sx={{ margin: '10px 0' }} fullWidth variant='outlined' color='success' onClick={() => navigate('/')}>Voltar</Button>


                </Grid>

            </Grid>

            <Divider sx={{ margin: '20px 0' }} />

            <Grid container spacing={2}>

                <Grid item xs={12} md={12} >

                    <Typography textAlign={'center'} variant="h5" >Produtos</Typography>

                </Grid>

                {(productsData && productsData.length > 0) ? productsData.map((product) => (
                    <>
                        <Grid lg={3} md={4} sm={6} xs={12} item key={product._id} sx={{ display: 'flex', justifyContent: 'center' }} >
                            <Card
                                sx={{
                                    maxWidth: matches ? 352 : 252,
                                    minWidth: 252,
                                    border: '1px solid #E4E3E3',
                                    borderRadius: '5px',
                                }}>

                                <CardMedia
                                    sx={{ height: matches ? 252 : 252 }}
                                    image={product.path ? product.path : 'https://as1.ftcdn.net/jpg/02/68/55/60/220_F_268556012_c1WBaKFN5rjRxR2eyV33znK4qnYeKZjm.jpg'}
                                />

                                <CardContent>
                                    <Typography sx={{ textAlign: 'center' }} variant="h6" component="h1">{product.name}</Typography>
                                </CardContent>

                                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant="p" >{product.description}</Typography>
                                    <Typography variant="p" >{(product.selo && product.selo.startSelo) ? `${product.selo.startSelo} - ${product.selo.endSelo}` : 'Produto em análise'}</Typography>
                                </CardContent>

                            </Card>

                        </Grid>
                    </>


                )) : (
                    <Grid item md={12} xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>

                        <>
                            <FcDeleteDatabase size={100} />
                            <Typography variant="h7" >Nenhum produto cadastrado</Typography>
                        </>

                    </Grid>
                )}

            </Grid>

            <ProductsPagination setProductsData={(p) => setProductsData(p)} />

        </Container>
    )
}

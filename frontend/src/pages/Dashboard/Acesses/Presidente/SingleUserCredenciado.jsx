import { Avatar, Box, Button, Container, Divider, Grid, Skeleton, Typography, Modal, CircularProgress, TextareaAutosize, Card, CardMedia, CardContent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector, } from 'react-redux'
import { deleteUser, getProducts, getUserData, sendEmail, sendRelatory } from '../../../../features/admin/adminSlice'
import { getSubscription } from '../../../../features/payments/paymentsSlice'
import { useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router'
import { AiFillWarning, AiOutlineDownload } from 'react-icons/ai'
import { styleError, styleSuccess } from '../../../toastStyles'
import { toast } from 'react-toastify'
import { disapproveUser } from '../../../../features/admin/adminSlice'
import { FcCancel, FcDeleteDatabase, FcOk } from 'react-icons/fc'
import ProductsPagination from '../../../../components/Pagination/Products'
import { colors } from '../../../colors'
import { MdLiquor } from 'react-icons/md'

export default function User() {
    const { user } = useSelector((state) => state.auth)
    const { userData: produtor, isLoading: isLoadingAdmin, } = useSelector((state) => state.admin)
    const { payments, isLoading: isLoadingPayment } = useSelector((state) => state.payments)
    const matches = useMediaQuery('(min-width:800px)')

    const [products, setProducts] = useState()

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

    const handleDelete = () => {

        if (!relatory) return toast.error('Preencha o relatório', styleError)

        dispatch(sendEmail({
            email: produtor?.dados_pessoais?.email,
            title: 'Exclusão de produtor',
            message: relatory,
        }))

        const relatoryData = {
            relatory,
            id: produtor._id,
            token: user.token
        }

        dispatch(sendRelatory(relatoryData))
        dispatch(deleteUser({ id, token: user.token }))

        toast.success('Usuário excluído com sucesso', styleSuccess)
        navigate('/')
    }

    useEffect(() => {

        dispatch(getUserData({ id, token: user.token }))

        const data = {
            id,
            token: user.token
        }

        dispatch(getProducts(data))

    }, [id, user.token])

    useEffect(() => {

        if (produtor && produtor.email) {
            dispatch(getSubscription({ email: produtor.email, token: user.token }))
        }

    }, [produtor, user.token])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (isLoadingPayment || isLoadingAdmin) {
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
                {produtor && produtor.dados_pessoais && (
                    <Grid container spacing={2} p={matches ? 9 : 0} pt={!matches ? 9 : 2} pb={5} >
                        <Grid item xs={12} lg={12}>
                            <div className='title'>
                                <Avatar src={produtor.dados_pessoais ? produtor.dados_pessoais.profilePhoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"
                                    sx={{ width: 66, height: 66 }}

                                />
                                <h2 className='black bold'>
                                    {produtor?.dados_pessoais?.name.split(' ')[0]} {produtor?.dados_pessoais?.name.split(' ')[produtor?.dados_pessoais?.name.split(' ').length - 1]}
                                </h2>

                                <h3 style={{ textAlign: 'center' }} className='regular black'>
                                    Gerencie a utilização do produtor
                                </h3>


                            </div>
                        </Grid>

                    </Grid>
                )}

                <Grid container  >

                    <Grid item xs={12} md={5}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '40px'
                        }}>

                            <h3 style={{
                                fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                                textAlign: matches ? 'left' : 'center'
                            }} >
                                Documentos
                            </h3>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                {produtor.analise && produtor.analise.analise_pedido.path &&
                                    <>
                                        <button className='button-white' startIcon={<AiOutlineDownload />} fullWidth variant='outlined' color='primary' href={produtor.analise.analise_pedido.path}>Análise do pedido</button >
                                    </>}

                                {produtor.analise && produtor.analise.vistoria.path &&
                                    <>
                                        <button className='button-white' startIcon={<AiOutlineDownload />} fullWidth variant='outlined' color='primary' href={produtor.analise.vistoria.path}> Vistoria</button >
                                    </>}

                                {produtor.analise && produtor.analise.analise_laboratorial.path &&
                                    <>
                                        <button className='button-white' startIcon={<AiOutlineDownload />} fullWidth variant='outlined' color='primary' href={produtor.analise.analise_laboratorial.path}> Análise Laboratorial</button >
                                    </>}
                            </Box>

                        </Box>


                    </Grid>

                    {/**
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
                     */}


                </Grid>

                <Divider sx={{ margin: '20px 0' }} />

                <h3 style={{
                    fontWeight: 540, color: '#140C9F', borderBottom: '3px solid #140C9F', width: !matches ? '100%' : '270px',
                    textAlign: matches ? 'left' : 'center'
                }} >
                    Produtos
                </h3>

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
                                        <h4 className='regular black'> {product.status ? 'Produto Aprovado' : 'Produto em análise'}</h4>
                                        {product?.selo?.startSelo && <h5>{product?.selo?.startSelo} - {product?.selo?.endSelo}</h5>}
                                        {!product?.selo?.startSelo && <h5>Aguardando selos</h5>}
                                    </Box>

                                </Box>
                            </Grid>
                        ))}
                </Grid>

                <ProductsPagination setProductsData={(p) => setProducts(p)} />

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    paddingBottom:'72px'
                }} >

                    <button className='button-white' onClick={() => navigate('/')}>Voltar</button>
                    <button className='button-purple' onClick={handleOpenDesaprove} >Excluir</button>

                </Box>

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

                            <Typography textAlign={'center'} variant="h7" >Digite o motivo da exclusão</Typography>

                            <TextareaAutosize onChange={(e) => setRelatory(e.target.value)} minRows={8} style={{ width: '100%', padding: '10px', border: '1px solid black' }} />

                            <Typography color={'red'} variant="h7" >Será enviado um email ao produtor.</Typography>

                            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>

                                <button  className='button-white' onClick={handleCloseDesaprove}>Cancelar</button>

                                <button
                                    disabled={isLoadingAdmin}
                                    className='button-purple'
                                    onClick={handleDelete}
                                >
                                    {isLoadingAdmin ? <CircularProgress color="success" size={24} /> : 'Excluir'}
                                </button>

                            </Box>
                        </Box>
                    </Box>
                </Modal>


            </Container>
        </Box>
    )
}

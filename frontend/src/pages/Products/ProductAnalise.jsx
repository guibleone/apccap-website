import { Box, Container, CssBaseline, Typography, Button, CircularProgress, Link, Grid, Divider, useMediaQuery, Alert } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { styleError } from '../toastStyles'
import { AiOutlineDownload } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { getSingleProduct } from '../../features/products/productsSlice'
import { colors } from '../colors'

export default function ProductAnalise() {
    const { productData: product, isLoading } = useSelector((state) => state.products)
    const matches = useMediaQuery('(min-width:800px)')
    const dispatch = useDispatch()

    const { id } = useParams()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        dispatch(getSingleProduct(id));
    }, [id, dispatch]);



    if (isLoading) {
        return <Box sx={
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.main_white,
                minHeight: '100vh',
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
        <Box sx={{
            backgroundColor: colors.main_white,
            minHeight: '100vh',
        }}>
            <Container maxWidth='lg'>
                {product &&
                    <>


                        <Grid container spacing={2} p={matches ? 9 : 0} pt={!matches ? 9 : 2} >
                            <Grid item xs={12} lg={12}>
                                <div className='title'>
                                    <h1 className='black bold'>
                                        Acompanhar Análise
                                    </h1>

                                    <h3 className='regular black'>
                                        Acompanhe o andamento do processo de seu produto
                                    </h3>

                                    <h3 className='regular ' style={{ textAlign: 'center' }}>{product.name}</h3>

                                </div>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} columnSpacing={5} sx={{ marginTop: '20px', marginBottom: '40px' }} >

                            <Grid item xs={12} sm={12} lg={4} >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', border: '1px solid #000', padding: '20px', borderRadius: '10px' }}>

                                    <h4> Análise do pedido</h4>

                                    {product && product.analise && product.analise.analise_pedido.path && product.analise.analise_pedido.status !== 'pendente' ? (
                                        <>
                                            <Box sx={{ display: 'flex' }}>
                                                <Button color="success" href={product.analise && product.analise.analise_pedido.path}><AiOutlineDownload size={25} /></Button>
                                            </Box>

                                            {product && product.analise && (
                                                <>


                                                    {product.analise.analise_pedido.status === 'reprovado' &&
                                                        <Alert severity="error">Relatório reprovado pela direção</Alert>
                                                    }

                                                    {product.analise.analise_pedido.status === 'aprovado' &&
                                                        <Alert severity="success">Análise de relatório concluída</Alert>
                                                    }
                                                </>
                                            )}
                                        </>

                                    ) :
                                        <Alert severity="info">Aguarde o laudo</Alert>
                                    }
                                </Box>

                            </Grid>

                            <Grid item xs={12} sm={12} lg={4} >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', border: '1px solid #000', padding: '20px', borderRadius: '10px' }}>

                                    <h4 >Vistoria</h4>

                                    {product && product.analise && product.analise.vistoria.path && product.analise.vistoria.status !== 'pendente' ? (
                                        <>
                                            <Box sx={{ display: 'flex' }}>
                                                <Button color="success" href={product.analise && product.analise.vistoria.path}><AiOutlineDownload size={25} /></Button>
                                            </Box>

                                            {product.analise && (
                                                <>

                                                    {product.analise.vistoria.status === 'reprovado' &&
                                                        <Alert severity="error">Relatório reprovado pela direção</Alert>
                                                    }

                                                    {product.analise.vistoria.status === 'aprovado' &&
                                                        <Alert severity="success">Análise de relatório concluída</Alert>
                                                    }
                                                </>
                                            )}
                                        </>

                                    ) :
                                        <Alert severity="info">Aguarde o laudo</Alert>
                                    }
                                </Box>

                            </Grid>

                            <Grid item xs={12} sm={12} lg={4} >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', border: '1px solid #000', padding: '20px', borderRadius: '10px' }}>

                                    <h4 >Análise Laboratorial</h4>

                                    {product && product.analise && product.analise.analise_laboratorial.path && product.analise.analise_laboratorial.status !== 'pendente' ? (
                                        <>
                                            <Box sx={{ display: 'flex' }}>
                                                <Button color="success" href={product.analise && product.analise.analise_laboratorial.path}><AiOutlineDownload size={25} /></Button>
                                            </Box>

                                            {product.analise && (
                                                <>

                                                    {product.analise.analise_laboratorial.status === 'reprovado' &&
                                                        <Alert severity="error">Relatório reprovado pela direção</Alert>
                                                    }

                                                    {product.analise.analise_laboratorial.status === 'aprovado' &&
                                                        <Alert severity="success">Análise de relatório concluída</Alert>
                                                    }
                                                </>
                                            )}

                                        </>

                                    ) :
                                        <Alert severity="info">Aguarde o laudo</Alert>
                                    }
                                </Box>

                            </Grid>

                        </Grid>



                    </>
                }

            </Container>
        </Box>
    )
}

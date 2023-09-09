import { Box, Container, CssBaseline, Typography, Button, CircularProgress, Link, Grid, Divider, useMediaQuery, Alert } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { styleError } from '../toastStyles'
import { AiOutlineDownload } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { getSingleProduct } from '../../features/products/productsSlice'

export default function ProductAnalise() {
    const { productData: product, isLoading } = useSelector((state) => state.products)
    const matches = useMediaQuery('(min-width:800px)')
    const dispatch = useDispatch()

    const { id } = useParams()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {

        dispatch(getSingleProduct(id))

    }, [id, dispatch]);

    return (
        <Container sx={{minHeight:'100vh'}}>

            {product &&
                <>
                    <Typography textAlign='center' variant='h5'>Acompanhe o Processo - {product.name}</Typography>

                    <Grid container spacing={2} sx={{ marginTop: '20px', marginBottom: '40px' }} >

                        <Grid item xs={12} sm={12} lg={3.9} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                                <Typography variant='h6'>Análise do pedido</Typography>
                                <Typography variant='p'>Parecer sobre os documentos do produtor</Typography>

                                {product.analise && product.analise.analise_pedido.path && product.analise.analise_pedido.status !== 'pendente' ? (
                                    <>
                                        <Box sx={{ display: 'flex' }}>
                                            <Button color="success" href={product.analise && product.analise.analise_pedido.path}><AiOutlineDownload size={25} /></Button>
                                        </Box>

                                        {product.analise && (
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

                        <Divider orientation="vertical" flexItem={matches} />

                        <Grid item xs={12} sm={12} lg={3.9} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                                <Typography variant='h6'>Vistoria</Typography>
                                <Typography variant='p'>Parecer do técnico sobre a cadeia produtiva</Typography>

                                {product.analise && product.analise.vistoria.path && product.analise.vistoria.status !== 'pendente' ? (
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

                        <Divider orientation="vertical" flexItem={matches} />


                        <Grid item xs={12} sm={12} lg={3.9} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                                <Typography variant='h6'>Análise Laboratorial</Typography>
                                <Typography variant='p'>Parecer do laboratório credenciado</Typography>

                                {product.analise && product.analise.analise_laboratorial.path && product.analise.analise_laboratorial.status !== 'pendente' ? (
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
    )
}

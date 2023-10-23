import React, { useEffect, useState } from 'react'
import { Box, Container, Grid } from '@mui/material'
import { AiOutlineWhatsApp, AiOutlineInstagram } from 'react-icons/ai'
import { colors } from '../../pages/colors'
import ProdutoresPagination from '../../components/Pagination/Produtores'

import useMediaQuery from '@mui/material/useMediaQuery';


export default function TodosProdutores() {

    const matches = useMediaQuery('(min-width:600px)')

    const [produtores, setProdutores] = useState([])

    const cidadesValidas = [
        'Águas de Lindóia',
        'Amparo',
        'Holambra',
        'Jaguariúna',
        'Lindóia',
        'Monte Alegre do Sul',
        'Pedreira',
        'Serra Negra',
        'Socorro',
    ]

    useEffect(() => {
        window.scrollTo(0, 0)
    }
        , [])

    return (
        <Box sx={{
            backgroundColor: colors.main_white,
            paddinBottom: '72px',
        }}>

            <Container maxWidth='xl'>
                <Box sx={{ padding: '72px 0', }}>
                    <h1 className='bold black'>
                        Produtores
                    </h1>
                    <h5 className='regular black'>
                        Conheça os produtores do circuito das águas paulistas
                    </h5>
                </Box>


                {cidadesValidas?.map((cidade, index) => (

                    <Grid container columnGap={'43px'} sx={{
                        paddingBottom: '35px',
                    }}>
                        <Grid item xs={12} pb={3}>
                            <h3 className='semi-bold'
                                style={{
                                    padding: '0 0 16px 0',
                                    fontWeight: 550, color: colors.main_blue_dark, borderBottom: `3px solid ${colors.main_blue_dark}`, maxWidth: !matches ? '100%' : '280px',
                                    textAlign: matches ? 'left' : 'center'
                                }} >
                                {cidade}
                            </h3>
                        </Grid>

                        {produtores[cidade?.toLowerCase()?.replaceAll(' ', '_')]?.length > 0 ? produtores[cidade?.toLowerCase()?.replaceAll(' ', '_')]?.map((produtor, index) => (
                            <Grid key={index} item xs={12} sm={12} md={6} lg={4} xl={2} pb={3} >
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '16px',
                                    border: `1px solid ${colors.main_blue_dark}`,
                                }}>

                                    <img src={produtor?.marca?.logo} alt='Logo da marca' width={matches ? '100%' : '100%'} height={matches ? 286 : 260} style={{
                                        objectFit: 'cover'

                                    }} />


                                    <Box sx={{
                                        backgroundColor: colors.main_blue_dark,
                                        padding: '24px',
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}>
                                        <div>
                                            <a target='_blank' rel="noreferrer" href={produtor?.marca?.site ? `https://${produtor?.marca?.site} ` : `https://www.google.com/maps/dir//${produtor?.propriedade?.logradouro_propriedade}%20-%20${produtor?.propriedade?.cidade_propriedade},%20${produtor?.propriedade?.estado_propriedade},%20${produtor?.propriedade?.cep_propriedade}/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x94c6c6b0a0a0a0a7:0x1b0b0b0b0b0b0b0b?sa=X&ved=2ahUKEwjJ6Z7X2Z7zAhVYIbkGHXZrDZIQ9RcwDHoECBQQBQ`} style={{ textDecorationColor: colors.main_white }}>
                                                <h3 className='white semi-bold'>
                                                    {produtor.propriedade.nome_propriedade}
                                                </h3>
                                            </a>
                                        </div>

                                        <Box sx={{
                                            display: 'flex',
                                            gap: '3px',
                                        }}>
                                            <a href={`https://api.whatsapp.com/send?phone=55${produtor.marca.whatsapp}`} target='_blank' rel="noreferrer" style={{ textDecorationColor: colors.main_white }}>
                                                <AiOutlineWhatsApp size={20} style={{ color: colors.main_white }} />
                                            </a>
                                            <a href={`https://www.instagram.com/${produtor.marca.instagram}`} target='_blank' rel="noreferrer" style={{ textDecorationColor: colors.main_white }}>
                                                <AiOutlineInstagram size={20} style={{ color: colors.main_white }} />
                                            </a>
                                        </Box>

                                    </Box>

                                </Box>

                            </Grid>

                        )) :
                            <Grid item xs={12} lg={6} >
                                <h3 className='semi-bold' style={{ color: colors.main_blue_dark }}>
                                    Produtores ainda não cadastrados
                                </h3>

                            </Grid>
                        }
                        <Grid item xs={12} lg={12}>

                            <ProdutoresPagination setProdutoresData={(produtor) => setProdutores(produtor)} cidade={cidade} />

                        </Grid>

                    </Grid>
                ))}

            </Container>

        </Box>
    )
}

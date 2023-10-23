import React, { useEffect, useRef, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Grid,  Typography, useMediaQuery } from '@mui/material';
import { colors } from '../colors';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Styles.css'
import { getMembros,  } from '../../features/admin/adminSlice';
import {  AiOutlineInstagram, AiOutlineWhatsApp } from 'react-icons/ai';
import Footer from '../../components/Footer/Footer';
import { BsArrowUpRight,  } from 'react-icons/bs';
import { BiMinus, BiPlus } from 'react-icons/bi';
import ProdutoresPagination from '../../components/Pagination/Produtores';

export default function QuemSomos() {

    const dispatch = useDispatch();
    const { membros } = useSelector(state => state.admin)
    const [produtores, setProdutores] = useState([])

    const location = useLocation();
    const lastHash = useRef('');

    const navigate = useNavigate()

    const matches = useMediaQuery('(min-width:600px)')

    const [expanded, setExpanded] = useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    useEffect(() => {

        dispatch(getMembros())

    }
        , [dispatch])

    useEffect(() => {
        if (location.hash) {
            lastHash.current = location.hash.slice(1); 
        }

        if (lastHash.current && document.getElementById(lastHash.current)) {
            setTimeout(() => {
                document
                    .getElementById(lastHash.current)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                lastHash.current = '';
            }, 100);
        }
    }, [location]);



    return (
        <>
            <Box  id='associacao' sx={{
                backgroundColor: colors.main_blue,
                padding: '80px 0 150px 0',

            }}>
                <Container maxWidth='xl'>
                    <Grid container rowSpacing={5} pb={'100px'} >
                        <Grid item xs={12} lg={6}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '40px',

                            }}>
                                <h1 className='white bold'>
                                    Sobre a Associação e seus trabalhos nessa seção
                                </h1>
                                <h4 className='white regular'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                    sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                    sit amet blandit leo lobortis eget.

                                    <br />
                                    <br />

                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                    sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                    sit amet blandit leo lobortis eget.
                                </h4>

                            </Box>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: matches ? 'flex-end' : 'center',
                            }}>
                                <img src='https://placehold.co/385x289' alt='imagem' width={matches ? 385 : '95%'} />
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container columnSpacing={2} rowSpacing={4} >
                        {membros?.length > 0 ? membros.slice(0, 4).map((membro, index) => (
                            <Grid key={index} item xs={12} lg={3}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>

                                    <img src={membro?.dados_pessoais?.profilePhoto} alt='imagem' width={matches ? 200 : '55%'} height={matches ? 286 : 260} style={{
                                        objectFit: 'cover'

                                    }} />

                                    <div style={{ textAlign: 'center' }}>
                                        <h3 className='white medium'>
                                            {membro.role.charAt(0).toUpperCase() + membro.role.slice(1)}
                                        </h3>
                                        <h4 className='white regular'>
                                            {membro.dados_pessoais.name.split(' ')[0]} {membro.dados_pessoais.name.split(' ')[membro.dados_pessoais.name.split(' ').length - 1]}
                                        </h4>
                                    </div>

                                </Box>
                            </Grid>

                        )) :
                            <Grid item xs={12} lg={6}>
                                <h2 className='white'>
                                    Membros da associção ainda não cadastrados
                                </h2>
                            </Grid>
                        }
                    </Grid>



                </Container>


            </Box>


            <Box sx={{
                backgroundColor: colors.main_white,
                position: 'relative',
            }}>

                <div className="custom-shape-divider-top-1697630840">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M1200 0L0 0 598.97 114.72 1200 0z" className="shape-fill"></path>
                    </svg>
                </div>


                <Container id='produtores' maxWidth='xl'>

                    <Grid container rowSpacing={5} pt={10} pb={10} columnGap={'43px'} >
                        <Grid item xs={12}>
                            <h3 className='semi-bold'
                                style={{
                                    padding: '0 0 16px 0',
                                    fontWeight: 550, color: colors.main_blue_dark, borderBottom: `3px solid ${colors.main_blue_dark}`, width: !matches ? '100%' : '280px',
                                    textAlign: matches ? 'left' : 'center'
                                }} >
                                Produtores em Amparo
                            </h3>
                        </Grid>

                        {produtores?.amparo?.length > 0 ? produtores?.amparo?.map((produtor, index) => (
                            <Grid key={index} item xs={12} lg={3} xl={2} >
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
                                        <a target='_blank' rel="noreferrer" href={produtor?.marca?.site ? `https://${produtor?.marca?.site} `: `https://www.google.com/maps/dir//${produtor?.propriedade?.logradouro_propriedade}%20-%20${produtor?.propriedade?.cidade_propriedade},%20${produtor?.propriedade?.estado_propriedade},%20${produtor?.propriedade?.cep_propriedade}/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x94c6c6b0a0a0a0a7:0x1b0b0b0b0b0b0b0b?sa=X&ved=2ahUKEwjJ6Z7X2Z7zAhVYIbkGHXZrDZIQ9RcwDHoECBQQBQ`} style={{ textDecorationColor: colors.main_white }}>
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
                            <Grid item xs={12} lg={6}>
                                <h3 className='semi-bold' style={{ color: colors.main_blue_dark }}>
                                    Produtores ainda não cadastrados
                                </h3>

                            </Grid>
                        }
                        <Grid item xs={12} lg={12}>

                            <ProdutoresPagination setProdutoresData={(produtor) => setProdutores(produtor)} cidade={'Amparo'} />

                        </Grid>

                    </Grid>

                    <Grid container rowSpacing={5} pb={10} columnGap={'43px'} >
                        <Grid item xs={12}>
                            <h3 className='semi-bold'
                                style={{
                                    padding: '0 0 16px 0',
                                    fontWeight: 550, color: colors.main_blue_dark, borderBottom: `3px solid ${colors.main_blue_dark}`, width: !matches ? '100%' : '280px',
                                    textAlign: matches ? 'left' : 'center'
                                }} >
                                Produtores em Serra Negra
                            </h3>
                        </Grid>

                        {produtores?.serra_negra?.length > 0 ? produtores?.serra_negra?.map((produtor, index) => (
                            <Grid key={index} item xs={12} lg={3} xl={2} >
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
                                        <a target='_blank' rel="noreferrer" href={produtor?.marca?.site ? `https://${produtor?.marca?.site} `: `https://www.google.com/maps/dir//${produtor?.propriedade?.logradouro_propriedade}%20-%20${produtor?.propriedade?.cidade_propriedade},%20${produtor?.propriedade?.estado_propriedade},%20${produtor?.propriedade?.cep_propriedade}/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x94c6c6b0a0a0a0a7:0x1b0b0b0b0b0b0b0b?sa=X&ved=2ahUKEwjJ6Z7X2Z7zAhVYIbkGHXZrDZIQ9RcwDHoECBQQBQ`} style={{ textDecorationColor: colors.main_white }}>
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
                            <Grid item xs={12} lg={6}>
                                <h3 className='semi-bold' style={{ color: colors.main_blue_dark }}>
                                    Produtores ainda não cadastrados
                                </h3>

                            </Grid>
                        }

                        <Grid item xs={12} lg={12}>

                            <ProdutoresPagination setProdutoresData={(produtor) => setProdutores(produtor)} cidade={'Holambra'} />

                        </Grid>

                        <Grid item xs={12} lg={6}>

                            <Link to='/todos-produtores' style={{
                                textUnderlineOffset: '8px',
                                textDecorationColor: colors.main_blue_dark,
                                textDecorationThickness: '3px',
                                textDecorationLine: 'underline',

                            }}>

                                <h4 className='semi-bold italic' style={{ color: colors.main_blue_dark, textAlign: matches ? 'start' : 'center' }}>
                                    Todas Cidades
                                </h4>
                            </Link>
                        </Grid>

                    </Grid>

                </Container>

            </Box>

            <Box sx={{
                backgroundColor: colors.main_light_blue,
                position: 'relative',
                minHeight: '300px',
            }}>

                <div className="custom-shape-divider-top-1697630736">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M1200 0L0 0 598.97 114.72 1200 0z" className="shape-fill"></path>
                    </svg>
                </div>

                <Container maxWidth='xl' id='ig'>

                    <Grid container rowSpacing={5} pb={'100px'} pt={12} >
                        <Grid item xs={12} lg={6}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '40px',

                            }}>
                                <h1 style={{}} className='white bold'>
                                    Sobre a Indicação Geográfica, seu processo e siguinificado
                                </h1>
                                <h4 className='white regular'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                    sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                    sit amet blandit leo lobortis eget.

                                    <br />
                                    <br />

                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                    sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                    sit amet blandit leo lobortis eget.

                                    <br />
                                    <br />

                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                    sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                    sit amet blandit leo lobortis eget.
                                </h4>

                            </Box>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: matches ? 'flex-end' : 'center',
                            }}>
                                <img src='https://placehold.co/385x289' alt='imagem' width={matches ? 385 : '95%'} />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>

            </Box>

            <Box sx={{
                backgroundColor: colors.main_white,
                position: 'relative',
                minHeight: '300px',
            }}>

                <div className="custom-shape-divider-top-1697630909">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M1200 0L0 0 598.97 114.72 1200 0z" className="shape-fill"></path>
                    </svg>
                </div>
                <Container id='associar' maxWidth='xl'>

                    <Box sx={{
                        padding: '160px 0 120px 0',
                    }}>
                        <h1 style={{
                            textAlign: 'center',
                        }} className='black bold'>
                            Você também pode ser um <br /> produtor associado!
                        </h1>

                        <Grid container pt={12} columnSpacing={'228px'} rowSpacing={'64px'} >

                            <Grid item xs={12} lg={6}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px'
                                }}>
                                    <h3 className='semi-bold black'>
                                        Requisitos
                                    </h3>

                                    <h4 className='regular black'>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem architecto voluptas magnam ea dolores, id cupiditate esse pariatur voluptatem? Deleniti, perspiciatis
                                        illum amet sapiente suscipit repudiandae eaque voluptates quo temporibus.

                                    </h4>

                                </Box>

                            </Grid>

                            <Grid item xs={12} lg={6}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px'
                                }}>
                                    <h3 className='semi-bold black'>
                                        Primeira Etapa
                                    </h3>

                                    <h4 className='regular black'>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem architecto voluptas magnam ea dolores, id cupiditate esse pariatur voluptatem? Deleniti, perspiciatis
                                        illum amet sapiente suscipit repudiandae eaque voluptates quo temporibus.

                                    </h4>

                                </Box>

                            </Grid>

                            <Grid item xs={12} lg={6}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px'
                                }}>
                                    <h3 className='semi-bold black'>
                                        Segunda Etapa
                                    </h3>

                                    <h4 className='regular black'>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem architecto voluptas magnam ea dolores, id cupiditate esse pariatur voluptatem? Deleniti, perspiciatis
                                        illum amet sapiente suscipit repudiandae eaque voluptates quo temporibus.

                                    </h4>

                                </Box>

                            </Grid>

                            <Grid item xs={12} lg={6}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px'
                                }}>
                                    <h3 className='semi-bold black'>
                                        Última Etapa
                                    </h3>

                                    <h4 className='regular black'>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem architecto voluptas magnam ea dolores, id cupiditate esse pariatur voluptatem? Deleniti, perspiciatis
                                        illum amet sapiente suscipit repudiandae eaque voluptates quo temporibus.

                                    </h4>

                                </Box>

                            </Grid>

                        </Grid>




                    </Box>

                </Container>

            </Box>

            <Box sx={{
                backgroundColor: colors.main_white,
                minHeight: '300px',
                paddingBottom: '120px'
            }}>

                <Container maxWidth='md' id='faq'>
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={12} >

                        </Grid>

                        <Grid item sm={12} >
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '40px'
                            }}>
                                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{
                                    backgroundColor: colors.main_white,
                                    boxShadow: 'none',

                                }}>
                                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }} >


                                            <h3 className={expanded !== 'panel1' ? 'black semi-bold' : 'semi-bold'} >
                                                Quais documentos preciso enviar ?
                                            </h3>

                                            <div style={{
                                                color: expanded === 'panel1' ? colors.main_purple : colors.main_black,
                                            }}>
                                                {expanded === 'panel1' ? <BiMinus size={20} /> : <BiPlus size={20} />}

                                            </div>

                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                            sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                            sit amet blandit leo lobortis eget.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{
                                    backgroundColor: colors.main_white,
                                    boxShadow: 'none',

                                }}>
                                    <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }} >


                                            <h3 className={expanded !== 'panel2' ? 'black semi-bold' : 'semi-bold'} >
                                                Todo o processo ocorre virtualmente ?
                                            </h3>

                                            <div style={{
                                                color: expanded === 'panel2' ? colors.main_purple : colors.main_black,
                                            }}>
                                                {expanded === 'panel2' ? <BiMinus size={20} /> : <BiPlus size={20} />}

                                            </div>

                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                            sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                            sit amet blandit leo lobortis eget.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>


                                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{
                                    backgroundColor: colors.main_white,
                                    boxShadow: 'none',

                                }}>
                                    <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }} >


                                            <h3 className={expanded !== 'panel3' ? 'black semi-bold' : 'semi-bold'} >
                                                Posso recorrer caso não seja aprovado ?
                                            </h3>

                                            <div style={{
                                                color: expanded === 'panel3' ? colors.main_purple : colors.main_black,
                                            }}>
                                                {expanded === 'panel3' ? <BiMinus size={20} /> : <BiPlus size={20} />}

                                            </div>

                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                            sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                            sit amet blandit leo lobortis eget.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} sx={{
                                    backgroundColor: colors.main_white,
                                    boxShadow: 'none',

                                }}>
                                    <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }} >


                                            <h3 className={expanded !== 'panel4' ? 'black semi-bold' : 'semi-bold'} >
                                                O processo de associação dura quanto tempo ?
                                            </h3>

                                            <div style={{
                                                color: expanded === 'panel4' ? colors.main_purple : colors.main_black,
                                            }}>
                                                {expanded === 'panel4' ? <BiMinus size={20} /> : <BiPlus size={20} />}

                                            </div>

                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                            sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                            sit amet blandit leo lobortis eget.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} sx={{
                                    backgroundColor: colors.main_white,
                                    boxShadow: 'none',

                                }}>
                                    <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }} >


                                            <h3 className={expanded !== 'panel5' ? 'black semi-bold' : 'semi-bold'} >
                                                Onde posso tirar outras dúvidas ?
                                            </h3>

                                            <div style={{
                                                color: expanded === 'panel5' ? colors.main_purple : colors.main_black,
                                            }}>
                                                {expanded === 'panel5' ? <BiMinus size={20} /> : <BiPlus size={20} />}

                                            </div>

                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                            sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                            sit amet blandit leo lobortis eget.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                            </Box>

                        </Grid>



                    </Grid>

                </Container>

            </Box>

            <Box sx={{
                backgroundColor: colors.main_white,
                minHeight: '300px',
                paddingBottom: '120px'
            }}>

                <Container maxWidth='lg'>
                    <Grid container rowSpacing={5}>

                        <Grid item xs={12} lg={6}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>
                                <h1>
                                    Você também pode ser um produtor APCCAP.
                                </h1>
                                <h3 className='regular'>
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos ut, porro harum temporibus nobis libero praesentium quo ipsam explicabo laborum beatae nisi voluptates fuga delectus ex, vel magni in sint!
                                </h3>
                            </Box>
                        </Grid>

                        <Grid item xs={12} lg={6} alignSelf={'center'}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: matches ? 'flex-end' : 'center',
                            }}>
                                <button onClick={() => navigate('/registrar')} className='button-purple' style={{
                                    padding: '24px 48px',
                                }}>
                                    Quero me associar <BsArrowUpRight size={25} style={{ verticalAlign: 'bottom' }} />
                                </button>
                            </Box>

                        </Grid>

                    </Grid>

                </Container>

            </Box>

            <Footer />

        </>
    )
}
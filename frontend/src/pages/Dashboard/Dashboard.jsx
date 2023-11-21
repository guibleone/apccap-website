import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Typography, Box, CssBaseline, CircularProgress, useMediaQuery, Grid, Card, Avatar, Container, } from '@mui/material';
import Secretary from "./Acesses/Secretario/Secretary"
import Tesoureiro from "./Acesses/Tesoureiro/Tesoureiro"
import President from "./Acesses/Presidente/President"
import Admin from "./Acesses/Admin/Admin"
import { getSubscription } from "../../features/payments/paymentsSlice"
import Conselho from "./Acesses/Conselho/Conselho";
import { CiCircleCheck } from 'react-icons/ci'
import './Style.css'
import { AiOutlineArrowRight, AiOutlineInstagram, AiOutlineWhatsApp } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { colors } from '../colors'
import { getDocuments } from "../../features/documents/documentsSlice";
import Produtor from "./Acesses/Produtor/Produtor";
import ProdutoresPagination from "../../components/Pagination/Produtores";
import PublicationsPagination from "../../components/Pagination/Publications";


function Dashboard() {


  const { user } = useSelector((state) => state.auth)
  const { isLoading: isLoadingPayments } = useSelector((state) => state.payments)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [produtores, setProdutores] = useState([])
  const [publications, setPublications] = useState([])


  const matches = useMediaQuery('(max-width:800px)')


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const img = new Image();
    img.src = require('../../imgs/seloFoto.png');
  }, []);


  useEffect(() => {

    if (user) {

      const userData = {
        cpf: user.dados_pessoais.cpf,
        token: user.token
      }

      dispatch(getSubscription(userData))
      dispatch(getDocuments(user.token))
    }

  }, [user, dispatch])

  if (isLoadingPayments) {

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
    <Box>
      <CssBaseline />

      {(!user) ? (
        <>
          <div className="header">
            <div className="text-side">
              <h1 style={{ fontWeight: 700 }}>
                Busque pela cachaça que adiquiriu e saiba mais sobre sua procedência
              </h1>

              <div className="rastrear">

                <Link to={'/rastreabilidade'} className="link" style={{
                  borderBottom: '3px solid #140C9F',
                }}>

                  <h3 >
                    Rastrear
                  </h3>

                  <div>
                    <CiCircleCheck size={30} />
                  </div>

                </Link>

              </div>
            </div>

            {!matches && (<>
              <img src={require('../../imgs/seloFoto.png')} alt="rastreio" />
            </>)}


          </div>

          <section className="festival" onClick={() => navigate('/festival-cachaca')}>
            <div className="texto-festival">
              <h1>
                Festival da Cachaça
              </h1>
              <h3>
                8, 19 e 20 de Outubro
              </h3>

            </div>

            <div className="image-festival">
              <img src={require('../../imgs/logo-branco.png')} alt="logo" className="logo-festival" />
            </div>
          </section>

          <Grid container spacing={2} pl={matches ? 0 : 34} className="associação">

            <Grid item xs={12} lg={7}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: matches ? '100%' : '452px',
                gap: '40px',
                color: '#140C9F',
                padding: matches ? '0 20px' : '',
              }}>
                <h1 style={{ fontWeight: 700, fontSize: matches ? '26px' : '' }}>
                  Conheça a história <br />
                  da APCCAP
                </h1>
                <h4 style={{ fontWeight: 400, fontSize: matches ? '14px' : '' }}>
                  Lorem ipsum dolor sit amet consectetur. Id consequat non enim nulla tempus ridiculus sed vitae. Aliquam euismod sagittis nisl condimentum id.
                  Magna mi nisi velit diam tellus mauris ultrices nunc. Tincidunt tortor ullamcorper ornare vitae odio. Diam sed in tempor eu. Id risus in facilisi consectetur.
                </h4>
              </Box>

            </Grid>

            <Grid item xs={12} lg={5} >
              <Box sx={{
                display: 'flex',
                padding: matches ? ' 20px' : '0',
              }}>

                <img src={'https://placehold.co/382x289'} alt="associacao" style={{ width: matches ? '100%' : '350px' }} />

              </Box>

            </Grid>

          </Grid>
          {/* Produtores */}

          <Grid container spacing={2} pl={matches ? 0 : 34} pt={matches && 0} className="produtores">

            <Grid item xs={12} lg={7}>

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: matches ? '100%' : '482px',
                gap: '40px',
                color: '#140C9F',
                padding: matches ? ' 20px' : '0',
              }}>
                <h1 style={{ fontWeight: 700, fontSize: matches ? '26px' : '' }}>
                  Nossos produtores estão no Circuito das Águas Paulistas
                </h1>
                <h4 style={{ fontWeight: 400, fontSize: matches ? '14px' : '' }}>
                  Lorem ipsum dolor sit amet consectetur. Id non enim nulla tempus ridiculus sed vitae. Lorem ipsum dolor sit amet consectetur, id non enim nulla tempus ridiculus sed vitae.
                </h4>
              </Box>

            </Grid>

            <Grid item xs={12} lg={5} >
              <Box sx={{
                display: 'flex',
                padding: matches ? ' 20px' : '0',
              }}>

                <img src={require('../../imgs/Mapsicle Map.png')} alt="associacao" style={{ width: matches ? '100%' : '350px' }} />

              </Box>

            </Grid>


          </Grid>

          {/* Lojas */}

          <Grid container spacing={2} rowSpacing={'70px'} sx={{ backgroundColor: colors.main_white, padding: '80px 0 80px 0' }}>

            <Grid item xs={12} lg={12}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <h1 style={{ color: colors.main_black, fontWeight: 700 }}>
                  Onde Encontrar ?
                </h1>
                <h4 style={{ color: colors.main_black, fontWeight: 400 }}>
                  Confira nossos produtores
                </h4>
              </Box>
            </Grid>

            <Grid item xs={12} lg={12}>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: matches ? 'column' : 'row',
                gap: '20px',
                alignItems: 'center',
              }}>
                {
                  produtores?.todos?.map((produtor, index) => (
                    <div key={index}>
                      <Card sx={{ width: '260px', height: '162px', display: 'flex', flexDirection: 'column', gap: '25px', padding: '20px', borderRadius: '0', border: ' 1.7px solid #0B0B0B' }}>

                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '20px',

                        }}>
                          <a target='_blank' rel="noreferrer" href={produtor?.marca?.site ? `https://${produtor?.marca?.site} ` : `https://www.google.com/maps/dir//${produtor?.propriedade?.logradouro_propriedade}%20-%20${produtor?.propriedade?.cidade_propriedade},%20${produtor?.propriedade?.estado_propriedade},%20${produtor?.propriedade?.cep_propriedade}/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x94c6c6b0a0a0a0a7:0x1b0b0b0b0b0b0b0b?sa=X&ved=2ahUKEwjJ6Z7X2Z7zAhVYIbkGHXZrDZIQ9RcwDHoECBQQBQ`}>
                            <h4 style={{ color: colors.main_black, fontWeight: 600 }}>
                              {produtor.propriedade.nome_propriedade}
                            </h4>
                          </a>

                          <Avatar src={produtor?.marca?.logo} alt="avatar" sx={{ width: '45px', height: '45px' }} />

                        </Box>

                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '40px',

                        }}>
                          <h6 style={{ color: colors.main_black, fontWeight: 500 }}>
                            <a href={`https://www.google.com/maps/dir//${produtor?.propriedade?.logradouro_propriedade}%20-%20${produtor?.propriedade?.cidade_propriedade},%20${produtor?.propriedade?.estado_propriedade},%20${produtor?.propriedade?.cep_propriedade}/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x94c6c6b0a0a0a0a7:0x1b0b0b0b0b0b0b0b?sa=X&ved=2ahUKEwjJ6Z7X2Z7zAhVYIbkGHXZrDZIQ9RcwDHoECBQQBQ`} target='_blank' rel="noreferrer"
                              style={{ textDecoration: 'none', color: colors.main_black }}>
                              {produtor?.propriedade?.logradouro_propriedade},  {produtor?.propriedade?.cidade_propriedade} -  {produtor?.propriedade?.estado_propriedade},  {produtor?.propriedade?.cep_propriedade}
                            </a>
                          </h6>

                          <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column', paddingRight: '10px' }}>
                            <a href={`https://api.whatsapp.com/send?phone=55${produtor.marca.whatsapp}`} target='_blank' rel="noreferrer" style={{ textDecorationColor: colors.main_white }}>
                              <AiOutlineWhatsApp size={20} style={{ color: colors.main_black }} />
                            </a>
                            <a href={`https://www.instagram.com/${produtor.marca.instagram}`} target='_blank' rel="noreferrer" style={{ textDecorationColor: colors.main_black }}>
                              <AiOutlineInstagram size={20} style={{ color: colors.main_black }} />
                            </a>
                          </Box>

                        </Box>


                      </Card>

                    </div>))}

              </Box>

              <ProdutoresPagination setProdutoresData={(produtor) => setProdutores(produtor)} cidade={'todos'} pages={6} />

            </Grid>

          </Grid>

          {/* Não Associado */}

          <Grid container spacing={2} pl={matches ? 0 : 34} className="nao-associado">

            <Grid item xs={12} lg={7}>

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: matches ? '100%' : '542px',
                gap: '40px',
                color: colors.main_purple,
                padding: matches ? ' 20px' : '0',
              }}>
                <h1 style={{ fontWeight: 700, fontSize: matches ? '26px' : '' }}>
                  Você também pode se tornar um produtor da APCCAP
                </h1>
                <h4 style={{ fontWeight: 400, fontSize: matches ? '14px' : '' }}>
                  Lorem ipsum dolor sit amet consectetur. Id non enim nulla tempus ridiculus sed vitae. Lorem ipsum dolor sit amet consectetur, id non enim nulla tempus ridiculus sed vitae.
                </h4>
                <h4 style={{ fontWeight: 400, fontSize: matches ? '14px' : '' }}>
                  Lorem ipsum dolor sit amet consectetur. Id non enim nulla tempus ridiculus sed vitae. Lorem ipsum dolor sit amet consectetur, id non enim nulla tempus ridiculus sed vitae.
                </h4>

                <Link to={'/quem-somos#associar'} className="saiba-mais">
                  <h3>
                    Saiba mais
                  </h3>
                </Link>

              </Box>

            </Grid>

            <Grid item xs={12} lg={5} >
              <Box sx={{
                display: 'flex',
                padding: matches ? ' 20px ' : '0',
              }}>

                <img src={'https://placehold.co/352x289'} alt="associacao" style={{ width: matches ? '100%' : '350px' }} />

              </Box>

            </Grid>

          </Grid>

          {/* Notícias */}
          <Box sx={{
            backgroundColor: colors.main_white,
          }}>
            <Container maxWidth='xl' >
              <Grid container spacing={2} pt={matches && 0} padding={matches ? 0 : '0 52px'} className="noticias">

                <Grid item xs={12} lg={12}>

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: matches ? ' 20px' : '0',
                    flexDirection: matches ? 'column' : 'row',
                  }}>

                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      width: matches ? '100%' : '542px',
                    }}>
                      <h1 style={{ fontWeight: 700, fontSize: matches ? '26px' : '', color: colors.main_purple, }}>
                        Acompanhe as notícias
                      </h1>
                      <h4 style={{ fontWeight: 400, fontSize: matches ? '14px' : '', color: colors.main_purple, }}>
                        Lorem ipsum dolor sit amet consectetur. Id non enim nulla tempus ridiculus sed vitae
                      </h4>
                    </Box>

                    {!matches && (<>
                      <Link to='/blog' style={{ textDecoration: 'none' }}>
                        <Box sx={{ display: 'flex', gap: '10px' }} className='ver-mais'>
                          <h3>
                            Ver Mais
                          </h3>
                          <AiOutlineArrowRight style={{ verticalAlign: 'bottom', color: colors.main_purple, }} size={20} />
                        </Box>
                      </Link>
                    </>)}


                  </Box>

                </Grid>

                <Grid

                  item xs={12} lg={12} pt={matches && 0} sx={{

                    '&:hover': {
                      cursor: 'pointer',
                    }
                  }} >
                  <Box sx={{
                    display: 'flex',
                    flexDirection: matches ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0px',
                    marginTop: matches ? '-40px' : '0',
                  }}>

                    {publications.map((publication, index) => (
                      <div key={index} onClick={() => navigate(`/blog/${publication._id}`)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', padding: matches ? '30px' : 0 }}>

                          <img src={publication?.thumbnail.url} alt="associacao" style={{ width: matches ? '100%' : '400px', height: matches ? '205px' : '255px', objectFit: 'cover' }} />

                          <Box sx={{ display: 'flex', gap: '24px', flexDirection: 'column', maxWidth: '400px', padding: '40px 30px' }}>
                            <Box>
                              <Link className="temas" ><h5 >{publication.theme}</h5></Link>
                              <h3 style={{ color: colors.main_black }}>
                                {publication?.title}
                              </h3>
                            </Box>

                            <div className='regular black' style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: publication?.description.length > 150 ? publication.description.substring(0, 150) + '...' : publication.description }} />

                            <Box sx={{ display: 'flex', gap: '10px' }}>
                              <Avatar src={publication?.author?.profilePhoto} alt="avatar" sx={{ width: '45px', height: '45px' }} />

                              <Box sx={{ display: 'flex', gap: '45px' }}>
                                <div>
                                  <h5 style={{ color: colors.main_black, fontWeight: 600, fontSize: '14px' }}>{publication.author.name.split(' ')[0]} {publication.author.name.split(' ')[publication.author.name.split(' ').length - 1]}</h5>
                                  <h5 style={{ color: colors.main_black, fontWeight: 500, fontStyle: 'italic', fontSize: '11px' }}>{publication?.author?.role === 'admin' ? 'Administrador' : publication?.author?.role}</h5>
                                </div>


                                <h5 style={{ color: colors.main_black, fontWeight: 500, fontSize: '11px', justifySelf: 'flex-end', alignSelf: 'center' }}>{publication?.publication_date.split('-')[2].split('T')[0]}/{publication?.publication_date.split('-')[1]}/{publication?.publication_date.split('-')[0]}</h5>
                              </Box>

                            </Box>

                          </Box>

                        </Box>
                      </div>

                    ))}



                    {matches && (<>
                      <Link to='/blog' style={{ textDecoration: 'none', paddingBottom: matches ? '0px' : '120px' }}>
                        <Box sx={{ display: 'flex', gap: '10px' }} className='ver-mais'>
                          <h3>
                            Ver Mais
                          </h3>
                          <AiOutlineArrowRight style={{ verticalAlign: 'bottom', color: '#140C9F' }} size={20} />
                        </Box>
                      </Link>
                    </>)}
                  </Box>

                </Grid>



              </Grid>
            </Container>

            <PublicationsPagination setPublicationsData={(p) => setPublications(p)} pages={3} invisible={true} />

          </Box>

          <Footer />

        </>

      ) : (

        <>

          {(user.role === "produtor" || user.role === 'produtor_associado') && (
            <Produtor />
          )}

          {(user.role === "admin") && (
            <Admin />
          )}

          {(user.role === 'secretario') && (
            <Secretary />
          )}

          {(user.role === 'tesoureiro') && (
            <Tesoureiro />
          )}

          {(user.role === 'presidente') && (
            <President />
          )}

          {(user.role === 'conselho') && (
            <Conselho />
          )}

        </>
      )
      }

    </Box>

  )
}

export default Dashboard
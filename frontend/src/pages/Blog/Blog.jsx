import React, { useCallback, useEffect } from 'react'
import { Container, Box, Grid, useMediaQuery, Avatar } from '@mui/material'
import { colors } from '../colors'
import { useDispatch, useSelector } from 'react-redux';
import PublicationsPagination from '../../components/Pagination/Publications';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// import required modules
import { Autoplay } from 'swiper/modules';
import { BiDollarCircle, BiSolidBook, BiSolidBookAlt, BiSolidBookBookmark, BiSolidBookContent, BiSolidFactory, BiTrophy } from 'react-icons/bi';
import { BsArrowUpRight, BsLightbulb } from 'react-icons/bs';
import Footer from '../../components/Footer/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetSinglePublication } from '../../features/blog/blogSlice';

function Blog() {

  const matches = useMediaQuery('(min-width:600px)');
  const [publicationsData, setPublications] = React.useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { destaques } = useSelector(state => state.blog)

  const temas = [
    'Produção',
    'Resultados de Competições',
    'Tendências e Inovações',
    'Mercado e Vendas',
    'Legislação',
    'História e Cultura',
    'Selos e IG',
    'Associação'
  ]

  const icons = [
    <BiSolidFactory size={30} style={{ verticalAlign: 'bottom', marginRight: '5px' }} />,
    <BiTrophy size={30} style={{ verticalAlign: 'bottom', marginRight: '5px' }} />,
    <BsLightbulb size={30} style={{ verticalAlign: 'bottom', marginRight: '5px' }} />,
    <BiDollarCircle size={30} style={{ verticalAlign: 'bottom', marginRight: '5px' }} />,
    <BiSolidBook size={30} style={{ verticalAlign: 'bottom', marginRight: '5px' }} />,
    <BiSolidBookAlt size={30} style={{ verticalAlign: 'bottom', marginRight: '5px' }} />,
    <BiSolidBookBookmark size={30} style={{ verticalAlign: 'bottom', marginRight: '5px' }} />,
    <BiSolidBookContent size={30} style={{ verticalAlign: 'bottom', marginRight: '5px' }} />,
  ]

  const [theme, setTheme] = React.useState(undefined)

  const handleNavigateTheme = (tema) => {

    setTheme(tema)

    const formatedTheme = tema?.replaceAll(' ', '-').toLowerCase()

    navigate(`/blog?theme=${formatedTheme}`)
  }

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isTheme = searchParams.get('theme');
  const formatedTheme = isTheme?.replaceAll('-', ' ')?.toUpperCase()

  const loadPublications = useCallback(() => {

    if (!theme) {
      if (matches) {
        window.scrollTo(0, 580);
      } else {
        window.scrollTo(0, 680);
      }
    }
  }, [matches, theme]);

  useEffect(() => {
    window.scrollTo(0, 0);

    dispatch(resetSinglePublication())

  }, [isTheme]);

  return (
    <>
      {isTheme ? (
        <>
          <Box sx={{
            backgroundColor: colors.main_white,
          }}>
            <Container maxWidth='xl'>
              <Grid container spacing={2} >
                <Grid item xs={12} lg={12} >
                  <Box sx={{ textAlign: 'center', padding: '80px 0', }}>
                    <h1 className='bold black'>
                      Categoria
                    </h1>
                    <h5 className='regular black'>
                      Notícias relacionadas ao tema de pesquisa
                    </h5>

                    <h4 className='semi-bold black' style={{ marginTop: '48px' }}>
                      <Link to='/blog' onClick={() => setTheme(undefined)}>BLOG</Link> &gt; {formatedTheme}
                    </h4>

                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>) : (
        <>

          {/* Destaques */}

          <Box sx={{ backgroundColor: colors.main_blue, padding: '80px 0', paddingBottom: '0px' }}>
            <Container maxWidth='xl'>
              <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay]}
              >
                {destaques?.map((destaque, index) => (
                  <SwiperSlide key={index} style={{
                    margin: 0,
                    padding: 0
                  }}>
                    <Grid container rowSpacing={8} columnSpacing={2}>
                      <Grid item xs={12} md={7}>
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '40px',
                        }}>
                          <Box>

                            <h5 className='white medium' style={{
                              border: `1px solid ${colors.main_white}`,
                              width: 'fit-content',
                              padding: '5px 20px',
                              borderRadius: '35px',
                              marginBottom: '25px'
                            }}>
                              Promovido
                            </h5>

                            <h1 className='white bold'>
                              {destaque.title}
                            </h1>

                            <h5 className='regular' style={{ color: '#9B9C9E' }}>
                              Por <span style={{ marginRight: '10px' }} className='underline'>{destaque.author.name.split(' ')[0]} {destaque.author.name.split(' ')[destaque.author.name.split(' ').length - 1]}</span>
                              |
                              <span style={{ marginLeft: '10px' }}>{destaque?.publication_date.split('-')[2].split('T')[0]}/{destaque?.publication_date.split('-')[1]}/{destaque?.publication_date.split('-')[0]}</span>
                            </h5>
                          </Box>

                          <div className='regular white' style={{textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: destaque?.description.length > 300 ? destaque.description.substring(0, 300) + '...' : destaque.description }} />

                        </Box>
                        <button onClick={() => navigate(`/blog/${destaque._id}`)} className='button-blue' style={{
                          marginTop: '40px'
                        }}>
                          Ler mais <AiOutlineArrowRight size={22} style={{ verticalAlign: 'bottom', marginLeft: '10px' }} />
                        </button>

                      </Grid>

                      {matches && (<>
                        <Grid item xs={12} lg={5} alignSelf={'center'}>

                          <Box sx={{
                            display: 'flex',
                            justifyContent: matches ? 'flex-end' : 'center',
                            alignItems: 'center',
                          }}>

                            <img
                              src={destaque?.thumbnail ? destaque.thumbnail.url : 'https://placehold.co/600x400'}
                              alt='imagem'
                              style={{ objectFit: 'cover' }} width={matches ? '85%' : '95%'} height={matches ? 295 : '95%'} />)
                          </Box>
                        </Grid>
                      </>)}
                    </Grid>

                  </SwiperSlide>
                ))}

              </Swiper>

              <PublicationsPagination setPublicationsData={(p) => setPublications(p)} isDestaque={true} pages={4} invisible={true} />

            </Container>
          </Box>
        </>)}

      {/* Todas Notícias */}

      <Box id='noticias' sx={{
        backgroundColor: colors.main_white,
      }}>
        <Container maxWidth='xl'>
          {publicationsData?.map((publication, index) => (
            <Grid
              onClick={() => navigate(`/blog/${publication._id}`)}
              container
              rowSpacing={matches ? 8 : 2}
              columnSpacing={'48px'}
              key={index}
              sx={{
                padding: matches ? '0 22px' : '0 12px',
                paddingBottom: '64px',
                '&:hover': {
                  cursor: 'pointer',
                }
              }}>
              <Grid item xs={12} md={4}>
                {matches && (
                  <>

                    <img
                      src={publication.thumbnail.url}
                      alt='imagem'
                      style={{ objectFit: 'cover' }} width={matches ? '100%' : '95%'} height={matches ? 295 : '95%'} />

                  </>
                )}

              </Grid>
              <Grid item xs={12} md={8} alignSelf={'center'}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <h5 className='medium' style={{
                    color: '#36ae7c',
                    backgroundColor: '#E6F2ED',
                    width: 'fit-content',
                    padding: '5px 20px',
                    borderRadius: '35px',
                    marginBottom: '24px'
                  }}>
                    {publication?.theme}
                  </h5>

                  <h2 className='black bold'>
                    {publication.title}
                  </h2>

                  <div className='regular black' style={{textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: publication?.description.length > 300 ? publication.description.substring(0, 300) + '...' : publication.description }} />
                  <Box sx={{
                    display: 'flex',
                    marginTop: '36px',
                    gap: '10px'
                  }}>

                    <Avatar alt={publication.author.name} src={publication.author.profilePhoto} sx={{ width: 42, height: 42 }} />

                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      <h4 className='bold black'>
                        {publication.author.name.split(' ')[0]} {publication.author.name.split(' ')[publication.author.name.split(' ').length - 1]}
                      </h4>
                      <h5 className='black medium italic'>
                        {publication?.publication_date.split('-')[2].split('T')[0]}/{publication?.publication_date.split('-')[1]}/{publication?.publication_date.split('-')[0]}
                      </h5>
                    </Box>

                    <h5 className='black medium italic' style={{
                      marginTop: '3px',
                    }}>
                      {publication?.author?.role === 'admin' ? 'Administrador' : publication?.author?.role}
                    </h5>

                  </Box>

                </Box>
              </Grid>
            </Grid>
          ))}

          {publicationsData?.length === 0 && (
            <h3 className='regular black' style={{ textAlign: 'center' }}>
              Nenhuma notícia encontrada.
            </h3>
          )}


        </Container>

        <PublicationsPagination loadPublications={loadPublications} setPublicationsData={(p) => setPublications(p)} pages={5} theme={theme} />

      </Box>

      {/** Categorias */}

      <Box sx={{
        backgroundColor: colors.main_white,
        padding: matches ? '40px 0 80px 0' : '20px 0 50px 0',
      }}>
        <Container maxWidth='xl' >

          <h2 className='semi-bold' style={{
            marginBottom: '50px',
            textAlign: 'center',
            textDecoration: 'underline',
            textUnderlineOffset: '20px',
            textDecorationThickness: '3px',
          }}>
            Categorias
          </h2>

          <Grid container>

            {temas.map((tema, index) => (

              <Grid onClick={() => { handleNavigateTheme(tema); }} item sm={12} md={2.8} sx={{
                display: 'flex',
                border: `2px solid #140C9F`,
                padding: '20px 10px',
                margin: '12px',
                width: '100%',
                '&:hover': {
                  cursor: 'pointer',
                  border: `2px solid ${colors.main_purple}`,
                  backgroundColor: colors.main_purple,

                },
                '&:hover p': {
                  color: colors.main_white,
                }
              }} key={index}>


                <p className='bold-purple' style={{
                  fontSize: '18px',
                }}>

                  {icons[index]}
                  {tema}
                </p>

              </Grid>
            )
            )}
          </Grid>

        </Container>
      </Box>

      <Box sx={{
        backgroundColor: colors.main_purple,
        padding: matches ? '120px 0 120px 0' : '60px 0 60px 0',
      }}>
        <Container maxWidth='xl'>
          <Grid container rowSpacing={4} columnSpacing={20}>
            <Grid item xs={12} md={6}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
              }}>
                <h1 className='white bold'>
                  Você também pode ser um produtor APCCAP.
                </h1>
                <h4 className='white regular' style={{ marginTop: '20px' }}>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorem beatae sequi consequatur assumenda, saepe harum amet quas deserunt at, rem totam aliq
                </h4>
              </Box>
            </Grid>
            <Grid item xs={12} lg={6} alignSelf={'center'}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: matches ? 'flex-end' : 'center',
                gap: '25px',
                flexDirection: matches ? 'row' : 'column',
              }}>
                <button onClick={() => navigate('/quem-somos#associar')} className='button-purple' style={{
                  padding: '24px 48px',
                  width: '100%',
                }}>
                  Como funciona  <BsArrowUpRight size={25} style={{ verticalAlign: 'bottom' }} />
                </button>
                <button onClick={() => navigate('/registrar')} className='button-white' style={{
                  padding: '24px 48px',
                  width: '100%',
                }}>
                  Quero me associar  <BsArrowUpRight size={25} style={{ verticalAlign: 'bottom' }} />
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

export default Blog
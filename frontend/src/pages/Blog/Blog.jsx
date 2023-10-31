import React from 'react'
import { Container, Box, Grid, useMediaQuery } from '@mui/material'
import { colors } from '../colors'
import { useSelector } from 'react-redux';
import PublicationsPagination from '../../components/Pagination/Publications';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { Swiper, SwiperSlide } from 'swiper/react';
import { register } from 'swiper/element/bundle'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// import required modules
import { Autoplay } from 'swiper/modules';

register()

function Blog() {

  const matches = useMediaQuery('(min-width:600px)');
  const [publicationsData, setPublications] = React.useState([])

  const { destaques } = useSelector(state => state.blog)

  return (
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
              <Grid container rowSpacing={8}>
                <Grid item xs={12} md={6}>
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
                        <span style={{ marginLeft: '10px' }}>{destaque?.publication_date.split('-')[2].split('T')[0]}/{destaque?.publication_date.split('-')[1]}/{destaque?.publication_date.split('-')[0]} </span>
                      </h5>
                    </Box>

                    <h4 className='white regular' style={{ textAlign: 'justify' }}>
                      {destaque.description.length > 400 ? destaque.description.substring(0, 400) + '...' : destaque.description}
                    </h4>

                  </Box>

                  <button className='button-blue' style={{
                    marginTop: '40px'
                  }}>
                    Ler mais <AiOutlineArrowRight size={22} style={{ verticalAlign: 'bottom', marginLeft: '10px' }} />
                  </button>

                </Grid>

                {matches && (<>
                  <Grid item xs={12} lg={6} alignSelf={'center'}>

                    <Box sx={{
                      display: 'flex',
                      justifyContent: matches ? 'flex-end' : 'center',
                      alignItems: 'center',
                    }}>
                      <img src={destaque.thumbnail} alt='imagem' style={{
                        objectFit: 'cover'
                      }} width={matches ? '65%' : '95%'} height={matches ? 295 : '95%'} />
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
  )
}

export default Blog
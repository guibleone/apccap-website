import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSinglePublication, reset, resetPublications } from '../../features/blog/blogSlice'
import { Box, Container, Grid, Skeleton, useMediaQuery } from '@mui/material'
import { colors } from '../colors'
import Footer from '../../components/Footer/Footer'
import PublicationsPagination from '../../components/Pagination/Publications'
const { useDispatch, useSelector } = require('react-redux')

export default function SinglePublication() {
  const { id } = useParams()
  const { singlePublication, isLoading } = useSelector(state => state.blog)
  const [publicationsData, setPublicationsData] = React.useState([])


  const dispatch = useDispatch()
  const matches = useMediaQuery('(min-width:600px)')

  useEffect(() => {
    dispatch(getSinglePublication(id))
  }
    , [id])

  useEffect(() => {
    window.scrollTo(0, 0)

  }
    , [id])

  return (
    <Box sx={{
      backgroundColor: colors.main_white,
      minHeight: '100vh',
    }}>
      <Container maxWidth="md">
        <Box sx={{
          backgroundColor: colors.main_white,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          padding: '72px 0',
        }}>

          {isLoading ?
            <Skeleton variant="rectangular" style={{ width: '100%', height: '60px' }} />
            :
            <h1 style={{ alignSelf: 'flex-start' }} className='black'>{singlePublication?.title}</h1>
          }

          {isLoading ?
            <Skeleton variant="rectangular" style={{ width: '150px', height: '10px', alignSelf: 'flex-start' }} />
            :
            <h5 className='regular black' style={{ alignSelf: 'flex-start' }}>
              <Link style={{
                color: colors.main_black
              }} to='/blog' >Blog</Link> &gt;  {singlePublication?.theme}
            </h5>
          }

          {isLoading ?
            <Skeleton variant="rectangular" style={{ width: '100%', height: matches ? '420px' : '230px', objectFit: 'cover' }} />
            :
            <img src={singlePublication?.thumbnail.url} alt={singlePublication?.title} style={{ width: '100%', height: matches ? '420px' : '230px', objectFit: 'cover' }} />
          }

          {isLoading ?
            <Skeleton variant="rectangular" style={{ width: '200px', height: '10px', alignSelf: 'flex-start' }} />
            :
            <h5 className='regular black' style={{ alignSelf: 'flex-start' }}>
              Por <span style={{ marginRight: '10px' }} className='underline'>{singlePublication?.author?.name.split(' ')[0]} {singlePublication?.author?.name?.split(' ')[singlePublication?.author?.name.split(' ').length - 1]}</span>
              |
              <span style={{ marginLeft: '10px' }}>{singlePublication?.publication_date.split('-')[2].split('T')[0]}/{singlePublication?.publication_date.split('-')[1]}/{singlePublication?.publication_date.split('-')[0]} </span>
            </h5>
          }

          {isLoading ?
            <>
              <Skeleton variant="rectangular" style={{ width: '100%', height: '40px', alignSelf: 'flex-start' }} />
              <Skeleton variant="rectangular" style={{ width: '100%', height: '40px', alignSelf: 'flex-start' }} />
            </>
            :
            <div className='regular black' style={{ alignSelf: 'flex-start' }} dangerouslySetInnerHTML={{ __html: singlePublication?.description }} />
          }
        </Box>

      </Container>
      <Container maxWidth="lg">

        <h2 className='semi-bold' style={{
          marginBottom: '50px',
          textAlign: 'center',
          textDecoration: 'underline',
          textUnderlineOffset: '20px',
          textDecorationThickness: '3px',
        }}>
          Você também pode gostar
        </h2>

        {publicationsData?.length < 2 && <h3 className='regular' style={{ textAlign: 'center' }}>Não há publicações relacionadas</h3>}

        <Grid container spacing={2}>
          {publicationsData?.filter(publication => publication._id !== singlePublication?._id).map((publication, i) => (<>
            <Grid item xs={12} sm={6} md={4}>
              <Link to={`/blog/${publication?._id}`} style={{
                textDecoration: 'none',
              }}>
                <Box sx={{
                  position: 'relative',
                  backgroundColor: colors.main_white,
                }}>
                  <img src={publication?.thumbnail.url} alt={publication?.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <h5 className='bold' style={{
                    position: 'absolute',
                    bottom: '8px',
                    backgroundColor: colors.main_blue,
                    color: colors.main_white,
                    padding: '8px',
                    minWidth: '100%',

                  }}>{publication?.title}</h5>
                </Box>

              </Link>
            </Grid>
          </>))}

        </Grid>

        {singlePublication?.theme && <PublicationsPagination setPublicationsData={(p) => setPublicationsData(p)} theme={singlePublication?.theme} invisible={true} pages={3} />}

      </Container>

      <Footer />

    </Box>
  )
}

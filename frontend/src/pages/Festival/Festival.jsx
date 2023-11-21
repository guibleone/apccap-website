import { Container, Box, Typography, Grid, useMediaQuery } from '@mui/material'
import React, { useEffect } from 'react'
import { colors } from '../../pages/colors'
import Footer from '../../components/Footer/Footer'

export default function Festival() {
  const matches = useMediaQuery('(min-width:600px)');


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Box sx={{
        backgroundColor: '#EE771E'
      }}>
        <Container maxWidth='xl' >
          <Box sx={{
            padding: '72px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px'
          }} >
            <h2 className='bold' style={{ textAlign: 'center', color: '#20244B', backgroundColor: colors.main_white, padding: '9px 16px' }}>
              8, 19 e 20 de Outubro
            </h2>

            <Box>
              <h1 className='bold white'>
                Festival da Cachaça do Estado de São Paulo
              </h1>
              <h3 className='regular white'>
                Venha aprender, degustar e celebrar o espírito que é essencialmente brasileiro.
              </h3>
            </Box>

            <Box sx={{
              alignSelf: 'flex-start',
            }}>
              <h3 className='medium white'>
                Patrocinadores
              </h3>


            </Box>
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item >
                <img src={require('../../imgs/logo-branco.png')} alt='logo' style={{ width: '140px', height: '140px' }} />
              </Grid>
              <Grid item >
                <img src={require('../../imgs/logo-branco.png')} alt='logo' style={{ width: '140px', height: '140px' }} />
              </Grid>

              <Grid item >
                <img src={require('../../imgs/logo-branco.png')} alt='logo' style={{ width: '140px', height: '140px' }} />
              </Grid>
              <Grid item >
                <img src={require('../../imgs/logo-branco.png')} alt='logo' style={{ width: '140px', height: '140px' }} />
              </Grid>
              <Grid item >
                <img src={require('../../imgs/logo-branco.png')} alt='logo' style={{ width: '140px', height: '140px' }} />
              </Grid>
              <Grid item >
                <img src={require('../../imgs/logo-branco.png')} alt='logo' style={{ width: '140px', height: '140px' }} />
              </Grid>


            </Grid>
          </Box>
        </Container>
      </Box>

      <Box sx={{
        backgroundColor: colors.main_white,
        padding: '100px 0'
      }}>
        <Container maxWidth='xl' >

          <Grid container spacing={2} columnSpacing={'50px'} >
            <Grid item xs={12} sm={6} >
              <h1 className='bold' >
                A história por trás do principal Festival da Cachaça do estado de São Paulo: cultura, tradição e qualidade
              </h1>
              <h3 className='regular' style={{ marginTop: '40px' }} >
                Nossa história começou em uma roda de amigos degustando cachaça no Bar Seo Bastião, no centro de Amparo. Depois de algumas cachaças, surgiu a ideia de reunir alguns produtores, amigos e familiares com o propósito de fazer um evento para divulgar e valorizar a tradição da cachaça de alambique, gerar emprego e renda para a região.
                <br />
                <br />
              </h3>
              <h3 className='regular' >
                Assim, dia 8 de agosto de 2017, nasceu o Festival da Cachaça do Circuito das Águas Paulista. Hoje o festival é o principal evento de cachaça do estado de São Paulo e atrai milhares de visitantes e apreciadores de cachaça de excelente qualidade. Além disso, emprega diretamente muitas pessoas durante e depois do festival, incluindo organizadores, fornecedores, guias turísticos e também beneficia hotéis, restaurantes, bares e o comércio local.
                <br />
                <br />
              </h3>
              <h3 className='regular'>
                O festival da cachaça preserva a cultura, tradição, qualidade e busca valorizar também os métodos de produção, embora tantos rótulos, nenhuma cachaça é igual a outra, a bebida sempre traz o modo de fazer de cada produtor, além de outros fatores  naturais como solo, clima, água e relevo que definem o terroir característico da região do Circuito das Águas Paulista.
                <br />
                <br />
              </h3>
              <h3 className='regular'>
                Se você é iniciante ou colecionador da bebida, o Festival da Cachaça do Circuito das Águas Paulista é um evento imperdível. Você encontrará inúmeras oportunidades para aprender, degustar e celebrar o espírito que é essencialmente brasileiro.
              </h3>
            </Grid>
            <Grid item xs={12} sm={6} sx={{
              display: 'flex',
              justifyContent: 'center',

            }} >
              <img src={require('../../imgs/festival_colorido.png')} alt='festival' style={{ width: '220px', height: '200px', marginTop: matches ? '0' : '40px' }} />
            </Grid>
          </Grid>

          {/** IMAGENS */}

          <Grid container spacing={'40px'} mt={12}>
            <Grid item sm={12} lg={8}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',

              }}>

                <img src='https://placehold.co/600x400/png' alt='Festival da cachaça' width={'100%'} height={matches ? '400px' : '100%'} style={{ objectFit: 'cover' }} />

                <Box sx={{
                  display: 'flex',
                  gap: '40px',
                  flexDirection: matches ? 'row' : 'column'

                }}>
                  <img src='https://placehold.co/600x400/png' alt='Festival da cachaça' width={matches ? '48%' : '100%'} height={'40%'} style={{ objectFit: 'cover' }} />

                  <img src='https://placehold.co/600x400/png' alt='Festival da cachaça' width={matches ? '48%' : '100%'} height={'40%'} style={{ objectFit: 'cover' }} />
                </Box>

              </Box>

            </Grid>
            <Grid item sm={12} lg={4}>
              <img src='https://placehold.co/600x400/png' alt='Festival da cachaça' width={'100%'} height={'100%'} style={{ objectFit: 'cover' }} />
            </Grid>

          </Grid>

        </Container >
      </Box>



      <Footer />


    </>
  )
}

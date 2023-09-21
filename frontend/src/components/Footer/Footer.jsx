import { AiFillFacebook as Facebook, AiFillInstagram as Instagram, AiFillTwitterCircle as Twitter } from 'react-icons/ai'
import { Box, Paper, Container, Typography, Avatar, Grid, Link, useMediaQuery } from '@mui/material'

function Footer() {

  const matches = useMediaQuery('(max-width:600px)');

  return (

    <Box
      component="footer"
      sx={{
        backgroundColor: ' #0F0A70',
        color: '#FAF8F8',
        p: 6,
      }}
    >
      <Grid container spacing={5}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
            <img src={require('../../imgs/logo-title.png')} alt="logo" width="150px" />
            <Box>
              <Link href="https://www.facebook.com/" color="inherit">
                <Facebook />
              </Link>
              <Link
                href="https://www.instagram.com/"
                color="inherit"
                sx={{ pl: 1, pr: 1 }}
              >
                <Instagram />
              </Link>
              <Link href="https://www.twitter.com/" color="inherit">
                <Twitter />
              </Link>
            </Box>
          </Box>
        </Grid>


        <Grid item xs={12} sm={8} sx={{ display: 'flex', flexDirection: matches ? 'column' : 'row', gap: '20px' }}  >
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" gutterBottom>
              Páginas
            </Typography>

            <div>
              <Link href="/rastreabilidade" variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
                Rastreabilidade
              </Link>
            </div>

            <div>
              <Link href="/festival-cachaca" variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
                Festival da Cachaça
              </Link>
            </div>

            <div>
              <Link href="/blog" variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
                Blog
              </Link>
            </div>


          </Grid>
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" gutterBottom>
              Sobre Nós
            </Typography>
            <div>
              <Link href="/rastreabilidade" variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
                Indicação Geográfica
              </Link>
            </div>

            <div>
              <Link href="/festival-cachaca" variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
                Nossos Produtores
              </Link>
            </div>

            <div>
              <Link href="/blog" variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
                Encontre nossos produtos
              </Link>
            </div>

          </Grid>
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" gutterBottom>
              Associa-se
            </Typography>
            <div>
              <Link href="/festival-cachaca" variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
                FAQ
              </Link>
            </div>

            <div>
              <Link href="/blog" variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
                Cadastre-se
              </Link>
            </div>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" gutterBottom>
              Entre em contato
            </Typography>

        
        <Box sx={{ display: 'flex',flexDirection: 'column', gap: '5px' }}>
              <Typography variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
                (31) 99999-9999
              </Typography>
       

         
              <Typography variant="body2" color="inherit"  >
                apccap@gmail.com
              </Typography>
          

      
              <Typography variant="body2" color="inherit"  >
                Rod. Amparo-Serra Negra, Km 138 - s/n - Almeidas, Amparo - SP, 13902-800
              </Typography>
          </Box>


          </Grid>
        </Grid>
      </Grid>


      <Box mt={5}>
        <Typography variant="body2" align="center">
          {"Copyright ©  Apccap  "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>


    </Box>

  )
}

export default Footer
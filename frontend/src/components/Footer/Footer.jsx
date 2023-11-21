import { AiFillFacebook as Facebook, AiFillInstagram as Instagram} from 'react-icons/ai'
import { Box, Grid, useMediaQuery } from '@mui/material'
import { Link } from 'react-router-dom'
import { RiTwitterXFill } from 'react-icons/ri'
import { colors } from '../../pages/colors';

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
              <Link to="https://www.facebook.com/" style={{ color: colors.main_white }}>
                <Facebook />
              </Link>
              <Link
                to="https://www.instagram.com/"
                style={{ color: colors.main_white }}
                sx={{ pl: 1, pr: 1 }}
              >
                <Instagram />
              </Link>
              <Link to="https://www.twitter.com/" style={{ color: colors.main_white }}>
                <RiTwitterXFill />
              </Link>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={8} sx={{ display: 'flex', flexDirection: matches ? 'column' : 'row', gap: '20px' }}  >
          <Grid item xs={12} sm={2}>

            <h3 className='white medium' style={{ paddingBottom: '10px' }}>
              Páginas
            </h3>

            <div>
              <Link to="/rastreabilidade" variant="body2" color="inherit" style={{ textDecoration: 'none' }}>
                <h5 className='white regular'>Rastreabilidade</h5>
              </Link>
            </div>

            <div>
              <Link to="/festival-cachaca" variant="body2" color="inherit" style={{ textDecoration: 'none' }}>
                <h5 className='white regular'> Festival da Cachaça</h5>
              </Link>
            </div>

            <div>
              <Link to="/blog" variant="body2" color="inherit" style={{ textDecoration: 'none' }}>
                <h5 className='white regular'> Blog </h5>
              </Link>
            </div>


          </Grid>
          <Grid item xs={12} sm={2}>

            <h3 className='white medium' style={{ paddingBottom: '10px' }}>
              Sobre Nós
            </h3>

            <div>
              <Link to="/quem-somos#ig" variant="body2" color="inherit" style={{ textDecoration: 'none' }}>
                <h5 className='white regular'> Indicação Geográfica </h5>
              </Link>
            </div>

            <div>
              <Link to="/quem-somos#produtores" variant="body2" color="inherit" style={{ textDecoration: 'none' }}>
                <h5 className='white regular'>  Nossos Produtores </h5>
              </Link>
            </div>

            <div>
              <Link to="/quem-somos#associacao" variant="body2" color="inherit" style={{ textDecoration: 'none' }}>
                <h5 className='white regular'> Associção </h5>
              </Link>
            </div>

          </Grid>
          <Grid item xs={12} sm={2}>
            <h3 className='white medium' style={{ paddingBottom: '10px' }}>
              Associa-se
            </h3>
            <div>
              <Link to="/quem-somos#faq" variant="body2" color="inherit" style={{ textDecoration: 'none' }}>
                <h5 className='white regular'> FAQ </h5>
              </Link>
            </div>

            <div>
              <Link to="/registrar" variant="body2" color="inherit" style={{ textDecoration: 'none' }}>
                <h5 className='white regular'> Cadastre-se </h5>
              </Link>
            </div>
          </Grid>
          <Grid item xs={12} sm={2}>
            <h3 className='white medium' style={{ paddingBottom: '10px' }}>
              Entre em contato
            </h3>


            <Box style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <h5 className='white regular'>
                <a target="_blank" rel='noreferrer' href={`https://api.whatsapp.com/send?phone=5519999999999`} style={{ color: colors.main_white, textDecoration: 'none' }}>
                  (19) 99999-9999
                </a>
              </h5>

              <h5 className='white regular'>
                <a target="_blank" rel='noreferrer' href={'mailto:appcap@gmail.com'} style={{ color: colors.main_white, textDecoration: 'none' }}>
                  appcap@gmail.com
                </a>
              </h5>

              <h5 className='white regular'>
                <a target="_blank" rel='noreferrer' href='https://www.google.com/maps/dir//Rod.Amparo-Serra%20Negra,Km%20138-%20Almeidas,%20Amparo%20-%20SP,%2013902-800' style={{ color: colors.main_white, textDecoration: 'none' }}>
                  Rod. Amparo-Serra Negra, Km 138 - s/n - Almeidas, Amparo - SP, 13902-800
                </a>
              </h5>

            </Box>
          </Grid>
        </Grid>
      </Grid>


      <Box mt={5}>
        <h5 className='white regular' style={{ textAlign: 'center' }}>
          {"Todos os direitos reservados ©  Apccap  "}
          {new Date().getFullYear()}
        </h5>
      </Box>


    </Box>

  )
}

export default Footer
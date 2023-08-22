import {AiFillFacebook as Facebook, AiFillInstagram as Instagram, AiFillTwitterCircle as Twitter} from 'react-icons/ai'
import { Box, Paper, Container, Typography, Avatar, Grid, Link } from '@mui/material'

function Footer() {
  return (

    <Box
    component="footer"
    sx={{
      backgroundColor: (theme) =>
        theme.palette.mode === "light"
          ? theme.palette.grey[200]
          : theme.palette.grey[800],
      p: 6,
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={5}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Sobre nós
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Entre em contato
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rua Lorem Ipsum, 123 - Lorem Ipsum
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: apccap@gmail.com
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Telefone: (11) 1234-5678
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Siga-nos
          </Typography>
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
        </Grid>
      </Grid>
      <Box mt={5}>
        <Typography variant="body2" color="text.secondary" align="center">
          {"Copyright ©  Apccap  "} 
          { new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
    </Container>
  </Box>

  )
}

export default Footer
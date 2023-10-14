import { Box, Container, Divider, Grid, useMediaQuery } from '@mui/material'
import { colors } from '../../pages/colors'
import { BsChevronDown } from 'react-icons/bs'
import { AiOutlineDownload, AiOutlineFile } from 'react-icons/ai'
import { useEffect, useState } from 'react'
import BalancosPagination from '../../components/Pagination/Balancos'
import AtasPagination from '../../components/Pagination/Atas'

export default function DocumentosPublicos() {

  const matches = useMediaQuery('(min-width:600px)')

  const [spreadSheets, setSpreadSheets] = useState([])
  const [atas, setAtas] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }
    , [])

  return (
    <Box sx={{
      backgroundColor: colors.main_white,
      minHeight: '100vh'
    }}>
      <Container maxWidth='xl'>
        <Grid container spacing={2} >
          <Grid item xs={12} lg={12} >
            <Box sx={{ textAlign: 'center', padding: '72px 0', }}>
              <h1 className='bold black'>
                Documentos
              </h1>
              <h5 className='regular black'>
                Fique por dentro de todos os documentos da associação
              </h5>
            </Box>

          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderBottomWidth: 3 }} />

      <Container maxWidth='xl' sx={{
        padding: '20px 20px 0px 20px'
      }}>
        <Grid container spacing={2} >
          <Grid item xs={12} lg={12} >
            <Box sx={{ padding: '36px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 className='bold'>
                Balanços Financeiros
              </h2>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: matches ? 'row' : 'column',
                alignItems: 'center',
              }}>
                <h4 className='regular' style={{
                  maxWidth: '500px',

                }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates corporis nulla,ntur
                </h4>

                <button className='button-white-bottom-border '>
                  Buscar <BsChevronDown size={18} style={{ verticalAlign: 'bottom', marginLeft: '10px' }} />
                </button>

              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container columnSpacing={'30px'} rowSpacing={'15px'}>

          {spreadSheets && spreadSheets.map((spreadSheet) => (
            <Grid item xs={12} md={2} key={spreadSheet._id} >

              <button className='button-documentos' onClick={() => window.open(spreadSheet?.pathExcel, '_blank')}  >
                <Box className={'button-text'} >
                  <AiOutlineFile size={18} style={{ verticalAlign: 'center', marginRight: '12px' }} />
                  <h4 className='black regular'>
                    {spreadSheet.title_spread.length > 10 ? spreadSheet.title_spread.slice(0, 10) + '...' : spreadSheet.title_spread}
                  </h4>

                </Box>
                <Box className='documento-actions' >
                  <AiOutlineDownload style={{ color: '#057305' }} size={22} />
                </Box>
              </button>

            </Grid>

          ))}

        </Grid>

        <BalancosPagination setSpreadSheetsData={(data) => setSpreadSheets(data)} />

      </Container>

      <Container maxWidth='xl' >
        <Grid container spacing={2} >
          <Grid item xs={12} lg={12} >
            <Box sx={{ padding: '36px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 className='bold'>
                ATA de Reuniões
              </h2>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: matches ? 'row' : 'column',
                alignItems: 'center',
              }}>
                <h4 className='regular' style={{
                  maxWidth: '500px',

                }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates corporis nulla,ntur
                </h4>

                <button className='button-white-bottom-border '>
                  Buscar <BsChevronDown size={18} style={{ verticalAlign: 'bottom', marginLeft: '10px' }} />
                </button>

              </Box>
            </Box>
          </Grid>


        </Grid>
        <Grid container columnSpacing={'30px'} rowSpacing={'15px'}>
            {atas && atas?.map((ata) => (
              <Grid item xs={12} md={2} key={ata._id} >

                <button className='button-documentos'  onClick={() => window.open(ata?.ata?.path, '_blank')}  >
                  <Box className={'button-text'} >
                    <AiOutlineFile size={18} style={{ verticalAlign: 'center', marginRight: '12px' }} />
                    <h4 className='black regular'>
                      sd
                      {ata?.ata?.originalname?.length > 10 ? ata?.ata?.originalname?.slice(0, 10) + '...' : ata?.ata?.originalname}
                    </h4>

                  </Box>
                  <Box className='documento-actions'>
                    <AiOutlineDownload  style={{ color: '#057305' }} size={22} />
                  </Box>
                </button>

              </Grid>

            ))}

          </Grid>

          <AtasPagination setAtasData={(ata) => setAtas(ata)} />



      </Container>

   
      <Container maxWidth='xl' sx={{
        padding: '0 20px 80px 20px'
      }}>
        <Grid container spacing={2} >
          <Grid item xs={12} lg={12} >
            <Box sx={{ padding: '36px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 className='bold'>
                Relatórios
              </h2>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: matches ? 'row' : 'column',
                alignItems: 'center',
              }}>
                <h4 className='regular' style={{
                  maxWidth: '500px',

                }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates corporis nulla,ntur
                </h4>

                <button className='button-white-bottom-border '>
                  Buscar <BsChevronDown size={18} style={{ verticalAlign: 'bottom', marginLeft: '10px' }} />
                </button>

              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container columnSpacing={'30px'} rowSpacing={'15px'}>


        </Grid>



      </Container>

    </Box>
  )
}

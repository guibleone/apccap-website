import { Box, Container, Divider, Grid, InputAdornment, TextField, useMediaQuery } from '@mui/material'
import { colors } from '../../pages/colors'
import { BsChevronDown } from 'react-icons/bs'
import { AiOutlineDownload, AiOutlineFile } from 'react-icons/ai'
import { useEffect, useState } from 'react'
import BalancosPagination from '../../components/Pagination/Balancos'
import AtasPagination from '../../components/Pagination/Atas'
import RelatorysPagination from '../../components/Pagination/Relatorys'
import Footer from '../../components/Footer/Footer'

export default function DocumentosPublicos() {

  const matches = useMediaQuery('(min-width:600px)')

  const [spreadSheets, setSpreadSheets] = useState([])
  const [atas, setAtas] = useState([])
  const [relatorys, setRelatorys] = useState([])

  const [searchRelatory, setSearchRelatory] = useState('')
  const [searchAta, setSearchAta] = useState('')
  const [searchSpreadSheet, setSearchSpreadSheet] = useState('')

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
                gap: '16px',
              }}>
                <h4 className='regular' style={{
                  maxWidth: '500px',

                }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates corporis nulla,ntur
                </h4>

                <TextField 
                  fullWidth={!matches}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsChevronDown />
                      </InputAdornment>
                    ),
                  }}  name='search-relatorys' placeholder='Buscar' onChange={(e) => setSearchSpreadSheet(e.target.value)} />

              </Box>
              {(spreadSheets && spreadSheets.length === 0) && (
                <h3 className='regular black'>
                  Nenhum balanço adicionado.
                </h3>
              )}
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

        <BalancosPagination setSpreadSheetsData={(data) => setSpreadSheets(data)} search={searchSpreadSheet} />

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
                gap: '16px',
              }}>
                <h4 className='regular' style={{
                  maxWidth: '500px',

                }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates corporis nulla,ntur
                </h4>

                <TextField 
                  fullWidth={!matches}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsChevronDown />
                      </InputAdornment>
                    ),
                  }}  name='search-relatorys' placeholder='Buscar' onChange={(e) => setSearchAta(e.target.value)} />

              </Box>

              {(atas && atas.length === 0) && (
                <h3 className='regular black'>
                  Nenhuma ata adicionada.
                </h3>
              )}
            </Box>
          </Grid>


        </Grid>
        <Grid container columnSpacing={'30px'} rowSpacing={'15px'}>
          {atas && atas?.map((ata) => (
            <Grid item xs={12} md={2} key={ata._id} >

              <button className='button-documentos' onClick={() => window.open(ata?.ata?.path, '_blank')}  >
                <Box className={'button-text'} >
                  <AiOutlineFile size={18} style={{ verticalAlign: 'center', marginRight: '12px' }} />
                  <h4 className='black regular'>
                    {ata?.ata?.originalname?.length > 10 ? ata?.ata?.originalname?.slice(0, 10) + '...' : ata?.ata?.originalname}
                  </h4>

                </Box>
                <Box className='documento-actions'>
                  <AiOutlineDownload style={{ color: '#057305' }} size={22} />
                </Box>
              </button>

            </Grid>

          ))}

        </Grid>

        <AtasPagination setAtasData={(ata) => setAtas(ata)} search={searchAta} />

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
                gap: '16px',
                flexDirection: matches ? 'row' : 'column',
                alignItems: 'center',
              }}>
                <h4 className='regular' style={{
                  maxWidth: '500px',

                }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates corporis nulla,ntur
                </h4>
               
                  <TextField 
                  fullWidth={!matches}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsChevronDown />
                      </InputAdornment>
                    ),
                  }}  name='search-relatorys' placeholder='Buscar' onChange={(e) => setSearchRelatory(e.target.value)} />
                  
              </Box>

              {(relatorys && relatorys.length === 0) && (
                <h3 className='regular black'>
                  Nenhum relatório adicionado.
                </h3>
              )}

            </Box>
          </Grid>
        </Grid>

        <Grid container columnSpacing={'30px'} rowSpacing={'15px'}>
          {relatorys && relatorys.map((relatory) => (
            <Grid item xs={12} md={2} key={relatory._id} >

              <button className='button-documentos' onClick={() => window.open(relatory?.path, '_blank')} >
                <Box className={'button-text'} >
                  <AiOutlineFile size={18} style={{ verticalAlign: 'center', marginRight: '12px' }} />
                  <h4 className='black regular'>
                    {relatory.title.length > 10 ? relatory.title.slice(0, 10) + '...' : relatory.title}
                  </h4>

                </Box>
                <Box className='documento-actions' >
                  <AiOutlineDownload style={{ color: '#057305' }} size={22} />
                </Box>
              </button>

            </Grid>

          ))}

        </Grid>

        <RelatorysPagination setRelatorysData={(data) => setRelatorys(data)} search={searchRelatory} />

      </Container>
      <Footer />
    </Box>
    
  )
}

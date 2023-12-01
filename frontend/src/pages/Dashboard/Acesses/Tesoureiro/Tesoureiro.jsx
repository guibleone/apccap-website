import { Container, Box, Grid, CircularProgress, useMediaQuery, } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSpreadSheets, addExcel, resetExcel, deleteExcel } from '../../../../features/spreadSheet/spreadSheetSlice'
import { Link, useNavigate } from 'react-router-dom'
import { colors } from '../../../colors'
import { BsArrowUpRight, BsDownload, BsPlusCircle } from 'react-icons/bs'
import { AiOutlineDelete, AiOutlineDownload, AiOutlineEdit, AiOutlineFile } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { styleSuccess } from '../../../toastStyles'

export default function Tesoureiro() {
  const matches = useMediaQuery('(max-width:600px)');

  const { user } = useSelector((state) => state.auth)
  const { spreadSheets, excel } = useSelector((state) => state.spreadSheet)
  const dispatch = useDispatch()

  // ref do input file
  const fileInputRef = useRef(null);

  // função para abrir o input file
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const [selectedFile, setSelectedFile] = useState(null); // armazena o arquivo selecionado

  // função para pegar o arquivo selecionado
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  // função para enviar a planilha
  const handleSubmit = (e) => {
    e.preventDefault()
    const excelData = {
      pathExcel: fileInputRef.current?.files[0],
      user: user._id,
      token: user.token
    }

    dispatch(addExcel(excelData))
  }

  useEffect(() => {

    if (excel.isSuccess) {
      toast.success(excel.message, styleSuccess)
    }
    if (excel.isError) {
      toast.error(excel.message, styleSuccess)
    }

    dispatch(resetExcel())

  }
    , [excel])

  useEffect(() => {

    dispatch(getSpreadSheets({ token: user.token }))

  }, [excel.isSuccess])


  return (
    <Box sx={{
      backgroundColor: colors.main_white,
      minHeight: '100vh',
    }}>

      <Container maxWidth='xl' >
        <Grid container spacing={2} pb={5}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '72px 0',
              gap: '36px'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <h3 className='semi-bold black'>
                  Credencial
                </h3>
                <h1 className='black semi-bold'>
                  Tesoureiro
                </h1>
                <h5 className='black regular' style={{
                  textAlign: 'justify'
                }}>
                  Como tesoureiro, tenha o poder de gerenciar as finanças e adicionar balanços financeiros de forma direta. Sua contribuição é fundamental para manter a estabilidade econômica da APCCAP e garantir uma gestão transparente e responsável dos recursos.
                </h5>
              </Box>
              <button onClick={() => window.location.href = 'https://dashboard.stripe.com/test/payments'} className='button-purple' style={{ width: '222px' }}>
                Ver Faturamento <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom' }} />
              </button>
            </Box>
          </Grid>

        </Grid>



        <Grid container rowSpacing={2} pb={'36px'}>
          <Grid item xs={12} md={12}>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '36px'
            }}>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: matches ? 'column' : 'row',
                alignItems: 'center',

              }}>
                <h3 className='black semi-bold'>
                  Balanços financeiros recentes
                </h3>
                <Box sx={{
                  display: 'flex',
                  flexDirection: matches ? 'column' : 'row',
                  gap: '10px'
                }}>
                  <input
                    style={{ display: 'none' }}
                    accept='.pdf, .csv'
                    type='file'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <button onClick={handleButtonClick} className='button-white-bottom-border' style={{ width: '220px' }}>
                    {selectedFile ? <>{selectedFile.name.slice(0, 10)} ... <AiOutlineEdit size={25} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /> </> : <>Novo Balanço <BsPlusCircle size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} /></>}
                  </button>
                  <button onClick={handleSubmit} className='button-purple' style={{ marginLeft: '10px', backgroundColor: excel.isLoading && colors.main_white }}>
                    {excel.isLoading ? <CircularProgress color="success" style={{ padding: '5px' }} /> : <> <BsDownload size={20} style={{ verticalAlign: 'bottom', marginRight: '5px' }} /> Adicionar</>}
                  </button>
                </Box>

              </Box>
            </Box>
          </Grid>

          <Grid item >
            {(spreadSheets && spreadSheets.length === 0) && (
              <h3 className='regular black'>
                Nenhum balanço financeiro adicionado.
              </h3>
            )}
          </Grid>
          <Grid container pt={'36px'} columnSpacing={'30px'} rowSpacing={'15px'}>

            {spreadSheets && spreadSheets?.slice(0, 6)?.map((spreadSheet) => (
              <Grid item xs={12} md={2} key={spreadSheet._id} >

                <button className='button-documentos' >
                  <Box className={'button-text'} >
                    <AiOutlineFile size={18} style={{ verticalAlign: 'center', marginRight: '12px' }} />
                    <h4 className='black regular'>
                      {spreadSheet.title_spread.length > 10 ? spreadSheet.title_spread.slice(0, 10) + '...' : spreadSheet.title_spread}
                    </h4>

                  </Box>
                  <Box className='documento-actions' >
                    <AiOutlineDownload onClick={() => window.location.href = `${spreadSheet.pathExcel}`} style={{ color: '#057305' }} size={22} />
                    <AiOutlineDelete onClick={() => {
                      const data = {
                        id: spreadSheet._id,
                        token: user.token
                      }
                      dispatch(deleteExcel(data))
                    }} style={{ color: '#BF232C' }} size={22} />
                  </Box>
                </button>

              </Grid>

            ))}

          </Grid>

          <Grid item xs={12} md={12}>
            {(spreadSheets && spreadSheets?.length >= 6) && (
              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <Link style={{ color: '#000', margin: '15px 0' }} to='/balancos'> Ver Tudo</Link>
              </Box>
            )}
          </Grid>


        </Grid>

        {/*} <Divider sx={{ margin: '20px 0' }} />

        <AddSpread />

        <Divider sx={{ margin: '20px 0' }} />

        <ConcludedSpread />

        <Divider sx={{ margin: '20px 0' }} />



        <Divider sx={{ margin: '20px 0' }} />

          <Button sx={{ margin: '20px 0' }} fullWidth onClick={() => navigate('/balancete')} variant='outlined' color='success'>Faturamento</Button>

        <Reunion />
        */}

      </Container>

    </Box>
  )
}

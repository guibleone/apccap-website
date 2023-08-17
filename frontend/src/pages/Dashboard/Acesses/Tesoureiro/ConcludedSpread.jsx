import { Typography, Box, CircularProgress, Button } from '@mui/material'
import CsvDownloadButton from 'react-json-to-csv'
import { AiOutlineDownload, AiOutlineEdit } from 'react-icons/ai'
import { useSelector } from 'react-redux'

export default function ConcludedSpread() {

  const { spreadSheets, isLoading, excel } = useSelector((state) => state.spreadSheet)

  if ((isLoading && !excel)) {
    return <Box sx={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }>
      <CircularProgress sx={
        {
          marginBottom: '100px',
        }
      } size={100} />
    </Box>
  }


  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Typography variant='h4' >Planilhas Concluídas</Typography>
      {spreadSheets && (
        <>
          {spreadSheets.map((spreadSheet) => (
            <Box sx={{ display: 'flex', flexDirection: 'column' }} key={spreadSheet._id}>
              {!spreadSheet.pathExcel && (<>
                <Typography variant='h6'>{spreadSheet.title_spread}</Typography>
                <Box sx={{ display: 'flex', gap: '5px' }}>
                  <CsvDownloadButton
                    style={{ all: 'unset' }}
                    data={spreadSheet.itens}
                    filename={spreadSheet.title_spread}
                    headers={["Título", "Descrição", "Valor"]}
                  ><Button variant='outlined' color='success'><AiOutlineDownload size={25} /></Button></CsvDownloadButton>
                  <Button href={`/planilha/${spreadSheet._id}`} variant='outlined' color='info'><AiOutlineEdit size={25} /></Button>
                </Box>
              </>)}
            </Box>
          ))}
        </>
      )}
    </Box>
  )
}

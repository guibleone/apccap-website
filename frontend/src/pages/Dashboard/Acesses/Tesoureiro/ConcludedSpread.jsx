import { Typography, Box, CircularProgress, Button } from '@mui/material'
import CsvDownloadButton from 'react-json-to-csv'
import { AiOutlineDownload, AiOutlineEdit } from 'react-icons/ai'
import{BiTrashAlt} from 'react-icons/bi'
import { useSelector, useDispatch } from 'react-redux'
import { deleteSpreadSheet } from '../../../../features/spreadSheet/spreadSheetSlice'


export default function ConcludedSpread() {

  const { spreadSheets, isLoading, excel } = useSelector((state) => state.spreadSheet)
  const { user } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const handleDelete = (id) => {
      const data = {
          token: user.token,
          id
      }

      dispatch(deleteSpreadSheet(data))
  }

  if (isLoading && !spreadSheets)  {
    return <Box sx={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px'
      }
    }>
      <CircularProgress size={100} />
    </Box>
  }

  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {(spreadSheets && spreadSheets.length === 0) ? (
        <Typography variant='h7'>Você ainda não tem planilhas concluídas.</Typography>
      ):
        (
          <Typography variant='h7'>Confira as planilhas concluídas.</Typography>
        )
      }
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
                  ><Button variant='outlined' color='success'><AiOutlineDownload size={20} /></Button></CsvDownloadButton>
                  <Button href={`/planilha/${spreadSheet._id}`} variant='outlined' color='info'><AiOutlineEdit size={20} /></Button>
                  <Button onClick={()=> handleDelete(spreadSheet._id)} variant='outlined' color='error'><BiTrashAlt size={20} /></Button>
                </Box>
              </>)}
            </Box>
          ))}
        </>
      )}
    </Box>
  )
}

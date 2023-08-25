import { Box, Container, Typography, Button, TextareaAutosize, Divider, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import UsersPagination from '../../../../components/Pagination/Users'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux';
import { sendConvocationEmail, resetEmailStatus } from '../../../../features/admin/adminSlice';

registerLocale('pt-BR', ptBR)
setDefaultLocale('ptBR')

export default function President() {

  const styleError = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }

  const styleSuccess = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }

  const [users, setUsers] = useState([])
  const [startDate, setStartDate] = useState(new Date());

  const { emailStatus } = useSelector((state) => state.admin)
  const dispatch = useDispatch()

  const [message, setMessage] = useState('')

  const handleSendEmail = () => {
    if (!message) return toast.error('Preencha a menssagem', styleError)

    dispatch(sendConvocationEmail({ message, date: startDate.toLocaleString() }))
  }

  useEffect(() => {

    if (emailStatus.isSuccess) {
      toast.success(emailStatus.message, styleSuccess)
    }

    if (emailStatus.isError) {
      toast.error(emailStatus.message, styleError)
    }

    dispatch(resetEmailStatus())

  }, [emailStatus.isSuccess, emailStatus.isError])

  return (
    <Container>

      <Box>
        <Typography variant='h4'>Bem vindo de volta, Presidente</Typography>
        <Typography variant='h7'>Estes são os usuários com relatórios concluídos. Aprove e faça a devolutiva.</Typography>
      </Box>

      {users && users.map((user) => (

        <Box key={user._id}
          sx={{
            marginTop: '10px',
          }}
        >
          {(user.relatory && user.status === 'analise') && (
            <>
              <Typography variant="h6" >{`${user.name}`}</Typography>
              <Button variant="outlined" href={`/usuario/${user._id}`}>Ver Dados</Button>
            </>
          )}

        </Box>

      ))}

      <UsersPagination setUsersData={(u) => setUsers(u)} />

      <Divider sx={{ margin: '20px 0' }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        <Typography variant='h4'>Convoque para reuniões</Typography>

        <Box>

          <TextareaAutosize
            minRows={6}
            placeholder='Mensagem para convocação'
            style={{ width: "100%", resize: 'none', fontSize: '16px', padding: '10px', margin: '10px 0' }}
            maxRows={8}
            name='message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            dateFormat="Pp"
            locale={ptBR}
            customInput={<Button variant='contained'>Data e Hora</Button>}
          />

          <Typography>Reunião: {startDate.toLocaleString()}</Typography>

        </Box>

        <Typography color={'red'} variant='h7'>Será enviado um email para todos membros da associação.</Typography>

        <Button
          disabled={emailStatus.isLoading}
          onClick={handleSendEmail}
          fullWidth
          variant='contained'
          color='success'> {emailStatus.isLoading ? <CircularProgress color="success" size={24} /> : 'Enviar'}
          </Button>
          
      </Box>

    </Container >
  )
}

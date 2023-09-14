import { Box, Container, Typography, Button, TextareaAutosize, Divider, CircularProgress, FormGroup, Checkbox, FormControlLabel, TextField, Grid } from '@mui/material'
import { useState, useEffect } from 'react'
import UsersPagination from '../../../../components/Pagination/Users'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux';
import { sendConvocationEmail, resetEmailStatus } from '../../../../features/admin/adminSlice';
import { styleError, styleSuccess } from '../../../toastStyles'
import UsersCredenciados from './UsersCredenciados';
import { useNavigate } from 'react-router-dom';
import { createReunion, finishReunion, getReunions } from '../../../../features/reunion/reunionSlice';
import ReunionPagination from '../../../../components/Pagination/Reunions';
registerLocale('pt-BR', ptBR)
setDefaultLocale('ptBR')

export default function President() {

  const [users, setUsers] = useState([])
  const [startDate, setStartDate] = useState(new Date());

  const { emailStatus } = useSelector((state) => state.admin)
  const { user } = useSelector((state) => state.auth)

  const [reunions, setReunions] = useState([])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')

  const [typeReunion, setTypeReunion] = useState({
    administrativa: false,
    assembleia_ordinal: false,
    assembleia_extraordinaria: false
  })

  const handleChange = (event) => {

    const selectedType = event.target.name

    setTypeReunion({
      administrativa: selectedType === 'administrativa',
      assembleia_ordinal: selectedType === 'assembleia_ordinal',
      assembleia_extraordinaria: selectedType === 'assembleia_extraordinaria'
    })

  }

  const handleSendEmail = () => {
    if (!message) return toast.error('Preencha a menssagem', styleError)
    if (!title) return toast.error('Preencha o título', styleError)
    if (!typeReunion.administrativa && !typeReunion.assembleia_ordinal && !typeReunion.assembleia_extraordinaria) return toast.error('Selecione o tipo de reunião', styleError)

    const reunions = {
      title,
      message,
      date: startDate.toLocaleString(),
      typeReunion,
      token: user.token
    }

    dispatch(createReunion(reunions))
    //dispatch(sendConvocationEmail({ message, date: startDate.toLocaleString(), typeReunion, title }))
  }

  const handleFinishReunion = (id) => {

    const reunions = {
      id,
      token: user.token
    }

    dispatch(finishReunion(reunions))

  }

  useEffect(() => {

    dispatch(getReunions(user.token))

  }, [])

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
        <Typography variant='h5'>Bem vindo de volta, Presidente</Typography>
      </Box>

      <Divider sx={{ margin: '20px 0' }} />

      <Grid container spacing={2} >
        <Grid item xs={12} lg={12}>
          <Typography textAlign={'center'} variant='h5'>Convocar Reuniões</Typography>
        </Grid>
        <Grid item xs={12} lg={12}>
          <TextField onChange={(e) => setTitle(e.target.value)} fullWidth size='small' placeholder='Informe o título da reunião' >Título</TextField>
        </Grid>

        <Grid item xs={12} lg={12}>
          <TextareaAutosize
            minRows={6}
            placeholder='Mensagem para convocação'
            style={{ width: "100%", resize: 'none', fontSize: '16px', padding: '10px' }}
            maxRows={8}
            name='message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} lg={12}>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            dateFormat="Pp"
            locale={ptBR}
            customInput={<Button variant='outlined'>Data e Hora</Button>}
          />

          <Typography>Reunião: {startDate.toLocaleString()}</Typography>

        </Grid>

        <Grid item xs={12} lg={12}>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <FormGroup row>
              <FormControlLabel control={<Checkbox checked={typeReunion.administrativa} onChange={handleChange} name='administrativa' />} label={'Administrativa'} />
              <FormControlLabel control={<Checkbox checked={typeReunion.assembleia_ordinal} onChange={handleChange} name='assembleia_ordinal' />} label={'Assembleia ordinal'} />
              <FormControlLabel control={<Checkbox checked={typeReunion.assembleia_extraordinaria} onChange={handleChange} name='assembleia_extraordinaria' />} label={'Assembleia extraordinária'} />
            </FormGroup>

            <Button
              disabled={emailStatus.isLoading}
              onClick={handleSendEmail}
              fullWidth
              variant='contained'
              color='success'> {emailStatus.isLoading ? <CircularProgress color="success" size={24} /> : 'Convocar'}
            </Button>

          </Box>

        </Grid>

      </Grid>

      <Divider orientation='vertical' flexItem sx={{ m: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} lg={12}>
          <Typography textAlign={'center'} variant='h5'>Reuniões Convocadas</Typography>
        </Grid>

        {reunions && reunions.length > 0 ?
          reunions
            .map((reunion, index) => (
              <Grid item sm={12} lg={3} key={index}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Typography variant='h6'>{reunion.title}</Typography>
                  <Typography variant='h7'>Data: {reunion.date}</Typography>
                  <Typography variant='h7'>Tipo: {reunion.type}</Typography>
                  <Box sx={{ display: 'flex', gap: '10px' }}>
                    <Button variant='outlined' color='success' onClick={() => handleFinishReunion(reunion._id)} >Concluir</Button>
                  </Box>
                </Box>

              </Grid>
            ))
          : <Typography variant='h7'>Nenhuma reunião marcada</Typography>}

      </Grid>

      <ReunionPagination setReunionData={(r) => setReunions(r)} />



      <Divider sx={{ margin: '20px 0' }} />

      <UsersCredenciados />

    </Container >
  )
}

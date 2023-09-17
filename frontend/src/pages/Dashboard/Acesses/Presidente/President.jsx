import { Box, Container, Typography, Button, TextareaAutosize, Divider, CircularProgress, FormGroup, Checkbox, FormControlLabel, TextField, Grid, Select, MenuItem, InputLabel, Alert } from '@mui/material'
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
import { createReunion, finishReunion, getReunions, signAta } from '../../../../features/reunion/reunionSlice';
import ReunionPagination from '../../../../components/Pagination/Reunions';
import { BsTrash } from 'react-icons/bs'
import { associateProducer } from '../../../../features/auth/authSlice';
import ButtonChangeRole from '../../../../components/ChangeRole/ButtonChangeRole';
import Reunion from '../../../../components/Reunions/Reunion';
registerLocale('pt-BR', ptBR)
setDefaultLocale('ptBR')

export default function President() {

  // estados
  const [users, setUsers] = useState([])
  const [startDate, setStartDate] = useState(new Date());

  // redux
  const { emailStatus } = useSelector((state) => state.admin)
  const { user, isLoading: isLoadingAuth } = useSelector((state) => state.auth)

  const [reunions, setReunions] = useState([])

  // redux
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // mensagem e título
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')

  // selecionar os tipos de reunião
  const [selectStatus, setSelectStatus] = useState('')
  const [selectedType, setSelectType] = useState('')
  const [selectedDate, setSelectedDate] = useState('')


  // tipos de reunião
  const [typeReunion, setTypeReunion] = useState({
    administrativa: false,
    assembleia_ordinal: false,
    assembleia_extraordinaria: false
  })

  // selecionar os tipos de reunião
  const handleChange = (event) => {

    const selectedType = event.target.name

    setTypeReunion({
      administrativa: selectedType === 'administrativa',
      assembleia_ordinal: selectedType === 'assembleia_ordinal',
      assembleia_extraordinaria: selectedType === 'assembleia_extraordinaria'
    })

  }

  // enviar email
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



  // pegar reuniões
  useEffect(() => {

    dispatch(getReunions(user.token))

  }, [])

  // toast
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


      <Reunion />



      <Divider sx={{ margin: '20px 0' }} />

      <UsersCredenciados />

    </Container >
  )
}

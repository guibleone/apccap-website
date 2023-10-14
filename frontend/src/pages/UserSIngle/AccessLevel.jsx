import { useEffect, useState } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, Typography, Button, CssBaseline } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { alterAccess } from '../../features/admin/adminSlice'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../toastStyles'

function AccessLevel({ id, token }) {

  const { user } = useSelector((state) => state.auth)

  const { userData, isLoading, isSuccess } = useSelector((state) => state.admin)

  const acesso = userData ? userData.role : ''

  const [role, setRole] = useState('')
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch()

  const acessData = {
    id,
    token,
    role
  }

  const handleChange = (event) => {
    setRole(event.target.value);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleSubmit = () => {

    if (!acessData.role) {
      return toast.error('Selecione um nível de acesso', styleError)
    }

    dispatch(alterAccess(acessData))
    toast.success('Acesso alterado', styleSuccess)
  }

  useEffect(() => {

    if (isSuccess) {
      
    }

  }, [])


  if (isLoading) return <div>Carregando...</div>

  return (
    <Box >
      <CssBaseline />

      <FormControl fullWidth sx={
        {
          margin: '15px 0',
        }
      }>
        <InputLabel id="demo-controlled-open-select-label">Acesso</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          value={role}
          label="Acesso"
          onChange={handleChange}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
        >
          <MenuItem value={'admin'}>Administrador</MenuItem>
          <MenuItem value={'user'}>Usuário</MenuItem>
          <MenuItem value={'secretario'}>Secretário</MenuItem>
          <MenuItem value={'tesoureiro'}>Tesoureiro</MenuItem>
          <MenuItem value={'presidente'}>Presidente</MenuItem>
          <MenuItem value={'produtor'}>Produtor</MenuItem>
          <MenuItem value={'conselho'}>Conselho Regulador </MenuItem>
        </Select>
      </FormControl>

      <button className='button-purple' onClick={handleSubmit} style={
        {
          width: '100%'
        }
      } disabled={user._id === id}>Alterar</button>

    </Box>


  )
}

export default AccessLevel
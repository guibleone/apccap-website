import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Typography, Box, Button, useMediaQuery, CardActions, Card, CardMedia, CardContent, Grid, CssBaseline, Container } from '@mui/material';
import UsersPagination from "../../../components/Pagination/Users"
import { toast } from 'react-toastify'
import { resetStatus } from "../../../features/admin/adminSlice"
import { styleError, styleSuccess } from '../../toastStyles'
import {FaUserEdit} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

export default function Admin() {

  const navigate = useNavigate()

  const { isSuccess, isError, message } = useSelector((state) => state.admin)

  const matches = useMediaQuery('(max-width:800px)')
  const dispatch = useDispatch()

  const [users, setUsers] = useState([])

  useEffect(() => {

    if (isSuccess) {
      toast.success(message, styleSuccess)
    }

    if (isError) {
      toast.error(message, styleError)
    }

    dispatch(resetStatus())

  }, [])


  return (
    <Box sx={{
      backgroundColor: '#FAF8F8',
      minHeight: '100vh',
    }}>

      <CssBaseline />

      <Container maxWidth='xl' >
        <Box sx={{
          padding: matches ? '72px 5px' : '72px  35px',
          display: 'flex',
          flexDirection: 'column',
          gap: matches ? '20px' : '0',
        }}>
          <h3 style={{ color: '#000', fontWeight: 600 }}>
            Gerenciar Acessos
          </h3>

          <Grid
            sx={{ margin: '10px 0', display: 'flex', flexDirection: matches ? 'column' : 'row', gap: matches ? '20px' : '0' }}
            container={!matches}
            rowSpacing={5}
            columnSpacing={{ xs: 8, sm: 6, md: 3 }} >

            {users && users.map((user) => (

              <Grid key={user._id} item md={3}>
                <Box 
                  onClick={() => navigate(`/usuario/${user._id}`)}
                  sx={{
                    borderRadius: '6px',
                    border: '1.5px solid #9B9C9E',
                    padding: '24px',
                    flexDirection: 'column',
                    '&:hover': {
                      cursor: 'pointer',
                      border: '1.5px solid #00007B',
                    }       
                  }} >
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}>
                    <h3 style={{ color: '#000', fontWeight: 600 }}>    
                      {user.dados_pessoais.name.split(' ')[0]} {user.dados_pessoais.name.split(' ')[user.dados_pessoais.name.split(' ').length - 1]}
                    </h3>

                    <FaUserEdit style={{ color: '#000', fontSize: '20px' }} />

                    </Box>

                    <p sx={{
                      color: '#000',
                      fontWeight: 500,
                      fontSize: '14px',
                    }}>
  
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </p>
                  </Box>

              </Grid>

            ))}

          </Grid>

          <UsersPagination setUsersData={(u) => setUsers(u)} />

        </Box>




      </Container>

    </Box>


  )
}

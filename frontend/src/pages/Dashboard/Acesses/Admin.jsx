import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Typography, Box, Button, useMediaQuery, CardActions, Card, CardMedia, CardContent, Grid } from '@mui/material';
import UsersPagination from "../../../components/Pagination/Users"
import { toast } from 'react-toastify'
import { resetStatus } from "../../../features/admin/adminSlice"
import { styleError, styleSuccess } from '../../toastStyles'

export default function Admin() {
  const styles = {
    mobile: {
      box: {
        display: 'flex',
        flexDirection: 'column',
      },
      title: {
        color: '#00007B',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderBottom: '1px solid #00007B',
        padding: '10px',
      }
    },
    desktop: {
      box: {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        borderRadius: '10px',
        marginTop: '10px',

      },
      title: {
        color: '#00007B',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderBottom: '1px solid #00007B',
        padding: '10px',
      }
    }
  }

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
    <Box>

      <Box sx={matches ? styles.mobile.title : styles.desktop.title}>
        <Typography variant="h5" component='h2'>Painel Administrativo</Typography>
        <Typography variant="subtitle" >Usuários Cadastrados</Typography>
      </Box>


      <Grid 
      sx={{ margin: '10px 0', display: 'flex', flexDirection: matches ? 'column' : 'row', gap: matches ? '20px' : '0' }}
      container={!matches} 
      rowSpacing={5} 
      columnSpacing={{ xs: 8, sm: 6, md: 3 }} >

        {users && users.map((user) => (

          <Grid key={user._id} item md={4}>

            <Card sx={{ minWidth: 342 }}>
              
              <CardMedia
                sx={{ height: 150 }}
                image={user.pathFoto ? user.pathFoto : 'https://as1.ftcdn.net/jpg/02/68/55/60/220_F_268556012_c1WBaKFN5rjRxR2eyV33znK4qnYeKZjm.jpg'}
              />

              <CardContent>

                <Typography noWrap  gutterBottom variant="h5" component="div">
                  {user.name}
                </Typography>

                <Typography noWrap variant="body2" color="text.secondary">
                  {user.cpf} - {user.role}
                </Typography>

              </CardContent>

              <CardActions>
                <Button href={`/usuario/${user._id}`} variant='outlined' fullWidth size="small">Ver Dados</Button>
              </CardActions>
              
            </Card>

          </Grid>

        ))}

      </Grid>

      <UsersPagination setUsersData={(u) => setUsers(u)} />

    </Box>

  )
}

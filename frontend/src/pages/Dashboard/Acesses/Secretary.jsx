import { Box, Container, Typography, Button } from '@mui/material'
import UsersPagination from '../../../components/Pagination/Users'
import { useState } from 'react'
export default function Secretary() {

  const [users, setUsers] = useState([])

  return (
    <Container>
      <Box>
        <Typography variant='h4'>Bem vindo de volta, Secretário</Typography>
      </Box>

      <Box>
        <Typography variant='h7'>Estes são os usuários a serem aprovados. Por favor faça o relatório de cada um.</Typography>
      </Box>

      {users && users.map((user) => (

        <Box key={user._id}
          sx={{
            marginTop: '10px',
          }}
        >
          {user.status ==='analise' && (
          <>
            <Typography variant="h6" >{`${user.name}`}</Typography>
            <Button variant="outlined" href={`/usuario/${user._id}`}>Ver Dados</Button>
          </>
          )}

        </Box>
      ))}

      <UsersPagination setUsersData={(u) => setUsers(u)} />

    </Container >
  )
}

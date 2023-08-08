import { Box, Container, Typography, Button } from '@mui/material'
import { useState } from 'react'
import UsersPagination from '../../../components/Pagination/Users'
export default function President() {

  const [users, setUsers] = useState([])

  return (
    <Container>
      <Box>
        <Typography variant='h4'>Bem vindo de volta, Presidente</Typography>
      </Box>

      <Box>
        <Typography variant='h7'>Estes são os usuários com relatórios concluídos. Aprove e faça a devolutiva.</Typography>
      </Box>

      {users && users.map((user) => (

        <Box key={user._id}
          sx={{
            marginTop: '10px',
          }}
        >
          {(user.relatory && user.status === 'analise' )&& (
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

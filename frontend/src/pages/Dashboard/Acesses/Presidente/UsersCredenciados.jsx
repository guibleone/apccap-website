import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import UsersPagination from '../../../../components/Pagination/Users'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


export default function UsersCredenciados() {

    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const { users: usersData } = useSelector((state) => state.admin)


    useEffect(() => {

        if (usersData) {
            setUsers(usersData)
        }

    }, [usersData])

    return (
        <>
            <Box>
                <Typography variant='h5'>Produtores</Typography>
                <Typography variant='p'>Gerencie as credenciais</Typography>
            </Box>

            {users && users.map((user) => (

                <Box key={user._id}
                    sx={{
                        marginTop: '10px',
                    }}
                >
                    {(user.role === 'produtor' && user.status === 'aprovado') && (
                        <>
                            <Typography variant="h6" >{`${user.name}`}</Typography>
                            <Button variant="outlined" onClick={() => navigate(`/usuario-credenciado/${user._id}`)} > Ver Dados</Button>
                        </>
                    )}

                </Box >

            ))
            }

            <UsersPagination setUsersData={(u) => setUsers(u)} />
        </>
    )
}

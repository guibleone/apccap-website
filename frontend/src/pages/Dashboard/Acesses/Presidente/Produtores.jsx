import React from 'react'
import { colors } from '../../../colors'
import { Box, Button, Container, Grid, Typography, useMediaQuery } from '@mui/material'
import { useState, useEffect } from 'react'
import UsersPagination from '../../../../components/Pagination/Users'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineEdit } from 'react-icons/ai'


export default function Produtores() {
    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const { users: usersData } = useSelector((state) => state.admin)

    const matches = useMediaQuery('(min-width:600px)');


    useEffect(() => {

        if (usersData) {
            setUsers(usersData)
        }

    }, [usersData])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Box sx={{ backgroundColor: colors.main_white, minHeight: '100vh' }}>
            <Container maxWidth='xl'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={12}>
                        <Box sx={{ textAlign: 'center' , padding: '72px 0', }}>
                            <h1 className='bold black'>
                                Produtores
                            </h1>
                            <h5 className='regular black'>
                                Gerencie as credenciais dos produtores
                            </h5>
                        </Box>
                    </Grid>

                    <Grid item xs={12} lg={12}>
                        {users && users.filter(user => user.role === 'produtor_associado' || user.role === 'produtor').map((user) => (


                            <Grid item xs={12} md={3} pr={matches ? 2 : 0} key={user._id}>
                                <Box sx={{
                                    backgroundColor: colors.main_grey,
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '24px'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}>
                                        <h4 className='semi-bold black'>
                                            {user.dados_pessoais.name}
                                        </h4>
                                        <AiOutlineEdit size={25} />

                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '5px'
                                    }}>
                                        <h4 className='semi-bold black'>{user.role === 'produtor_associado' ? 'Produtor Associado' : user.role}</h4>
                                        <Link className='regular black italic' to={`/usuario-credenciado/${user._id}`}>
                                            <h5>Ver Produtor</h5>
                                        </Link>
                                    </Box>
                                </Box>
                            </Grid>


                        ))
                        }

                        <UsersPagination setUsersData={(u) => setUsers(u)} />

                    </Grid>


                </Grid>
            </Container>
        </Box>
    )
}

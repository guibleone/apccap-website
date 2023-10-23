import React from 'react'
import { useEffect, useState } from 'react'
import { colors } from '../../../colors'
import { useNavigate } from 'react-router-dom'
import UsersPagination from '../../../../components/Pagination/Users'
import { useMediaQuery, Box, Container, Grid } from '@mui/material'


export default function TodosProdutos() {
    const matches = useMediaQuery('(min-width:600px)')
    const navigate = useNavigate()

    const [users, setUsers] = useState([])

    useEffect(() => {
        window.scrollTo(0, 0)
    }
        , [])

    return (
        <Box sx={{
            backgroundColor: colors.main_white,
            minHeight: '100vh',
        }}>
            <Container maxWidth='xl'>
                <Grid container rowSpacing={2} pt={'72px'}>
                    <Grid item xs={12} md={12}>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '36px'
                        }}>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: !matches ? 'column' : 'row',
                                alignItems: 'center',

                            }}>
                                <h3 className='black semi-bold'>
                                    Usuários com produtos em análise
                                </h3>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: matches ? 'column' : 'row',
                                    gap: '10px'
                                }}>
                                </Box>

                            </Box>
                        </Box>
                    </Grid>

                    {(users && users?.produtos?.length === 0) && (
                        <Grid item >
                            <h3 className='regular black'>
                                Nenhum pedido de produto pendente.
                            </h3>
                        </Grid>
                    )}    

                    {users &&
                        users?.produtos?.map((user) => (
                            <Grid item xs={12} md={2} pr={matches ? 2 : 0} key={user._id}>
                                <Box sx={{
                                    backgroundColor: colors.main_grey,
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '24px'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px'

                                    }}>
                                        <h3 className='semi-bold black'>
                                            {user.dados_pessoais.name.split(' ')[0]}
                                        </h3>
                                        <h4 className='regular black'>
                                            {user.role === 'produtor_associado' ? 'Produtor Associado' : user.role}
                                        </h4>
                                    </Box>

                                    <button onClick={() => navigate(`/produtos-usuario/${user._id}`)} className='button-purple small' style={{ width: '100%' }}>
                                        Ver Produtos
                                    </button>
                                </Box>

                            </Grid>
                        ))}
                </Grid>

                <UsersPagination setUsersData={(u) => setUsers(u)} productsQuantity={true} />

            </Container>
        </Box>
    )
}

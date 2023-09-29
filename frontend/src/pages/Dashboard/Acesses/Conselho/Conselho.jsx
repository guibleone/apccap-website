import { Box, Button, Container, Divider, Grid, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import UsersPagination from '../../../../components/Pagination/Users'
import { getProducts } from '../../../../features/products/productsSlice'
import ButtonChangeRole from '../../../../components/ChangeRole/ButtonChangeRole'
import Reunion from '../../../../components/Reunions/Reunion'
import { colors } from '../../../colors'


export default function Conselho() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [users, setUsers] = useState([])
    const { users: usersData } = useSelector((state) => state.admin)

    useEffect(() => {

        if (usersData) {
            setUsers(usersData)
        }

    }, [usersData])


    return (
        <Box sx={{
            backgroundColor: colors.main_white,
            minHeight: '100vh',
        }}>

            <Container maxWidth='xl' >
                <Grid container spacing={2}>

                    <Grid item xs={12} sm={12} lg={12}>
                        <Typography variant='h5'>Conselho regulador</Typography>
                        <Typography variant='p'>Seja bem vindo, </Typography>
                        <Divider sx={{ margin: '10px 0' }} />
                    </Grid>

                    <Grid item xs={12} sm={12} lg={12}>

                        <Typography variant='h5'>Pedidos de credenciamento</Typography>
                        <Typography variant='p'>Credenciais para análise</Typography>

                        {users && users.map((user) => (

                            <Box key={user._id}
                                sx={{
                                    marginTop: '10px',
                                }}
                            >
                                {(user.status === 'analise') && (
                                    <>
                                        <Typography variant="h6" >{`${user.dados_pessoais.name}`}</Typography>
                                        <Button variant="outlined" onClick={() => navigate(`/analise-credencial/${user._id}`)} > Ver Dados</Button>
                                    </>
                                )}

                            </Box >

                        ))
                        }

                        <UsersPagination setUsersData={(u) => setUsers(u)} />

                        <Divider sx={{ margin: '10px 0' }} />

                    </Grid>

                    <Grid item xs={12} sm={12} lg={12}>

                        <Typography variant='h5'>Produtos para análise</Typography>

                        {users && users.map((user) => (

                            <Box key={user._id}
                                sx={{
                                    marginTop: '10px',
                                }}
                            >
                                {user.productsQuantity >= 1 && (
                                    <>
                                        <Typography variant="h6" >{`${user.dados_pessoais.name}`}</Typography>
                                        <Button variant="outlined" onClick={() => navigate(`/produtos-usuario/${user._id}`)} >Ver Dados</Button>
                                    </>
                                )}

                            </Box >

                        ))
                        }

                        <UsersPagination setUsersData={(u) => setUsers(u)} />

                        <Divider sx={{ margin: '10px 0' }} />

                    </Grid>

                    <Reunion />

                </Grid>

            </Container>

        </Box>
    )
}

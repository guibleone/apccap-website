import { Box, Container,  Grid, useMediaQuery } from '@mui/material'
import { useState,  } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UsersPagination from '../../../../components/Pagination/Users'
import { colors } from '../../../colors'
import { BsArrowUpRight } from 'react-icons/bs'


export default function Conselho() {
    const navigate = useNavigate()

    const [users, setUsers] = useState([])

    const matches = useMediaQuery('(min-width:600px)');


    return (
        <Box sx={{
            backgroundColor: colors.main_white,
            minHeight: '100vh',
        }}>

            <Container maxWidth='xl' >
                <Grid container spacing={2} pb={5}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '72px 0',
                            gap: '36px'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}><h3 className='semi-bold black'>
                                    Credencial
                                </h3>
                                <h1 className='black semi-bold'>
                                    Conselho Regulador
                                </h1>
                                <h5 className='black regular' style={{
                  textAlign: 'justify'
                }}>
                                Como membro do Conselho Regulador, assuma a responsabilidade de gerenciar credenciais e avaliar pedidos de selos. Sua posição é crucial para manter os padrões elevados e garantir a qualidade que define a APCCAP.
                                </h5>
                            </Box>
                            <button onClick={() => navigate('/meu-perfil')} className='button-purple' style={{ width: '182px' }}>
                                Meus Dados <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom' }} />
                            </button>
                        </Box>
                    </Grid>

                </Grid>


                <Grid container rowSpacing={3}>


                    <Grid item xs={12} md={12}>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',

                            gap: '24px'
                        }}>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}>
                                <h3 className='black semi-bold'>
                                    Credenciais solicitadas
                                </h3>
                            </Box>
                        </Box>
                    </Grid>


                    {(users && users?.credenciamento?.length === 0) && (
                        <Grid item >
                            <h3 className='regular black'>
                                Nenhum pedido de credenciamento pendente.
                            </h3>
                        </Grid>
                    )}

                    {users && users?.credenciamento?.slice(0, 4)?.map((user) => (
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

                                <button onClick={() => navigate(`/analise-credencial/${user._id}`)} className='button-purple small' style={{ width: '100%' }}>
                                    Ver Dados
                                </button>
                            </Box>

                        </Grid>
                    ))
                    }

                    <Grid item xs={12} md={12}>
                        {(users && users?.credenciamento?.length > 4) && (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}>
                                <Link style={{ color: '#000', margin: '15px 0' }} to='/credenciamento'> Ver Tudo</Link>
                            </Box>
                        )}
                    </Grid>

                </Grid>

                <UsersPagination setUsersData={(u) => setUsers(u)} status='analise' productsQuantity={'false'} invisible={true} />


                <Grid container rowSpacing={3} pb={10}>


                    <Grid item xs={12} md={12}>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '36px'
                        }}>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}>
                                <h3 className='black semi-bold'>
                                    Produtos solicitados
                                </h3>
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

                    {users && users?.produtos?.slice(0, 4).map((user) => (
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
                    ))
                    }

                    <Grid item xs={12} md={12}>
                        {(users && users?.produtos?.length > 4) && (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}>
                                <Link style={{ color: '#000', margin: '15px 0' }} to='/produtos-conselho'> Ver Tudo</Link>
                            </Box>
                        )}
                    </Grid>

                    <UsersPagination setUsersData={(u) => setUsers(u)} status='analise' productsQuantity={'true'} invisible={true}/>

                </Grid>

            </Container>

        </Box>
    )
}

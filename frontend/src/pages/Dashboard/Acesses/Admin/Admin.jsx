import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Box, useMediaQuery, Grid, CssBaseline, Container } from '@mui/material';
import UsersPagination from "../../../../components/Pagination/Users"
import { toast } from 'react-toastify'
import { resetStatus } from "../../../../features/admin/adminSlice"
import { styleError, styleSuccess } from '../../../toastStyles'
import { FaUserEdit } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';
import PublicationsPagination from '../../../../components/Pagination/Publications';
import { BsArrowUpRight } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';

export default function Admin() {

  const navigate = useNavigate()

  const { isSuccess, isError, message } = useSelector((state) => state.admin)

  const matches = useMediaQuery('(max-width:800px)')
  const dispatch = useDispatch()

  const [users, setUsers] = useState([])
  const [publications, setPublications] = useState([])
  const { destaques } = useSelector((state) => state.blog)

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
          padding: matches ? '72px 0px' : '72px  0px',
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

            {users && users?.todos?.map((user) => (

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

                  <h5 className='regular black'>

                    {user?.role === 'produtor_associado' ? 'Produtor Associado' : user?.role.charAt(0)?.toUpperCase() + user?.role?.slice(1)}
                  </h5>
                </Box>

              </Grid>

            ))}

          </Grid>

          <UsersPagination setUsersData={(u) => setUsers(u)} role={'todos'} pages={8} />

        </Box>

        <Grid container spacing={2} >
          <Grid item xs={12} md={12}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <h3 style={{ color: '#000', fontWeight: 600 }}>
                Publicações em Destaque
              </h3>

              <button onClick={() => navigate('/publicacoes')} className='button-white-bottom-border'>
                Ver Todas <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom', marginLeft: '5px' }} />
              </button>

            </Box>
          </Grid>

          <Grid item >
            {(destaques && destaques.length === 0) && (
              <h3 className='regular black'>
                Nenhuma publicação em destaque.
              </h3>
            )}
          </Grid>

          {destaques && destaques?.map((publicacao) => (
            <Grid key={publicacao._id} item xs={12} md={2.9}>
              <Box
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
                  {publicacao.title.slice(0, 20)}... 
                  </h3>

                  <AiOutlineEdit style={{ color: '#000', fontSize: '20px' }} />

                </Box>

                <Link style={{
                  textDecorationColor: '#000',

                }}>
                  <h5 className='regular black italic'>
                    {publicacao?.theme}
                  </h5>
                </Link>

                <Box sx={{
                  marginTop: '24px',
                }}>

                  <h4 className='semi-bold black' >
                    {publicacao?.publication_date.split('-')[2].split('T')[0]}/{publicacao?.publication_date.split('-')[1]}/{publicacao?.publication_date.split('-')[0]}
                  </h4>
                </Box>

              </Box>



            </Grid>

          ))}

        </Grid>

        <PublicationsPagination setPublicationsData={(p) => setPublications(p)} isDestaque={true} pages={4} invisible={true}  />


      </Container>

    </Box>


  )
}

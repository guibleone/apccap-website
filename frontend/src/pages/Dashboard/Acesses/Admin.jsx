import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Typography, Box, Button, useMediaQuery } from '@mui/material';
import UsersPagination from "../../../components/Pagination/Users"
import { toast } from 'react-toastify'
import { resetStatus } from "../../../features/admin/adminSlice"


export default function Admin() {
    const styleError = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    
      const styleSuccess = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    
    const {isSuccess, isError, message} = useSelector((state) => state.admin)

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
          <Box sx={matches && {
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
          }}>

            <Typography sx={matches && { textAlign: 'center' }} variant="h5" component='h1'>Usuários Cadastrados</Typography>

            {users && users.map((user) => (

              <Box key={user._id}
                sx={{
                  marginTop: '10px',
                }}
              >
                <Typography variant="h6" >{`${user.name} - ${user.role}`}</Typography>

                <Button fullWidth={matches} variant="outlined" href={`/usuario/${user._id}`}>Ver Dados</Button>

              </Box>
            ))}
            
            <UsersPagination setUsersData={(u) => setUsers(u)} />

          </Box>         
    </Box>
  )
}

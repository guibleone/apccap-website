import { Box } from '@mui/material'
import React from 'react'

function Footer() {
  return (

      <Box sx={
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50px',
          backgroundColor: '#292929',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 'bold',
        }
      }>
      <div>Direitos Reservados</div>

      </Box>

  )
}

export default Footer
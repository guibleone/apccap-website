import { Box, Button, CircularProgress, Link } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { associateProducer } from '../../features/auth/authSlice'
import { useEffect, useState } from 'react'


export default function ButtonChangeRole() {

    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [timer, setTimer] = useState(false)

    // trocar acesso
    const handleAssociateProducer = () => {

        const data = {
            token: user.token,
            id: user._id
        }

        dispatch(associateProducer(data))

        setTimer(true)

        setTimer(setTimeout(() => {
            setTimer(false)
        }
            , 1000))
    }

    return (

        <Button
            variant='outlined'
            color='success'
            onClick={handleAssociateProducer}
            disabled={timer}
        >
           Trocar Acesso
        </Button>
    )
}

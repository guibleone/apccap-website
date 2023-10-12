import { Box, Button, CircularProgress, CssBaseline, Link } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { associateProducer } from '../../features/auth/authSlice'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function ButtonChangeRole() {

    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [timer, setTimer] = useState(false)

    // trocar acesso
    const handleAssociateProducer = () => {

        navigate('/')

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
        <>
            <CssBaseline />
            <button
                className='button-white small'
                onClick={handleAssociateProducer}
                disabled={timer}
            >
                Trocar Acesso
            </button>
        </>
    )
}

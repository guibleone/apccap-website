import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createResume, reset, updateResume } from '../../features/resume/resumeSlice'
import { toast } from 'react-toastify'
import { Button, Typography, TextareaAutosize, Box, CircularProgress } from '@mui/material';
import {styleError, styleSuccess} from '../toastStyles'

function Resume() {

  const { resume, isError, isLoading, isSuccess, message } = useSelector((state) => state.resume)

  const { user } = useSelector((state) => state.auth)

  const [inputData, setInputData] = useState({
    id: resume ? resume._id : '',
    body: resume ? resume.body : '',
    userId: user._id,
    userToken: user.token
  })

  const { body } = inputData

  const dispatch = useDispatch()

  useEffect(() => {

    if (isError) {
      toast.error(message, styleError)
    }

    if (isSuccess) {
      toast.success('Resumo atualizado com sucesso', styleSuccess)
    }

    dispatch(reset())


  }, [resume, isError, isLoading, isSuccess, message, dispatch])


  useEffect(() => {
    if (resume) {
      setInputData(prevInputData => ({
        ...prevInputData,
        id: resume._id,
        body: resume.body,
      }));
    }
  }, [resume]);

  // envia o resumo para o backend
  const submitResume = (e) => {
    e.preventDefault()

    const resumeData = {
      body: body,
      userId: user._id,
      userToken: user.token
    }

    dispatch(createResume(resumeData))

  }

  // atualiza o estado do input
  const onChange = (e) => {
    const { name, value } = e.target
    setInputData({ ...inputData, [name]: value })
  }

  // atualiza o resumo no backend
  const handleUpdate = (e) => {

    e.preventDefault()

    dispatch(updateResume(inputData))

  }

  return (
    <Box sx={
      {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }
    }>

      <Typography sx={
        {
          marginBottom: '20px',
          textAlign:'center'

        }} variant='h5' >Resumo</Typography>

      <TextareaAutosize minRows={4} onChange={onChange} name="body" id="body" defaultValue={body} />

      {resume ?
          <Button variant="contained" onClick={handleUpdate} disabled={isLoading && resume} color="primary">{isLoading && resume ? <CircularProgress color="success" /> : 'Atualizar'}</Button>

        : <Button variant="contained" onClick={submitResume} disabled={isLoading && resume} color="primary">{isLoading  && resume ? <CircularProgress color="success" /> : 'Criar'}</Button>}


    </Box>
  )
}

export default Resume
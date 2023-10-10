import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createResume, reset, updateResume } from '../../features/resume/resumeSlice'
import { toast } from 'react-toastify'
import { Button, Typography, TextareaAutosize, Box, CircularProgress } from '@mui/material';
import {styleError, styleSuccess} from '../toastStyles'
import { colors } from '../colors';

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

    
    <h3>Resumo da Produção</h3>

      <TextareaAutosize minRows={4} onChange={onChange} name="body" id="body" defaultValue={body} style={{
        padding: '10px',
        resize: 'none',
        backgroundColor:colors.main_white
      }} />

      {resume?.body ? <button className='button-purple' onClick={handleUpdate} disabled={isLoading && resume} color="primary">{isLoading && resume ? <CircularProgress color="success" /> : 'Atualizar'}</button>
       : <button className='button-purple' onClick={submitResume} disabled={isLoading && resume} color="primary">{isLoading  && resume ? <CircularProgress color="success" /> : 'Criar'}</button>}


    </Box>
  )
}

export default Resume
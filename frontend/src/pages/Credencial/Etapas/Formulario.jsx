import React, { useState } from 'react'
import { Box } from '@mui/system'
import { BsArrowUpRight } from 'react-icons/bs'
import { Dialog, Grid,  TextField } from '@mui/material'
import { colors } from '../../colors'
import { useSelector, useDispatch } from 'react-redux'
import { submitForm } from '../../../features/auth/authSlice'
import { toast } from 'react-toastify'
import { styleError } from '../../toastStyles'

export default function Formulario() {

    // inicializar redux
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)

    // abrir modal do formulário
    const [openForm, setOpenForm] = useState(false)

    const handleOpenForm = () => {
        setOpenForm(!openForm)
    }

    // dados do formulário
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        cnpj: '',
        propriedade: '',
    })

    const { nome, cpf, cnpj, propriedade } = formData

    // pegar dados do formulário
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    // enviar dados do formulário
    const handleSubmitForm = () => {

        if(!formData.nome || !formData.cpf || !formData.cnpj || !formData.propriedade) {
            return toast.error('Preencha todos os campos', styleError)
        }

        const data = {
            id: user._id,
            token: user.token,
            formData: {...formData}
        }

        dispatch(submitForm(data))
    }

    return (
        <>
            <Box sx={{ textAlign: 'center' }}>
                <h1 className='bold black'>
                    Formulário
                </h1>
                <h5 className='regular black'>
                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                </h5>
            </Box>
            <button className='button-purple' onClick={handleOpenForm}>
                Preencher formulário <BsArrowUpRight size={20} style={{ verticalAlign: 'bottom' }} />
            </button>


            <Dialog open={openForm} title='Formulário' onClose={handleOpenForm} >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: colors.main_white,
                    padding: '24px',
                    gap: '24px',
                    minHeight: '100%'
                }}>
                    <Box>
                        <h3 className='semi-bold black'>
                            Formulário de Requerimento
                        </h3>
                        <h5 className='regular black'>
                            Preencha as informações abaixo corretamente.
                        </h5>
                    </Box>


                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField onChange={handleChange} fullWidth label="Nome" name='nome' value={nome} variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField onChange={handleChange} fullWidth label="CPF" name='cpf' value={cpf} variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField onChange={handleChange} fullWidth label="CNPJ" name='cnpj' value={cnpj} variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField onChange={handleChange} fullWidth label="Propriedade" name='propriedade' value={propriedade} variant="outlined" />
                        </Grid>

                    </Grid>

                    <Box sx={{
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'flex-end'
                    }}>
                        <button className='button-purple' onClick={handleOpenForm}>Voltar</button>
                        <button className='button-white' onClick={() => { handleOpenForm(); handleSubmitForm(); }}>Enviar</button>
                    </Box>

                </Box>
            </Dialog>

        </>

    )
}


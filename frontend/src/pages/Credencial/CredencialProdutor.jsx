import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Container, Grid, Modal, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { colors } from '../colors'
import { BsArrowDownShort, BsArrowRightShort, BsArrowUpRight, BsChevronDown, BsChevronRight } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Formulario from './Etapas/Formulario'
import { toast } from 'react-toastify'
import { styleError, styleSuccess } from '../toastStyles'
import Documentos from './Etapas/Documentos'
import Analise from './Etapas/Analise'
import { associate, cancelCredencial, reset, resetAprove } from '../../features/auth/authSlice'
import Mensalidade from './Mensalidade'
import { getDocuments } from '../../features/documents/documentsSlice'

export default function Credencial() {

    const dispatch = useDispatch()

    const { payments } = useSelector((state) => state.payments)

    // abir e fechar passos 
    const [expanded, setExpanded] = useState('panel1');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    }

    // inicializar redux
    const { user, isSuccess, isError, message } = useSelector((state) => state.auth)
    const { documents } = useSelector((state) => state.documents)

    // responsividade
    const matches = useMediaQuery('(min-width:600px)');

    // mostar toast de sucesso ou erro
    useEffect(() => {

        if (isSuccess) {
            toast.success(message, styleSuccess)
        }

        if (isError) {
            toast.error(message, styleError)
        }

        dispatch(reset())

    }, [isSuccess, isError, message])

    const handleAssociate = () => {
        const data = {
            id: user._id,
            token: user.token
        }

        dispatch(associate(data))

    }

    const handleCancel = () => {
        const data = {
            id: user._id,
            token: user.token
        }

        dispatch(cancelCredencial(data))

    }

    useEffect(() => {
    
        if (user) {
          dispatch(getDocuments(user.token))
        }
    
      }, [user])


    return (
        <Box sx={{
            backgroundColor: colors.main_white,
            minHeight: '100vh',
        }}>
            <Container maxWidth='xl'>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '72px 0',
                            gap: '10px'
                        }}>
                            <h3 className='semi-bold black'>
                                Credencial
                            </h3>
                            {(user.role === 'produtor_associado' || user.oldRole) ? (<>
                                <h1 className='bold black'>
                                    Produtor Associado
                                </h1>

                                {(user.status === 'aprovado' || user.oldRole) && (
                                    <Mensalidade />
                                )}

                            </>) : (
                                <>
                                    <h1 className='bold black'>
                                        Produtor Não Associado
                                    </h1>
                                    <button onClick={handleAssociate} className='button-purple'>
                                        Associar-se
                                    </button>
                                </>)}

                                {(user?.status === 'reprovado' || user?.analise?.analise_laboratorial?.status==='reprovado'  || user?.analise?.vistoria?.status==='reprovado'  
                                || user?.analise?.analise_pedido?.status==='reprovado') && (
                                    <>
                                    <button onClick={()=> dispatch(resetAprove({id:user._id,token:user.token}))} className='button-purple'>
                                        Tentar Novamente
                                    </button>
                                    <Alert severity="error">
                                        Você foi reprovado no pedido de credencial. Por favor, tente novamente.
                                    </Alert>
                                    </>
                                )}

                        </Box>
                    </Grid>


                    {/* credencial produtor */}
                    {user && (user.role === 'produtor' && !user.oldRole) && (<>
                        <Grid item xs={12} md={12}>

                            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{
                                backgroundColor: colors.main_white,
                            }} >
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {expanded === 'panel1' ? <BsChevronDown size={20} /> : <BsChevronRight size={20} />}
                                        <h4 className='semi-bold black'>
                                            Para que serve a credencial ?
                                        </h4>
                                    </Box>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <Grid container rowSpacing={2} columnSpacing={6}>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px', borderRadius: '5.694px', border: '1.898px solid #000 ' }}>
                                                <h3 className='semi-bold black'>
                                                    Primeira Etapa
                                                </h3>
                                                <h5 className='regular black'>
                                                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                                                </h5>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px', borderRadius: '5.694px', border: '1.898px solid #000 ' }}>
                                                <h3 className='semi-bold black'>
                                                    Segunda Etapa
                                                </h3>
                                                <h5 className='regular black'>
                                                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                                                </h5>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px', borderRadius: '5.694px', border: '1.898px solid #000 ' }}>
                                                <h3 className='semi-bold black'>
                                                    Terceira Etapa
                                                </h3>
                                                <h5 className='regular black'>
                                                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                                                </h5>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px', borderRadius: '5.694px', border: `1.898px solid ${colors.main_purple} ` }}>
                                                <h3 className='semi-bold'>
                                                    Acesso Liberado
                                                </h3>
                                                <h5 className='regular'>
                                                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                                                </h5>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={12}>
                                            <Box sx={{ display: 'flex', gap: '10px', flexDirection: matches ? 'row' : 'column' }}>
                                                <h5 className='semi-bold black'>
                                                    Dúvidas ?
                                                </h5>
                                                <h5 className='regular black'>
                                                    Visite nosso <a href='https://www.google.com.br' target='_blank' rel="noreferrer" className='purple'>FAQ</a> ou vá até a <a href='https://www.google.com.br' target='_blank' rel="noreferrer" className='purple'>nossa sede presencial</a>
                                                </h5>
                                            </Box>
                                        </Grid>

                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                        </Grid>
                    </>)}

                    {/*cancelar credencilal*/}
                    {user && (user.role === 'produtor_associado' && user.status === 'aprovado' && payments && payments.subscription === 'active') && (<>
                        <Grid item xs={12} md={12}>

                            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{
                                backgroundColor: colors.main_white,
                            }} >
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {expanded === 'panel1' ? <BsChevronDown size={20} /> : <BsChevronRight size={20} />}
                                        <h4 className='semi-bold black'>
                                            Como cancelar a minha credencial ?
                                        </h4>
                                    </Box>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <Grid container rowSpacing={2} columnSpacing={6}>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px', borderRadius: '5.694px', border: '1.898px solid #000 ' }}>
                                                <h3 className='semi-bold black'>
                                                    Primeira Etapa
                                                </h3>
                                                <h5 className='regular black'>
                                                    Na página da credencial acesse o portal do produtor e cancele a sua renovação automática.
                                                </h5>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px', borderRadius: '5.694px', border: '1.898px solid #000 ' }}>
                                                <h3 className='semi-bold black'>
                                                    Segunda Etapa
                                                </h3>
                                                <h5 className='regular black'>
                                                    Você terá ainda 30 dias para acessar o portal do produtor. Podendo reativar a mensalidade.
                                                </h5>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px', borderRadius: '5.694px', border: '1.898px solid #000 ' }}>
                                                <h3 className='semi-bold black'>
                                                    Terceira Etapa
                                                </h3>
                                                <h5 className='regular black'>
                                                    Após cancelar sua assinatura no portal do produtor. Aguarde 30 dias para cancelar sua credencial.
                                                </h5>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px', borderRadius: '5.694px', border: `1.898px solid ${colors.main_purple} ` }}>
                                                <h3 className='semi-bold'>
                                                    Cancelar Credencial
                                                </h3>
                                                <h5 className='regular'>

                                                </h5>
                                                <Button onClick={handleCancel} color='success' variant='outlined'  disabled={payments.subscription !== 'active' ? true : false} className='Button-purple'>
                                                    Cancelar
                                                </Button>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={12}>
                                            <Box sx={{ display: 'flex', gap: '10px', flexDirection: matches ? 'row' : 'column' }}>
                                                <h5 className='semi-bold black'>
                                                    Dúvidas ?
                                                </h5>
                                                <h5 className='regular black'>
                                                    Visite nosso <a href='https://www.google.com.br' target='_blank' rel="noreferrer" className='purple'>FAQ</a> ou vá até a <a href='https://www.google.com.br' target='_blank' rel="noreferrer" className='purple'>nossa sede presencial</a>
                                                </h5>
                                            </Box>
                                        </Grid>

                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                        </Grid>
                    </>)}



                    {/* aprovar credencial */}

                    {user && (user.role === 'produtor_associado' && user.status === 'analise' && !user.oldRole) && (<>
                        <Grid item xs={12} md={12}>

                            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{
                                backgroundColor: colors.main_white,
                            }} >
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {expanded === 'panel1' ? <BsChevronDown size={20} /> : <BsChevronRight size={20} />}
                                        <h4 className='semi-bold black'>
                                            Como aprovar a minha credencial ?
                                        </h4>
                                    </Box>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <Grid container rowSpacing={2} columnSpacing={6}>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px', borderRadius: '5.694px', border: '1.898px solid #000 ' }}>
                                                <h3 className='semi-bold black'>
                                                    Primeira Etapa
                                                </h3>
                                                <h5 className='regular black'>
                                                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                                                </h5>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px', borderRadius: '5.694px', border: '1.898px solid #000 ' }}>
                                                <h3 className='semi-bold black'>
                                                    Segunda Etapa
                                                </h3>
                                                <h5 className='regular black'>
                                                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                                                </h5>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px', borderRadius: '5.694px', border: '1.898px solid #000 ' }}>
                                                <h3 className='semi-bold black'>
                                                    Terceira Etapa
                                                </h3>
                                                <h5 className='regular black'>
                                                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                                                </h5>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px', borderRadius: '5.694px', border: `1.898px solid ${colors.main_purple} ` }}>
                                                <h3 className='semi-bold'>
                                                    Acesso Liberado
                                                </h3>
                                                <h5 className='regular'>
                                                    Lorem ipsum dolor sit amet consectetur. Adipiscing amet morbi bibendum senectus. Eget sed vulputate arcu.
                                                </h5>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={12}>
                                            <Box sx={{ display: 'flex', gap: '10px', flexDirection: matches ? 'row' : 'column' }}>
                                                <h5 className='semi-bold black'>
                                                    Dúvidas ?
                                                </h5>
                                                <h5 className='regular black'>
                                                    Visite nosso <a href='https://www.google.com.br' target='_blank' rel="noreferrer" className='purple'>FAQ</a> ou vá até a <a href='https://www.google.com.br' target='_blank' rel="noreferrer" className='purple'>nossa sede presencial</a>
                                                </h5>
                                            </Box>
                                        </Grid>

                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                        </Grid>



                        <Grid item xs={12} md={12}>
                            {matches ? (
                                <Box sx={{ display: 'flex', gap: '48px', padding: '72px 0', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: '10px',
                                    }}>
                                        <Box sx={{}}>
                                            <h5 className='semi-bold black'>
                                                Fomulário  <BsArrowRightShort size={20} style={{ verticalAlign: 'bottom' }} />
                                            </h5>
                                        </Box>

                                        <Box sx={{
                                            opacity: (user && !user.formulario_requerimento) ? '0.5' : '1',
                                        }}>
                                            <h5 className='semi-bold black' sx={{}}>
                                                Documentos <BsArrowRightShort size={20} style={{ verticalAlign: 'bottom' }} />
                                            </h5>
                                        </Box>


                                        <Box sx={{
                                            opacity: (user && !documents[0]) ? '0.5' : '1',
                                        }}>
                                            <h5 className='semi-bold black'>
                                                Análise  <BsArrowRightShort size={20} style={{ verticalAlign: 'bottom' }} />
                                            </h5>

                                        </Box>

                                        <Box sx={{
                                            opacity: (user && !user.analise.analise_laboratorial.path) ? '0.5' : '1',
                                        }}>
                                            <h5 className='semi-bold black'>
                                                Pagamento <BsArrowRightShort size={20} style={{ verticalAlign: 'bottom' }} />
                                            </h5>

                                        </Box>

                                        <Box sx={{
                                            opacity: (user && !user.pagamento) ? '0.5' : '1',
                                        }}>

                                            <h5 className='semi-bold black'>
                                                Acesso
                                            </h5>
                                        </Box>

                                    </Box>

                                    <Box sx={{ display: 'flex', gap: '48px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        {user && !user.formulario_requerimento && (
                                            <Formulario />
                                        )}

                                        {user && user.formulario_requerimento && !documents[0] && (
                                            <Documentos />
                                        )}

                                        {user && user.formulario_requerimento && documents[0]?.path  && (
                                            <Analise />
                                        )}

                                    </Box>

                                </Box>)

                                :
                                (
                                    <Box sx={{ display: 'flex', gap: '48px', padding: ' 0 0 72px 0', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: '10px',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}>
                                            <h3 className='semi-bold black'>
                                                Fomulário
                                            </h3>
                                            <BsArrowDownShort size={20} />

                                            <h3 className='semi-bold black'>
                                                Documentos
                                            </h3>
                                            <BsArrowDownShort size={20} />

                                            <h3 className='semi-bold black'>
                                                Análise
                                            </h3>
                                            <BsArrowDownShort size={20} />
                                            <h3 className='semi-bold black'>
                                                Pagamento
                                            </h3>
                                            <BsArrowDownShort size={20} />
                                            <h3 className='semi-bold black'>
                                                Acesso
                                            </h3>

                                        </Box>
                                        <Box sx={{ display: 'flex', gap: '48px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        {user && !user.formulario_requerimento && (
                                            <Formulario />
                                        )}

                                        {user && user.formulario_requerimento && !documents[0] && (
                                            <Documentos />
                                        )}

                                        {user && user.formulario_requerimento && documents[0]?.path  && (
                                            <Analise />
                                        )}

                                    </Box>


                                    </Box>
                                )}

                        </Grid>
                    </>)}



                </Grid>




            </Container>



        </Box>
    )
}

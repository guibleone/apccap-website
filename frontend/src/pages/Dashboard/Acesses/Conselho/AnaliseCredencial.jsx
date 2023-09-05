import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addRelatorys, deleteRelatorys, getDocumentsData, getUserData } from "../../../../features/admin/adminSlice"
import { Avatar, Box, Button, CircularProgress, Container, Divider, Grid, Typography, useMediaQuery } from "@mui/material"
import { AiOutlineDelete, AiOutlineDownload } from "react-icons/ai"
import { FcPrivacy } from "react-icons/fc"

export default function AnaliseCredencial() {
    const { id } = useParams()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
    const { userData, documentsData, isLoading } = useSelector((state) => state.admin)

    const matches = useMediaQuery('(min-width:800px)')

    const fileInput = useRef(null)

    // informação do documento
    const [documentData, setDocumentData] = useState({
        type: '',
        path: '',
        id,
        token: user.token
    })

    const onChange = (e) => {
        setDocumentData({ ...documentData, type: e.target.name, path: fileInput.current.files[0] })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        dispatch(addRelatorys(documentData))
    }

    const handleDelete = (type) => {

        const data = {
            id,
            token: user.token,
            type
        }

        dispatch(deleteRelatorys(data))
    }

    useEffect(() => {

        dispatch(getUserData({ id, token: user.token }))
        dispatch(getDocumentsData({ id, token: user.token }))

    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (isLoading) {
        return <Box sx={
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }
        }>
            <CircularProgress sx={
                {
                    marginBottom: '100px',
                }
            } size={100} />
        </Box>
    }


    return (
        <Container sx={{ minHeight: '100vh' }}>
            <Grid container spacing={2} sx={{ marginTop: '20px' }} >
                <Grid item xs={12} sm={8} lg={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Avatar sx={{ width: '100px', height: '100px' }} src={userData.pathFoto} />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={8} lg={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '5px' }}>
                        <Typography variant='h5'>{userData.name}</Typography>
                        <Typography variant='p'>{userData.email}</Typography>
                        <Typography variant='p'>CPF - {userData.cpf}</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={8} lg={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <Typography variant='h5'>Endereço</Typography>
                        {userData.address && (
                            <>
                                <Typography variant='p'>{userData.address.logradouro}, {userData.address.numero}</Typography>
                                <Typography variant='p'>{userData.address.cidade} / {userData.address.estado}</Typography>
                                <Typography variant='p'>{userData.address.cep}</Typography>
                            </>)}
                    </Box>
                </Grid>

                <Grid item xs={12} sm={12} lg={3} >
                    <Typography variant='h5'>Documentos</Typography>

                    <Box sx={{ height: '80px' }}>
                        {documentsData && documentsData.map((doc) => (
                            <>
                                <Box key={doc._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='p' noWrap>{doc.name}</Typography>
                                    <Button variant='outlined' color="success" href={doc.path} download={doc.name}><AiOutlineDownload /></Button>
                                </Box>

                                <Divider sx={{ margin: '5px 0' }} />
                            </>
                        ))}

                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ margin: '20px 0' }} />

            <Typography textAlign={'center'} variant='h5'>Etapas da Análise</Typography>

            <Grid container spacing={2} sx={{ marginTop: '20px', marginBottom: '40px' }} >

                <Grid item xs={12} sm={12} lg={3.9} >

                    <form name="analise_pedido" onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                            <Typography variant='h6'>Análise do pedido</Typography>
                            <Typography variant='p'>Parecer sobre os documentos do produtor</Typography>

                            {userData.analise && !userData.analise.analise_pedido ? (
                                <>
                                    <input onChange={onChange} type="file" name="analise_pedido" ref={fileInput} />
                                    <Button type="submit" variant="outlined" color="primary">Adicionar</Button>
                                </>) : (
                                <Box sx={{ display: 'flex' }}>
                                    <Button color="success" href={userData.analise && userData.analise.analise_pedido}><AiOutlineDownload size={25} /></Button>
                                    <Button onClick={() => handleDelete('analise_pedido')} color="error"><AiOutlineDelete size={25} /></Button>
                                </Box>
                            )}
                        </Box>
                    </form>


                </Grid>

                <Divider orientation="vertical" flexItem={matches} />

                <Grid item xs={12} sm={12} lg={3.9} >
                    <form name='vistoria' onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                            <Typography variant='h6'>Vistoria</Typography>
                            <Typography variant='p'>Parecer do técnico sobre a cadeia produtiva</Typography>

                            {(userData.analise && !userData.analise.vistoria) ? (userData.analise && !userData.analise.analise_pedido) ? (<FcPrivacy size={35} />) : (
                                <>
                                    <input onChange={onChange} type="file" name="vistoria" id="vistoria" ref={fileInput} />
                                    <Button type="submit" variant="outlined" color="primary">Adicionar</Button>
                                </>
                            )
                                : (
                                    <Box sx={{ display: 'flex' }}>
                                        <Button color="success" href={userData.analise && userData.analise.vistoria}><AiOutlineDownload size={25} /></Button>
                                        <Button onClick={() => handleDelete('vistoria')} color="error"><AiOutlineDelete size={25} /></Button>
                                    </Box>
                                )}
                        </Box>
                    </form>
                </Grid>

                <Divider orientation={matches ? 'vertical' : ''} flexItem={matches} />

                <Grid item xs={12} sm={12} lg={3.8} >
                    <form name="analise_laboratorial" onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>

                            <Typography variant='h6'>Análise Laboratorial</Typography>
                            <Typography variant='p'>Parecer do laboratório credenciado</Typography>

                            {userData.analise && !userData.analise.analise_laboratorial ? (!userData.analise.analise_pedido || !userData.analise.vistoria) ? (<FcPrivacy size={35} />) : (
                                <>
                                    <input onChange={onChange} type="file" name="analise_laboratorial" ref={fileInput} />
                                    <Button type="submit" variant="outlined" color="primary">Adicionar</Button>
                                </>
                            ) : (
                                <Box sx={{ display: 'flex' }}>
                                    <Button color="success" href={userData.analise && userData.analise.analise_laboratorial}><AiOutlineDownload size={25} /></Button>
                                    <Button onClick={() => handleDelete('analise_laboratorial')} color="error"><AiOutlineDelete size={25} /></Button>
                                </Box>)}
                        </Box>
                    </form>
                </Grid>

            </Grid>

        </Container>
    )
}

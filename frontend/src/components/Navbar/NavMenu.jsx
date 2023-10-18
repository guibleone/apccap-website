import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box, AppBar as MuiAppBar, Toolbar, IconButton, Typography,
    CssBaseline, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Button, Avatar, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
    TbMenu2, TbArrowNarrowLeft, TbArrowNarrowRight,
    TbSearch, TbHome2, TbUsers, TbNews, TbHome, TbMessage, TbFile, TbId, TbGlass, TbBrandZoom, TbFiles, TbMap2
} from "react-icons/tb";
import { MdLiquor, MdOutlineLiquor } from "react-icons/md";
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../../features/auth/authSlice';
import ButtonChangeRole from '../ChangeRole/ButtonChangeRole';
import { AiOutlineClose, AiOutlineUser } from 'react-icons/ai';
import { resetResume } from "../../features/resume/resumeSlice"
import { resetDocuments } from "../../features/documents/documentsSlice"
import { reset as resetAdmin } from "../../features/admin/adminSlice"
import { reset as resetProducts } from "../../features/products/productsSlice"
import { reset as resetSpreadsheet } from "../../features/spreadSheet/spreadSheetSlice"
import { resetPayments } from "../../features/payments/paymentsSlice"
import { IoDocumentsOutline } from "react-icons/io5";
import { BiUserPlus } from 'react-icons/bi';
import { colors } from '../../pages/colors';
import { useEffect } from 'react';

const drawerWidth = '65%';


const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),

    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}))



function NavMenu() {

    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onLogout = () => {
        dispatch(resetResume())
        dispatch(logout())
        dispatch(reset())
        dispatch(resetDocuments())
        dispatch(resetAdmin())
        dispatch(resetProducts())
        dispatch(resetSpreadsheet())
        dispatch(resetPayments())

        navigate('/')
    }


    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const path = useLocation();


    useEffect(() => {

        handleDrawerClose()

    }, [path]);



    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{
                backgroundColor: '#140C9F'
            }}>
                <Toolbar>

                    <Link style={{ flexGrow: 1 }} className="logo" to='/'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="151" height="20" viewBox="0 0 151 28" fill="none">
                            <path d="M14.036 4.58165L8.82963 17.2918H19.2037L14.036 4.58165ZM11.0496 1.25121H17.2899L28.2006 26.748H23.033L20.6203 20.8527H7.45087L5.07693 26.748H0.0615234L11.0496 1.25121Z" fill="#FAF8F8" />
                            <path d="M42.1744 13.502C44.2668 13.502 45.7024 13.1761 46.4811 12.5258C47.2598 11.8747 47.6483 10.7585 47.6483 9.17643C47.6483 7.51697 47.2663 6.38104 46.5008 5.76862C45.7345 5.1562 44.2923 4.84999 42.1744 4.84999H34.7093V13.502H42.1744ZM29.9614 1.25121H42.4419C45.811 1.25121 48.3126 1.86363 49.9457 3.08929C51.5796 4.31413 52.3962 6.34317 52.3962 9.17643C52.3962 12.7242 51.1071 15.0718 48.5299 16.2201C47.2532 16.8078 45.211 17.1008 42.404 17.1008H34.7093V26.748H29.9614V1.25121Z" fill="#FAF8F8" />
                            <path d="M54.8655 20.2019C54.4703 18.5935 54.272 16.5397 54.272 14.0382C54.272 11.5375 54.4703 9.48295 54.8655 7.87453C55.2606 6.26611 55.9693 4.91369 56.99 3.81644C58.0107 2.71919 59.3763 1.94049 61.0868 1.48118C62.7964 1.02187 64.9786 0.791389 67.6332 0.791389C70.5175 0.791389 73.1713 1.08525 75.5971 1.67215V5.42403C73.0693 4.81161 70.5175 4.50541 67.9394 4.50541C66.4076 4.50541 65.1449 4.60089 64.1489 4.79268C63.1537 4.98448 62.3116 5.27752 61.6226 5.67345C60.9337 6.06938 60.4101 6.65546 60.0537 7.43415C59.6957 8.21284 59.4462 9.11254 59.3071 10.1332C59.1664 11.1539 59.0964 12.4561 59.0964 14.0382C59.0964 16.0294 59.2042 17.5925 59.4216 18.7277C59.638 19.8636 60.0784 20.8143 60.7427 21.5798C61.4053 22.3454 62.2927 22.8565 63.4031 23.1117C64.5135 23.3669 66.0256 23.4945 67.9394 23.4945C70.5175 23.4945 73.0693 23.1883 75.5971 22.5759V26.3269C73.1713 26.9138 70.5175 27.2085 67.6332 27.2085C64.9539 27.2085 62.7652 26.9838 61.0678 26.5376C59.3705 26.0915 58.0107 25.326 56.99 24.2411C55.9693 23.1562 55.2606 21.8103 54.8655 20.2019Z" fill="#FAF8F8" />
                            <path d="M77.1467 20.2019C76.7516 18.5935 76.5532 16.5397 76.5532 14.0382C76.5532 11.5375 76.7516 9.48295 77.1467 7.87453C77.5418 6.26611 78.2505 4.91369 79.2712 3.81644C80.2919 2.71919 81.6575 1.94049 83.368 1.48118C85.0777 1.02187 87.2598 0.791389 89.9145 0.791389C92.7988 0.791389 95.4526 1.08525 97.8784 1.67215V5.42403C95.3505 4.81161 92.7988 4.50541 90.2207 4.50541C88.6888 4.50541 87.4261 4.60089 86.4301 4.79268C85.4349 4.98448 84.5929 5.27752 83.9039 5.67345C83.2149 6.06938 82.6914 6.65546 82.335 7.43415C81.9769 8.21284 81.7275 9.11254 81.5884 10.1332C81.4476 11.1539 81.3777 12.4561 81.3777 14.0382C81.3777 16.0294 81.4855 17.5925 81.7028 18.7277C81.9193 19.8636 82.3597 20.8143 83.0239 21.5798C83.6866 22.3454 84.5739 22.8565 85.6843 23.1117C86.7948 23.3669 88.3069 23.4945 90.2207 23.4945C92.7988 23.4945 95.3505 23.1883 97.8784 22.5759V26.3269C95.4526 26.9138 92.7988 27.2085 89.9145 27.2085C87.2351 27.2085 85.0464 26.9838 83.3491 26.5376C81.6518 26.0915 80.2919 25.326 79.2712 24.2411C78.2505 23.1562 77.5418 21.8103 77.1467 20.2019Z" fill="#FAF8F8" />
                            <path d="M112.578 4.58165L107.372 17.2918H117.746L112.578 4.58165ZM109.592 1.25121H115.832L126.743 26.748H121.575L119.162 20.8527H105.993L103.619 26.748H98.6035L109.592 1.25121Z" fill="#FAF8F8" />
                            <path d="M140.717 13.502C142.809 13.502 144.245 13.1761 145.024 12.5258C145.802 11.8747 146.191 10.7585 146.191 9.17643C146.191 7.51697 145.809 6.38104 145.043 5.76862C144.277 5.1562 142.835 4.84999 140.717 4.84999H133.252V13.502H140.717ZM128.504 1.25121H140.984C144.354 1.25121 146.855 1.86363 148.488 3.08929C150.122 4.31413 150.939 6.34317 150.939 9.17643C150.939 12.7242 149.65 15.0718 147.072 16.2201C145.796 16.8078 143.753 17.1008 140.947 17.1008H133.252V26.748H128.504V1.25121Z" fill="#FAF8F8" />
                        </svg>
                    </Link>


                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerOpen}
                        sx={{ ...(open && { display: 'none' }) }}
                    >
                        <TbMenu2 />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                    },
                }}
                variant="persistent"
                anchor="right"
                open={open}
                PaperProps={{
                    sx: {
                        backgroundColor: "#140C9F",
                        color: "#FAF8F8",
                    }
                }}
            >
                <DrawerHeader sx={{
                    backgroundColor: '#140C9F',
                    color: '#FAF8F8',
                }}>
                    <IconButton style={{ color: '#FAF8F8', }} onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <TbArrowNarrowLeft /> : <TbArrowNarrowRight />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List sx={{
                    backgroundColor: '#140C9F',
                    color: '#FAF8F8',
                }}>
                    {user && (
                        <>
                            <ListItem >
                                <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>

                                    <Link style={
                                        {
                                            color: 'inherit',
                                            textDecoration: 'none',

                                        }
                                    } to="/meu-perfil">

                                        <Avatar src={user.dados_pessoais ? user.dados_pessoais.profilePhoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"

                                            sx={{ width: 46, height: 46 }} />

                                    </Link>

                                    <Box sx={{ maxWidth: '55%' }}>
                                        <Link style={
                                            {
                                                color: 'inherit',
                                                textDecoration: 'none',

                                            }
                                        } to="/meu-perfil">

                                            <Typography noWrap variant="subtitle1" component="div" sx={{ color: '#FAF8F8' }}>
                                                {user.dados_pessoais.name}
                                            </Typography>

                                        </Link>

                                        <h5 style={{ color: '#FAF8F8', fontWeight: 300 }}>
                                            {user && user.role === 'produtor associado' ? 'produtor associado' : user.role}
                                        </h5>

                                    </Box>



                                </Box>

                            </ListItem>
                        </>)}


                    {/* sem login */}

                    {(!user || (user && !user.role)) && (<>
                        <ListItem >

                            <ListItemIcon>
                                <TbHome2 style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }
                            } to="/">Início</Link>
                        </ListItem>

                        <ListItem >
                            <ListItemIcon>
                                <TbSearch style={{ color: "#FAF8F8" }} h />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }
                            } to="/rastreabilidade">Rastreabilidade</Link>
                        </ListItem>

                        <ListItem >
                            <ListItemIcon>
                                <MdLiquor style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',

                                }
                            } to="/festival-cachaca">Festival da Cachaça</Link>
                        </ListItem>

                        <ListItem >
                            <ListItemIcon>
                                <TbUsers style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Accordion sx={{
                                all: "initial",
                                backgroundColor: '#140C9F',
                                color: '#FAF8F8',
                                border: 'none',
                                boxShadow: 'none',
                            }}>
                                <AccordionSummary sx={{
                                    all: "initial",
                                    color: '#FAF8F8',
                                }}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    Quem somos ?
                                </AccordionSummary>

                                <AccordionDetails sx={{
                                    all: "initial",
                                    color: '#FAF8F8',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                }}>
                                    <Link style={
                                        {
                                            color: 'inherit',
                                            textDecoration: 'none',

                                        }
                                    } to="/quem-somos#associacao">
                                        <Box sx={{
                                            display: 'flex',
                                            gap: '5px',
                                        }}>
                                            <AiOutlineUser /><h5 className='white regular'>Associação</h5>
                                        </Box>
                                    </Link>
                                    <Link style={
                                        {
                                            color: 'inherit',
                                            textDecoration: 'none',

                                        }
                                    } to="/quem-somos#produtores">
                                        <Box sx={{
                                            display: 'flex',
                                            gap: '5px'
                                        }}><MdOutlineLiquor /><h5 className='white regular'>Produtores</h5>
                                        </Box>
                                    </Link>
                                    <Link style={
                                        {
                                            color: 'inherit',
                                            textDecoration: 'none',

                                        }
                                    } to="/quem-somos#ig">
                                        <Box sx={{
                                            display: 'flex',
                                            gap: '5px'
                                        }}><TbMap2 /><h5 className='white regular'>IG</h5>
                                        </Box>
                                    </Link>

                                    <Link style={
                                        {
                                            color: 'inherit',
                                            textDecoration: 'none',

                                        }
                                    } to="/quem-somos#associar">
                                        <Box sx={{
                                            display: 'flex',
                                            gap: '5px'
                                        }}><BiUserPlus /><h5 className='white regular'>Credenciamento</h5>
                                        </Box>
                                    </Link>
                                </AccordionDetails>

                            </Accordion>

                        </ListItem>

                        <ListItem >
                            <ListItemIcon>
                                <TbNews style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',

                                }
                            } to="/blog">Blog</Link>
                        </ListItem>

                        <ListItem >
                            <ListItemIcon>
                                <IoDocumentsOutline style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',

                                }
                            } to="/documentos">Documentos</Link>
                        </ListItem>

                    </>)}

                    {/*presidente */}

                    {user && user.role === 'presidente' && <>
                        <ListItem >

                            <ListItemIcon>
                                <TbHome2 style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }
                            } to="/">Início</Link>
                        </ListItem>

                        <ListItem >

                            <ListItemIcon>
                                <TbMessage style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }
                            } to="/reunioes">Reuniões</Link>
                        </ListItem>


                        <ListItem >

                            <ListItemIcon>
                                <TbUsers style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }
                            } to="/produtores">Produtores</Link>
                        </ListItem>

                    </>}


                    {/* produtor */}

                    {user && (user.role === 'produtor' || user.role === 'produtor_associado') && <>
                        <ListItem >
                            <ListItemIcon>
                                <TbUsers style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',

                                }
                            } to="/">Início</Link>
                        </ListItem>

                        <ListItem >
                            <ListItemIcon>
                                <TbNews style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',

                                }
                            } to="/produtos">Produtos</Link>
                        </ListItem>

                        <ListItem >
                            <ListItemIcon>
                                <TbId style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',

                                }
                            } to="/credencial">Credencial</Link>
                        </ListItem>
                    </>}

                    {/* admin */}

                    {user && user.role === 'admin' && <>

                        <ListItem >
                            <ListItemIcon>
                                <TbHome style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',

                                }
                            } to="/">Início</Link>
                        </ListItem>

                        <ListItem >
                            <ListItemIcon>
                                <TbNews style={{ color: "#FAF8F8" }} />
                            </ListItemIcon>
                            <Link style={
                                {
                                    color: 'inherit',
                                    textDecoration: 'none',

                                }
                            } to="/produtos">Publicações</Link>
                        </ListItem>

                    </>}

                </List>

                {/* tesoureiro */}
                {user && user.role === 'tesoureiro' && <>
                    <ListItem >
                        <ListItemIcon>
                            <TbHome style={{ color: "#FAF8F8" }} />
                        </ListItemIcon>
                        <Link style={
                            {
                                color: 'inherit',
                                textDecoration: 'none',

                            }
                        } to="/">Início</Link>
                    </ListItem>

                    <ListItem >
                        <ListItemIcon>
                            <TbFile style={{ color: "#FAF8F8" }} />
                        </ListItemIcon>
                        <Link style={
                            {
                                color: 'inherit',
                                textDecoration: 'none',

                            }
                        } to="/balancos">Balanços</Link>
                    </ListItem>

                </>}

                {/* conselho regulador */}
                {user && user.role === 'conselho' && <>
                    <ListItem >
                        <ListItemIcon>
                            <TbHome style={{ color: "#FAF8F8" }} />
                        </ListItemIcon>
                        <Link style={
                            {
                                color: 'inherit',
                                textDecoration: 'none',

                            }
                        } to="/">Início</Link>
                    </ListItem>

                    <ListItem >
                        <ListItemIcon>
                            <TbId style={{ color: "#FAF8F8" }} />
                        </ListItemIcon>
                        <Link style={
                            {
                                color: 'inherit',
                                textDecoration: 'none',

                            }
                        } to="/credenciamento">Credenciamento</Link>
                    </ListItem>

                    <ListItem >
                        <ListItemIcon>
                            <MdOutlineLiquor style={{ color: "#FAF8F8" }} />
                        </ListItemIcon>
                        <Link style={
                            {
                                color: 'inherit',
                                textDecoration: 'none',

                            }
                        } to="/produtos-conselho">Produtos</Link>
                    </ListItem>

                    <ListItem >
                        <ListItemIcon>
                            <TbMessage style={{ color: "#FAF8F8" }} />
                        </ListItemIcon>
                        <Link style={
                            {
                                color: 'inherit',
                                textDecoration: 'none',

                            }
                        } to="/reunioes">Reuniões</Link>
                    </ListItem>

                </>}

                {/* secretário */}
                {user && user.role === 'secretario' && <>
                    <ListItem >
                        <ListItemIcon>
                            <TbHome style={{ color: "#FAF8F8" }} />
                        </ListItemIcon>
                        <Link style={
                            {
                                color: 'inherit',
                                textDecoration: 'none',

                            }
                        } to="/">Início</Link>
                    </ListItem>

                    <ListItem >
                        <ListItemIcon>
                            <TbMessage style={{ color: "#FAF8F8" }} />
                        </ListItemIcon>
                        <Link style={
                            {
                                color: 'inherit',
                                textDecoration: 'none',

                            }
                        } to="/reunioes">Reuniões</Link>
                    </ListItem>

                    <ListItem >
                        <ListItemIcon>
                            <TbFiles style={{ color: "#FAF8F8" }} />
                        </ListItemIcon>
                        <Link style={
                            {
                                color: 'inherit',
                                textDecoration: 'none',

                            }
                        } to="/relatorios">Relatórios</Link>
                    </ListItem>


                </>}


                <List>

                    {user && (
                        ((user.role !== 'admin' && (user.role !== 'user')) || user.oldRole)
                            ?
                            <ListItem sx={{ justifyContent: 'center' }}>
                                <ButtonChangeRole />
                            </ListItem>
                            : null
                    )}


                    {!user ? (
                        <>
                            <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
                                <button className='button-white' onClick={() => navigate('/entrar')}>Área Produtor</button>
                            </ListItem>
                        </>
                    ) : (

                        <ListItem sx={{ justifyContent: 'center' }}>
                            <button className='button-white ' style={{
                                width: '85%',
                            }} onClick={onLogout}>
                                Sair
                            </button>
                        </ListItem>
                    )}


                </List>
            </Drawer>
        </Box >
    )
}



export default NavMenu
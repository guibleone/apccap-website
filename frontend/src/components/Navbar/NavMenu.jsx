import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box, AppBar as MuiAppBar, Toolbar, IconButton, Typography,
    CssBaseline, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Button, Avatar
} from '@mui/material';
import {
    TbMenu2, TbArrowNarrowLeft, TbArrowNarrowRight,
    TbSearch, TbHome2, TbUsers, TbNews
} from "react-icons/tb";
import { MdLiquor } from "react-icons/md";

import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice';
import ButtonChangeRole from '../ChangeRole/ButtonChangeRole';


const drawerWidth = 240;


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

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar sx={
                {
                    backgroundColor: '#140C9F',

                }
            } position="fixed" open={open}>
                <Toolbar>

                    <Link style={
                        {
                            color: 'inherit',
                            textDecoration: 'none',
                            flexGrow: 1,
                            fontSize: '1.3rem',
                            fontWeight: 'bold',

                        }
                    } to="/">APCCAP</Link>


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
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <TbArrowNarrowLeft /> : <TbArrowNarrowRight />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem >
                        <ListItemIcon>
                            <TbHome2 />
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
                            <TbSearch />
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
                            <MdLiquor />
                        </ListItemIcon>
                        <Link style={
                            {
                                color: 'inherit',
                                textDecoration: 'none',

                            }
                        } to="/festival-cachaca">Festival da Cachaça</Link>
                    </ListItem>

                    <Divider />

                    <ListItem >
                        <ListItemIcon>
                            <TbUsers />
                        </ListItemIcon>
                        <Link style={
                            {
                                color: 'inherit',
                                textDecoration: 'none',

                            }
                        } to="/quem-somos">Quem Somos</Link>
                    </ListItem>

                    <ListItem >
                        <ListItemIcon>
                            <TbNews />
                        </ListItemIcon>
                        <Link style={
                            {
                                color: 'inherit',
                                textDecoration: 'none',

                            }
                        } to="/blog">Blog</Link>
                    </ListItem>



                </List>
                <Divider />
                <List>

                    <Box sx={
                        {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px',
                            marginBlock: '10px',
                        }
                    }>
                        {!user ? (
                            <>
                                <Button variant="contained" color="success" href="/entrar">Entrar</Button>
                                <Button variant="contained" color="primary" href="/registrar">Registrar</Button>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                <Link style={
                                    {
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }
                                }
                                    to="/meu-perfil">

                                    <Avatar src={user.pathFoto ? user.pathFoto : 'https://placehold.co/600x400'} alt="Foto de Perfil"

                                        sx={{ width: 36, height: 36 }} />

                                </Link>

                                <Button fullWidth variant="contained" color="error" onClick={() => dispatch(logout(), navigate('/'))}>Sair</Button>

                                {user && (
                                    ((user.role !== 'admin') || user.oldRole)
                                        ? <ButtonChangeRole />
                                        : null
                                )}
                            </Box>

                        )}

                    </Box>

                </List>
            </Drawer>
        </Box>
    )
}



export default NavMenu
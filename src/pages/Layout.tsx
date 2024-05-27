import {Link, Outlet} from 'react-router-dom';
import {AppBar, Box, Drawer, List, ListItem, ListItemText, Toolbar, Typography} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';

const navItems = [
    {path: '/', label: 'Домашняя страница'},
    {path: '/employees', label: 'Работники театра'},
    {path: '/plays', label: 'Пьесы'},
    {path: '/performances', label: 'Спектакли'},
    {path: '/authors', label: 'Авторы'},
    {path: '/actors', label: 'Актёры'},
    {path: '/castings', label: 'Кастинги'},
    {path: '/roles', label: 'Роли'},
    {path: '/tickets', label: 'Билеты'},
    {path: '/subscriptions', label: 'Оформление абонемента'},
    {path: '/places', label: 'Свободные места'},
    {path: '/performancesinfo', label: 'Информация о спектаклях'},
];

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#2e2e2e',
        },
        primary: {
            main: '#1976d2',
        },
    },
});

function Layout() {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{display: 'flex'}}>
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Большой театр
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {width: 240, boxSizing: 'border-box'},
                    }}
                >
                    <Toolbar/>
                    <Box sx={{overflow: 'auto'}}>
                        <List>
                            {navItems.map((item) => (
                                <ListItem button component={Link} to={item.path} key={item.path}>
                                    <ListItemText primary={item.label}/>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
                <Box component="main" sx={{flexGrow: 1, p: 3}}>
                    <Toolbar/>
                    <Outlet/>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Layout;

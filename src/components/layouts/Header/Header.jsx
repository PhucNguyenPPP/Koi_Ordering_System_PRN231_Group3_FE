import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import useAuth from '../../../hooks/useAuth';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logout } from '../../../api/AuthenApi';
import { useState } from 'react';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

function Header() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleCartClick = () => {
        navigate('/cart');
    };

    const handleClickLogout = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await Logout(refreshToken);
        if (response.ok) {
            setAnchorEl(null);
            handleMobileMenuClose();
            await logout();
            navigate("/");
        }
    };

    const handleClickOrderHistory = () => {
        navigate("/order-history");
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {user && user?.roleName == "Customer" && (
                <MenuItem onClick={handleClickOrderHistory}>My Purchase</MenuItem>
            )}
            <MenuItem onClick={handleClickLogout}>Sign Out</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    const handleSearch = (event) => {
        event.preventDefault();
        if (location.pathname !== '/') {
            navigate('/', { state: { searchQuery: searchQuery } });
        } else {
            navigate('/', { state: { searchQuery: searchQuery } });
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ backgroundColor: '#C71125', height: '70px' }}>
                <Toolbar>
                    <Box
                        component="a"
                        href="/"
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            mr: 1,
                        }}
                    >
                        <img src="/image/logo.png" alt="Logo" style={{ height: '60px' }} />
                    </Box>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <form onSubmit={handleSearch}>
                            <StyledInputBase
                                placeholder="Search koi name..."
                                inputProps={{ 'aria-label': 'search' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />

                    {(user?.roleName == "KoiFarmManager"
                        || user?.roleName == "Customer"
                        || user?.roleName == "Admin"
                        || user?.roleName == "StorageManager"
                        || user?.roleName == "Shipper"
                        || user?.roleName == "Staff")
                        ? (
                            <>
                                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                    {user?.roleName == "Customer" && (
                                        <IconButton size="large" aria-label="show 4 new mails" color="inherit" onClick={handleCartClick}>
                                            <Badge>
                                                <ShoppingCartOutlinedIcon style={{ fontSize: '30px' }} />
                                            </Badge>
                                        </IconButton>
                                    )}

                                    <IconButton
                                        size="large"
                                        edge="end"
                                        aria-label="account of current user"
                                        aria-controls={menuId}
                                        aria-haspopup="true"
                                        onClick={handleProfileMenuOpen}
                                        color="inherit"
                                    >
                                        <AccountCircle style={{ fontSize: '30px' }} />
                                    </IconButton>
                                </Box>
                                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                    <IconButton
                                        size="large"
                                        aria-label="show more"
                                        aria-controls={mobileMenuId}
                                        aria-haspopup="true"
                                        onClick={handleMobileMenuOpen}
                                        color="inherit"
                                    >
                                        <MoreIcon />
                                    </IconButton>
                                </Box>
                            </>

                        ) : (
                            <Box className="text-white">
                                <a href='/login' className='mr-8 underline'>Sign In</a>
                                <a href='/role-signup' className='underline'>Sign Up</a>
                            </Box>
                        )}
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}
export default Header;
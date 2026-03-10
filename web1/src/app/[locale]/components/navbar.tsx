'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  Badge,
  Avatar,
  Typography,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingBag as ShoppingBagIcon,
  Favorite as FavoriteIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Features', href: '/features' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // ✅ Mark component as client-mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Scroll logic (client only)
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // ⛔ Prevent SSR hydration mismatch
  if (!mounted) return null;

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  // Mobile Drawer
  const drawer = (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #1976d2, #00bcd4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        WINTENSCARE
      </Typography>

      <Divider />

      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component="a"
              href={item.href}
              sx={{
                textAlign: 'center',
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: pathname === item.href ? 700 : 500,
                  color:
                    pathname === item.href
                      ? 'primary.main'
                      : 'text.primary',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: scrolled ? 'white' : 'transparent',
          boxShadow: scrolled
            ? '0 4px 20px rgba(0,0,0,0.1)'
            : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Typography
              variant="h5"
              component="a"
              href="/"
              sx={{
                textDecoration: 'none',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1976d2, #00bcd4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              WINTENSCARE
            </Typography>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component="a"
                  href={item.href}
                  sx={{
                    fontWeight:
                      pathname === item.href ? 700 : 500,
                    color:
                      pathname === item.href
                        ? 'primary.main'
                        : 'text.primary',
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Desktop Actions */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <IconButton>
                <Badge badgeContent={2} color="error">
                  <ShoppingBagIcon />
                </Badge>
              </IconButton>

              <IconButton>
                <Badge badgeContent={4} color="error">
                  <FavoriteIcon />
                </Badge>
              </IconButton>

              <IconButton onClick={handleUserMenuOpen}>
                <Avatar sx={{ width: 32, height: 32 }}>JS</Avatar>
              </IconButton>

              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
              >
                <MenuItem>My Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <Divider />
                <MenuItem sx={{ color: 'error.main' }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 260,
            borderRadius: '12px 0 0 12px',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Toolbar /> {/* Spacer */}
    </>
  );
}

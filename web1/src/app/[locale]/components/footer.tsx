'use client';

import React from 'react';
import {
  Container,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';

/* ---------------- types ---------------- */

interface FooterProps {
  companyName?: string;
}

interface FooterLink {
  label: string;
  href: string;
}

/* ---------------- styled layout ---------------- */

const FooterSection = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(4),

  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(4),
  },
}));

const MainRow = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(6),
  marginBottom: theme.spacing(4),

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
}));

const CompanyBlock = styled('div')(({ theme }) => ({
  flex: '1 1 40%',
  maxWidth: 400,
}));

const LinksRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 60%',
  justifyContent: 'space-between',
  gap: theme.spacing(8),

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}));

const SocialRow = styled('div')({
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
});

const BottomRow = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

/* ---------------- component ---------------- */

const Footer = ({ companyName = 'WINTENSCARE' }: FooterProps) => {
  const theme = useTheme();

  const linksColumn1: FooterLink[] = [
    { label: 'About Us', href: '/about' },
    { label: 'Our Technology', href: '/technology' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ];

  const linksColumn2: FooterLink[] = [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Security Practices', href: '/security' },
    { label: 'Compliance (HIPAA/GDPR)', href: '/compliance' },
  ];

  const socialLinks = [
    { icon: <Facebook />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <LinkedIn />, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <FooterSection>
      <Container maxWidth="lg">
        <MainRow>
          {/* Company info */}
          <CompanyBlock>
            <Typography
              variant="h6"
              fontWeight={700}
              color="primary"
              gutterBottom
            >
              {companyName}
            </Typography>

            <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
              We are dedicated to building technology that strengthens human
              connection and empowers healthier lives.
            </Typography>
          </CompanyBlock>

          {/* Links */}
          <LinksRow>
            <div>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {companyName}
              </Typography>
              <Stack spacing={1.5}>
                {linksColumn1.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    underline="hover"
                    color="text.secondary"
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </div>

            <div>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Legal
              </Typography>
              <Stack spacing={1.5}>
                {linksColumn2.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    underline="hover"
                    color="text.secondary"
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </div>

            <div>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Follow Us
              </Typography>
              <SocialRow>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      color: 'text.secondary',
                      backgroundColor: theme.palette.action.hover,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.25s ease',
                      width: 40,
                      height: 40,
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </SocialRow>
            </div>
          </LinksRow>
        </MainRow>

        <Divider sx={{ my: 3 }} />

        <BottomRow>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3}>
            <Link href="/privacy" underline="hover" color="text.secondary">
              Privacy
            </Link>
            <Link href="/terms" underline="hover" color="text.secondary">
              Terms
            </Link>
          </Stack>
        </BottomRow>
      </Container>
    </FooterSection>
  );
};

export default Footer;
